import React, { useRef, useState } from 'react';

import { Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { PopoverWithArrow } from '#/src/components/common/PopoverWithArrow';
import { styled } from '#/src/theme';

const PREFIX = 'Suodatin';

const classes = {
  item: `${PREFIX}-item`,
  header: `${PREFIX}-header`,
  expandButton: `${PREFIX}-expandButton`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.item}`]: {
    padding: '10px 25px 5px 25px',
    // 22% ja 7% koska divider syö tilaa, muuten olisi 25% / 10%
    [theme.breakpoints.up('md')]: {
      flexBasis: '22%',
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: '7%',
    },
  },

  [`& .${classes.header}`]: {
    paddingLeft: '8px',
  },

  [`& .${classes.expandButton}`]: {
    height: '40px',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '16px',
    textAlign: 'center',
  },
}));

type Props = React.PropsWithChildren<{
  id: string;
  header: string;
}>;

export const Suodatin = ({ id, children, header }: Props) => {
  const { t } = useTranslation();

  const anchorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledBox className={classes.item}>
      <Typography className={classes.header} variant="h5">
        {header}
      </Typography>
      <Button
        endIcon={<MaterialIcon icon={isOpen ? 'expand_less' : 'expand_more'} />}
        onClick={() => setIsOpen(true)}
        ref={anchorRef}
        aria-label={t('haku.valitse')}
        data-testid={`valitse_${id}`}
        className={classes.expandButton}>
        {t('haku.valitse')}
      </Button>
      <PopoverWithArrow
        anchorEl={anchorRef.current}
        content={children}
        marginTop={7}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      />
    </StyledBox>
  );
};
