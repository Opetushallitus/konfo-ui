import React, { useRef, useState } from 'react';

import { makeStyles, Typography, Box, Button } from '@material-ui/core';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import PopoverWithArrow from '#/src/components/common/PopoverWithArrow';

// NOTE: Tämä koko komponentti saattaa jäädä turhaksi jos etusivun rajaimet refaktoroidaan ulkoasultaan
const useStyles = makeStyles((theme) => ({
  item: {
    padding: '10px 25px 5px 25px',
    // 22% ja 7% koska divider syö tilaa, muuten olisi 25% / 10%
    [theme.breakpoints.up('md')]: {
      flexBasis: '22%',
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: '7%',
    },
  },
  header: {
    paddingLeft: '8px',
  },
  expandButton: {
    height: '40px',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '16px',
    textAlign: 'center',
  },
}));

type Props = {
  id: string;
  SuodatinComponent: (...props: any) => JSX.Element;
  header: string;
};

export const Suodatin = ({ id, SuodatinComponent, header }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const anchorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const ExpandIcon = () => (isOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />);

  return (
    <Box className={classes.item}>
      <Typography className={classes.header} variant="h5">
        {header}
      </Typography>
      <Button
        endIcon={<ExpandIcon />}
        onClick={() => setIsOpen(true)}
        ref={anchorRef}
        aria-label={t('haku.valitse')}
        data-cy={`valitse_${id}`}
        className={classes.expandButton}>
        {t('haku.valitse')}
      </Button>
      <PopoverWithArrow
        anchorEl={anchorRef.current}
        content={<SuodatinComponent expanded summaryHidden />}
        marginTop={7}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      />
    </Box>
  );
};
