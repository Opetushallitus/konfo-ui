import React, { useState, useEffect } from 'react';

import { Close } from '@mui/icons-material';
import { Box, Dialog, styled, Typography, Button, IconButton } from '@mui/material';
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
import { LocalStorageUtil } from './LocalStorageUtil';

const RESULT_STORE_KEY = 'keskiarvotulos';

const PREFIX = 'KeskiarvoModal__';

const classes = {
  container: `${PREFIX}container`,
  calcButton: `${PREFIX}calculatebutton`,
  recalcButton: `${PREFIX}recalculatebutton`,
  buttonWrapper: `${PREFIX}buttoncontainer`,
  closeIcon: `${PREFIX}close`,
  info: `${PREFIX}info`,
};

const StyledDialog = styled(Dialog)(() => ({
  [`.${classes.container}`]: {
    backgroundColor: 'white',
    padding: '2rem 1rem',
    position: 'relative',
  },
  [`.${classes.buttonWrapper}`]: {
    textAlign: 'right',
    marginTop: '2rem',
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
    },
  },
  [`.${classes.recalcButton}`]: {
    border: `2px solid ${colors.brandGreen}`,
    color: colors.brandGreen,
    marginLeft: '1.5rem',
    fontWeight: 600,
    fontSize: '1rem',
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
};

export const KeskiArvoModal = ({ open = false, closeFn }: Props) => {
  const { t } = useTranslation();

  const [useKeskiarvoLaskuri, setUseKeskiarvoLaskuri] = useState<boolean>(true);

  const [kouluaineetToCalculate, setKouluaineetToCalculate] = useState<Kouluaineet>(
    new Kouluaineet()
  );

  const [keskiarvoToCalculate, setKeskiarvoToCalculate] = useState<Keskiarvot | null>(
    null
  );
  const [tulos, setTulos] = useState<HakupisteLaskelma | null>(null);

  useEffect(() => {
    if (tulos != null) {
      LocalStorageUtil.save(RESULT_STORE_KEY, tulos);
    }
  }, [tulos]);

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(RESULT_STORE_KEY);
    setTulos(savedResult as HakupisteLaskelma | null);
  }, []);

  const calcButtonDisabled =
    useKeskiarvoLaskuri &&
    (keskiarvoToCalculate == null ||
      keskiarvoToCalculate.lukuaineet === '' ||
      keskiarvoToCalculate.taideTaitoAineet === '' ||
      keskiarvoToCalculate.kaikki === '');

  const calculate = () => {
    if (useKeskiarvoLaskuri) {
      setTulos(keskiArvotToHakupiste(keskiarvoToCalculate as Keskiarvot));
    } else {
      setTulos(kouluaineetToHakupiste(kouluaineetToCalculate));
    }
  };

  const clearTulos = () => {
    setTulos(null);
    LocalStorageUtil.remove(RESULT_STORE_KEY);
  };

  return (
    <StyledDialog open={open} onClose={closeFn} maxWidth="lg" scroll="body">
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
