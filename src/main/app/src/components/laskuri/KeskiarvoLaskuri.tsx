import React, { useState, useEffect } from 'react';

import { Box, Typography, styled, Input, InputLabel, Grid, Button } from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { LabelTooltip } from '../common/LabelTooltip';
import { Keskiarvot } from './Keskiarvo';
import { LocalStorageUtil } from './LocalStorageUtil';

const AVERAGE_STORE_KEY = 'keskiarvot';

const PREFIX = 'keskiarvo__laskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
};

const LaskuriContainer = styled(Box)(() => ({
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
  },
  [`& .${classes.error}`]: {
    color: colors.red,
    maxWidth: '60%',
  },
}));

type Props = {
  changeCalculator: (value: boolean) => void;
  updateKeskiarvoToCalculate: (keskiarvo: Keskiarvot) => void;
};

const keskiArvotIsEmpty = (kat: Keskiarvot) =>
  _.matches(kat)({ lukuaineet: '', taideTaitoAineet: '', kaikki: '' });

export const KeskiarvoLaskuri = ({
  changeCalculator,
  updateKeskiarvoToCalculate,
}: Props) => {
  const { t } = useTranslation();

  const [keskiarvot, setKeskiarvot] = useState<Keskiarvot>({
    lukuaineet: '',
    taideTaitoAineet: '',
    kaikki: '',
  });

  useEffect(() => {
    if (!keskiArvotIsEmpty(keskiarvot)) {
      LocalStorageUtil.save(AVERAGE_STORE_KEY, keskiarvot);
    }
  }, [keskiarvot]);

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(AVERAGE_STORE_KEY);
    if (savedResult) {
      setKeskiarvot(savedResult as Keskiarvot);
      updateKeskiarvoToCalculate(savedResult as Keskiarvot);
    } else {
      setKeskiarvot({
        lukuaineet: '',
        taideTaitoAineet: '',
        kaikki: '',
      });
    }
  }, [updateKeskiarvoToCalculate]);

  const isValidKeskiarvo = (ka: string) => {
    const withDot = ka.replace(',', '.');
    return (
      '' === ka ||
      (_.isNumber(Number(withDot)) && Number(withDot) >= 4 && Number(withDot) <= 10)
    );
  };

  const changeKeskiarvo = (event: React.ChangeEvent<HTMLInputElement>, avain: string) => {
    const uusiArvo = event.target.value;
    let newKeskiArvo = { ...keskiarvot } as Keskiarvot;
    newKeskiArvo[avain as keyof Keskiarvot] = uusiArvo;
    setKeskiarvot(newKeskiArvo);
    if (isValidKeskiarvo(uusiArvo)) {
      updateKeskiarvoToCalculate(newKeskiArvo);
    }
  };

  return (
    <LaskuriContainer>
      <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>
        {t('pistelaskuri.keskiarvot-header')}
      </Typography>
      <Typography>
        {t('pistelaskuri.vaihdalaskin-1')}
        <Button
          onClick={() => changeCalculator(false)}
          sx={{ padding: 0, verticalAlign: 'unset', fontSize: '1rem' }}>
          {t('pistelaskuri.vaihdalaskin-2')}
        </Button>
      </Typography>
      <Grid container justifyContent="space-evenly" columns={{ xs: 1, sm: 1, md: 3 }}>
        <Grid item xs={1} sm={1} md={1}>
          <InputLabel>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('pistelaskuri.ka-lukuaineet')}
            </Typography>
            <Input
              className={classes.input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeKeskiarvo(event, 'lukuaineet')
              }
              value={keskiarvot?.lukuaineet}
              error={!isValidKeskiarvo(keskiarvot?.lukuaineet)}
              disableUnderline={true}></Input>
          </InputLabel>
          {!isValidKeskiarvo(keskiarvot?.lukuaineet) && (
            <Typography variant="body2" className={classes.error}>
              {t('pistelaskuri.error.keskiarvo')}
            </Typography>
          )}
        </Grid>
        <Grid
          item
          sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
          xs={1}
          sm={1}
          md={1}>
          <InputLabel>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('pistelaskuri.ka-taito')}
            </Typography>
            <Input
              className={classes.input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeKeskiarvo(event, 'taideTaitoAineet')
              }
              value={keskiarvot?.taideTaitoAineet}
              disableUnderline={true}></Input>
          </InputLabel>
          <LabelTooltip
            title={t('pistelaskuri.taide-info')}
            sx={{ marginLeft: '3px' }}></LabelTooltip>
          {!isValidKeskiarvo(keskiarvot?.taideTaitoAineet) && (
            <Typography variant="body2" className={classes.error}>
              {t('pistelaskuri.error.keskiarvo')}
            </Typography>
          )}
        </Grid>
        <Grid item xs={1} sm={1} md={1}>
          <InputLabel>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('pistelaskuri.ka-kaikki')}
            </Typography>
            <Input
              className={classes.input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeKeskiarvo(event, 'kaikki')
              }
              value={keskiarvot?.kaikki}
              disableUnderline={true}></Input>
          </InputLabel>
          {!isValidKeskiarvo(keskiarvot?.kaikki) && (
            <Typography variant="body2" className={classes.error}>
              {t('pistelaskuri.error.keskiarvo')}
            </Typography>
          )}
        </Grid>
      </Grid>
    </LaskuriContainer>
  );
};
