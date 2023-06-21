import React, { useEffect } from 'react';

import { Box, Typography, styled, Input, InputLabel, Grid, Button } from '@mui/material';
import { matches } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

import { SuorittanutCheckbox } from './common/SuorittanutCheckbox';
import { isValidKeskiarvo, Keskiarvot } from './Keskiarvo';
import { LocalStorageUtil, AVERAGE_STORE_KEY } from './LocalStorageUtil';
import { LabelTooltip } from '../common/LabelTooltip';

const PREFIX = 'keskiarvo__laskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
  inputContainer: `${PREFIX}input__container`,
  changeCalcButton: `${PREFIX}changecalcbutton`,
};

const LaskuriContainer = styled(Box)(({ theme }) => ({
  [`& .${classes.inputContainer}`]: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '1.5rem',
      '&:first-of-type': {
        marginTop: 0,
      },
    },
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
  },
  [`& .${classes.changeCalcButton}`]: {
    margin: '1rem 0 1.5rem 0',
    border: `2px solid ${colors.brandGreen}`,
    color: colors.brandGreen,
    fontWeight: 600,
  },
  button: {
    fontSize: '1rem',
    fontWeight: 'semibold',
  },
}));

type Props = {
  changeCalculator: (value: boolean) => void;
  updateKeskiarvoToCalculate: (keskiarvo: Keskiarvot) => void;
  keskiarvot: Keskiarvot;
  embedded: boolean;
};

const keskiArvotIsEmpty = (kat: Keskiarvot) =>
  matches(kat)({ lukuaineet: '', taideTaitoAineet: '', kaikki: '', suorittanut: true });

export const KeskiarvoLaskuri = ({
  changeCalculator,
  updateKeskiarvoToCalculate,
  keskiarvot,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!keskiArvotIsEmpty(keskiarvot)) {
      LocalStorageUtil.save(AVERAGE_STORE_KEY, keskiarvot);
    }
  }, [keskiarvot]);

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(AVERAGE_STORE_KEY);
    if (savedResult) {
      updateKeskiarvoToCalculate(savedResult as Keskiarvot);
    } else {
      updateKeskiarvoToCalculate({
        lukuaineet: '',
        taideTaitoAineet: '',
        kaikki: '',
        suorittanut: true,
      });
    }
  }, [updateKeskiarvoToCalculate]);

  const changeKeskiarvo = (
    value: string,
    assigner: (ka: Keskiarvot, val: string) => Keskiarvot
  ) => {
    let newKeskiArvo = assigner(keskiarvot, value);
    updateKeskiarvoToCalculate(newKeskiArvo);
  };

  return (
    <LaskuriContainer>
      <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>
        {t('pistelaskuri.keskiarvot-header')}
      </Typography>
      <Button
        className={classes.changeCalcButton}
        onClick={() => changeCalculator(false)}>
        {t('pistelaskuri.vaihdalaskin-1')}
      </Button>
      <Grid container justifyContent="space-evenly" columns={{ xs: 1, sm: 1, md: 3 }}>
        <Grid item xs={1} sm={1} md={1} className={classes.inputContainer}>
          <InputLabel>
            <Typography sx={{ fontWeight: '600' }}>
              {t('pistelaskuri.ka-lukuaineet')}
            </Typography>
            <Input
              className={classes.input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeKeskiarvo(event.target.value, (ka: Keskiarvot, val: string) =>
                  Object.assign({}, ka, { lukuaineet: val })
                )
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
          className={classes.inputContainer}
          item
          sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}
          xs={1}
          sm={1}
          md={1}>
          <InputLabel>
            <Typography sx={{ fontWeight: '600' }}>
              {t('pistelaskuri.ka-taito')}
            </Typography>
            <Input
              className={classes.input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeKeskiarvo(event.target.value, (ka: Keskiarvot, val: string) =>
                  Object.assign({}, ka, { taideTaitoAineet: val })
                )
              }
              value={keskiarvot?.taideTaitoAineet}
              disableUnderline={true}
            />
          </InputLabel>
          <LabelTooltip
            title={t('pistelaskuri.taide-info')}
            sx={{ marginLeft: '3px', color: colors.brandGreen }}
          />
          {!isValidKeskiarvo(keskiarvot?.taideTaitoAineet) && (
            <Typography variant="body2" className={classes.error}>
              {t('pistelaskuri.error.keskiarvo')}
            </Typography>
          )}
        </Grid>
        <Grid item xs={1} sm={1} md={1} className={classes.inputContainer}>
          <InputLabel>
            <Typography sx={{ fontWeight: '600' }}>
              {t('pistelaskuri.ka-kaikki')}
            </Typography>
            <Input
              className={classes.input}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeKeskiarvo(event.target.value, (ka: Keskiarvot, val: string) =>
                  Object.assign({}, ka, { kaikki: val })
                )
              }
              value={keskiarvot?.kaikki}
              disableUnderline={true}
            />
          </InputLabel>
          {!isValidKeskiarvo(keskiarvot?.kaikki) && (
            <Typography variant="body2" className={classes.error}>
              {t('pistelaskuri.error.keskiarvo')}
            </Typography>
          )}
        </Grid>
      </Grid>
      <SuorittanutCheckbox
        suorittanut={keskiarvot.suorittanut}
        toggleSuorittanut={() =>
          changeKeskiarvo('', (ka: Keskiarvot) =>
            Object.assign({}, ka, { suorittanut: !keskiarvot.suorittanut })
          )
        }
      />
    </LaskuriContainer>
  );
};
