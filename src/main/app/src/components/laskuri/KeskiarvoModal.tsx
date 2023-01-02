import React, { useState, useEffect } from 'react';

import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  styled,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

import { KeskiarvoAineLaskuri } from './aine/KeskiarvoAineLaskuri';
import { Kouluaineet } from './aine/Kouluaine';
import {
  Keskiarvot,
  HakupisteLaskelma,
  keskiArvotToHakupiste,
  kouluaineetToHakupiste,
} from './Keskiarvo';
import { KeskiarvoLaskuri } from './KeskiarvoLaskuri';
import { KeskiarvoTulos } from './KeskiarvoTulos';
import { LocalStorageUtil, RESULT_STORE_KEY } from './LocalStorageUtil';

const PREFIX = 'KeskiarvoModal__';

const classes = {
  container: `${PREFIX}container`,
  calcButton: `${PREFIX}calculatebutton`,
  recalcButton: `${PREFIX}recalculatebutton`,
  buttonWrapper: `${PREFIX}buttoncontainer`,
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
  [`.${classes.buttonWrapper}`]: {
    textAlign: 'right',
    marginTop: '2rem',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: '1rem',
    },
    [`.${classes.calcButton}`]: {
      border: `2px solid ${colors.brandGreen}`,
      backgroundColor: colors.brandGreen,
      color: colors.white,
      fontWeight: 600,
      fontSize: '1rem',
      '&:hover': {
        backgroundColor: colors.brandGreen,
      },
      '&:disabled': {
        backgroundColor: colors.lightGrey,
        border: `2px solid ${colors.lightGrey}`,
      },
    },
    [`.${classes.recalcButton}`]: {
      border: `2px solid ${colors.brandGreen}`,
      color: colors.brandGreen,
      marginLeft: '1.5rem',
      fontWeight: 600,
      fontSize: '1rem',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },
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

  const [useKeskiarvoLaskuri, setUseKeskiarvoLaskuri] = useState<boolean>(true);

  const [kouluaineetToCalculate, setKouluaineetToCalculate] = useState<Kouluaineet>(
    new Kouluaineet()
  );

  const [keskiarvoToCalculate, setKeskiarvoToCalculate] = useState<Keskiarvot | null>(
    null
  );

  useEffect(() => {
    if (tulos != null) {
      LocalStorageUtil.save(RESULT_STORE_KEY, tulos);
    }
  }, [tulos]);

  const calcButtonDisabled =
    useKeskiarvoLaskuri &&
    (keskiarvoToCalculate == null ||
      keskiarvoToCalculate.lukuaineet === '' ||
      keskiarvoToCalculate.taideTaitoAineet === '' ||
      keskiarvoToCalculate.kaikki === '');

  const calculate = () => {
    let laskettuTulos = useKeskiarvoLaskuri
      ? keskiArvotToHakupiste(keskiarvoToCalculate as Keskiarvot)
      : kouluaineetToHakupiste(kouluaineetToCalculate);
    updateTulos(laskettuTulos);
  };

  const clearTulos = () => {
    LocalStorageUtil.remove(RESULT_STORE_KEY);
    updateTulos(null);
  };

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
        {tulos == null && useKeskiarvoLaskuri && (
          <KeskiarvoLaskuri
            changeCalculator={setUseKeskiarvoLaskuri}
            updateKeskiarvoToCalculate={setKeskiarvoToCalculate}></KeskiarvoLaskuri>
        )}
        {tulos == null && !useKeskiarvoLaskuri && (
          <KeskiarvoAineLaskuri
            changeCalculator={setUseKeskiarvoLaskuri}
            updateKouluaineetToCalculate={
              setKouluaineetToCalculate
            }></KeskiarvoAineLaskuri>
        )}
        {tulos && <KeskiarvoTulos tulos={tulos}></KeskiarvoTulos>}
        <Box className={classes.buttonWrapper}>
          {tulos == null && (
            <Button
              disabled={calcButtonDisabled}
              className={classes.calcButton}
              onClick={calculate}>
              {t('pistelaskuri.laske')}
            </Button>
          )}
          {tulos && (
            <Button className={classes.calcButton} onClick={closeFn}>
              {t('pistelaskuri.vertaa')}
            </Button>
          )}
          {tulos && (
            <Button className={classes.recalcButton} onClick={clearTulos}>
              {t('pistelaskuri.laske-uudestaan')}
            </Button>
          )}
        </Box>
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
