import React, { useRef } from 'react';

import {
  Box,
  Dialog,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Pistelaskuri } from '#/src/components/laskuri/Pistelaskuri';
import { styled } from '#/src/theme';

import { HakupisteLaskelma } from './Keskiarvo';

const PREFIX = 'KeskiarvoModal__';

const classes = {
  container: `${PREFIX}container`,
  closeIcon: `${PREFIX}close`,
  info: `${PREFIX}info`,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '95vw',
    margin: '0.5rem auto 4rem',
  },
  [`.${classes.container}`]: {
    backgroundColor: 'white',
    padding: '2rem 1rem',
    position: 'relative',
  },
  [`.${classes.closeIcon}`]: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  [`.${classes.info}`]: {
    paddingBottom: '0.6rem',
    borderBottom: `1px solid ${colors.grey500}`,
    marginBottom: '0.7rem',
  },
}));

type Props = {
  open: boolean;
  closeFn: () => void;
  updateTulos: (tulos: HakupisteLaskelma | null) => void;
  tulos: HakupisteLaskelma | null;
};

export const KeskiArvoModal = ({ open = false, closeFn, updateTulos, tulos }: Props) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledDialog
      open={open}
      onClose={closeFn}
      maxWidth="lg"
      fullScreen={fullScreen}
      scroll="body"
      aria-label={t('pistelaskuri.heading')}>
      <Box className={classes.container} ref={containerRef}>
        <Typography variant="h2">{t('pistelaskuri.heading')}</Typography>
        {tulos == null && (
          <Typography className={classes.info}>{t('pistelaskuri.info')}</Typography>
        )}
        <Pistelaskuri
          updateTulos={updateTulos}
          tulos={tulos}
          closeFn={closeFn}
          rootRef={containerRef}
        />
        <IconButton
          aria-label={t('sulje')}
          className={classes.closeIcon}
          onClick={closeFn}>
          <MaterialIcon icon="close" />
        </IconButton>
      </Box>
    </StyledDialog>
  );
};
