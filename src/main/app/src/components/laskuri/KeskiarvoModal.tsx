import React, { useState, useEffect } from 'react';

import { Box, Dialog, styled, Typography, Button } from '@mui/material';

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
  buttonWrapper: `${PREFIX}buttoncontainer`,
};

const StyledDialog = styled(Dialog)(() => ({
  [`.${classes.container}`]: {
    backgroundColor: 'white',
    padding: '2rem 1rem',
  },
  [`.${classes.buttonWrapper}`]: {
    textAlign: 'right',
    marginTop: '0.5rem',
  },
  [`.${classes.calcButton}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
    '&:disabled': {
      backgroundColor: colors.lightGrey,
    },
  },
}));

type Props = {
  open: boolean;
  closeFn: () => void;
};

export const KeskiArvoModal = ({ open = false, closeFn }: Props) => {
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
    <StyledDialog open={open} onClose={closeFn}>
      <Box className={classes.container}>
        <Typography variant="h2">Hakupistelaskuri</Typography>
        {tulos == null && (
          <Typography>
            Arvioi peruskoulun päättötodistuksen keskiarvosi tai syötä kaikkien
            oppiaineiden arvosanat. Laskuri laskee hakupisteesi yhteishakua varten
            uusimpien valintaperusteiden mukaan.
          </Typography>
        )}
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
              Laske hakupisteet
            </Button>
          )}
          {tulos && <Button onClick={clearTulos}>Laske uudestaan</Button>}
        </Box>
      </Box>
    </StyledDialog>
  );
};
