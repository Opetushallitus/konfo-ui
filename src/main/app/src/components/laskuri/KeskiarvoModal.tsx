import React, { useState, useEffect } from 'react';

import { Close } from '@mui/icons-material';
import { Box, Dialog, styled, Typography, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

import { Keskiarvot, HakupisteLaskelma, keskiArvotToHakupiste } from './Keskiarvo';
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
};

const StyledDialog = styled(Dialog)(() => ({
  [`.${classes.container}`]: {
    backgroundColor: 'white',
    padding: '2rem 1rem',
    position: 'relative',
  },
  [`.${classes.buttonWrapper}`]: {
    textAlign: 'right',
    marginTop: '0.5rem',
  },
  [`.${classes.calcButton}`]: {
    border: `2px solid ${colors.brandGreen}`,
    backgroundColor: colors.brandGreen,
    color: colors.white,
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
  },
  [`.${classes.closeIcon}`]: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
}));

type Props = {
  open: boolean;
  closeFn: () => void;
};

export const KeskiArvoModal = ({ open = false, closeFn }: Props) => {
  const { t } = useTranslation();

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
    keskiarvoToCalculate == null ||
    keskiarvoToCalculate.lukuaineet === '' ||
    keskiarvoToCalculate.taideTaitoAineet === '' ||
    keskiarvoToCalculate.kaikki === '';

  const calculate = () => {
    setTulos(keskiArvotToHakupiste(keskiarvoToCalculate as Keskiarvot));
  };

  const clearTulos = () => {
    setTulos(null);
    LocalStorageUtil.remove(RESULT_STORE_KEY);
  };

  return (
    <StyledDialog open={open} onClose={closeFn} maxWidth="lg" scroll="body">
      <Box className={classes.container}>
        <Typography variant="h2">{t('pistelaskuri.heading')}</Typography>
        {tulos == null && <Typography>{t('pistelaskuri.info')}</Typography>}
        {tulos == null && (
          <KeskiarvoLaskuri
            updateKeskiarvoToCalculate={setKeskiarvoToCalculate}></KeskiarvoLaskuri>
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
