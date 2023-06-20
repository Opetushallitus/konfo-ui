import React from 'react';

import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  styled,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { Pistelaskuri } from '#/src/components/laskuri/Pistelaskuri';

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
    borderBottom: `1px solid ${colors.lighterGrey}`,
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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledDialog
      open={open}
      onClose={closeFn}
      maxWidth="lg"
      fullScreen={fullScreen}
      scroll="body">
      <Box className={classes.container}>
        <Typography variant="h2">{t('pistelaskuri.heading')}</Typography>
        {tulos == null && (
          <Typography className={classes.info}>{t('pistelaskuri.info')}</Typography>
        )}
        <Pistelaskuri updateTulos={updateTulos} tulos={tulos} closeFn={closeFn} />
        <IconButton
          aria-label={t('sulje')}
          className={classes.closeIcon}
          onClick={closeFn}>
          <Close />
        </IconButton>
      </Box>
    </StyledDialog>
  );
};
