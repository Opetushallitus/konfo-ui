import React, { useEffect } from 'react';

import { Box, Typography, Input, Grid, Button } from '@mui/material';
import { matches } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { styled } from '#/src/theme';

import { SuorittanutCheckbox } from './common/SuorittanutCheckbox';
import { isValidKeskiarvo, Keskiarvot } from './Keskiarvo';
import { LocalStorageUtil, AVERAGE_STORE_KEY } from './LocalStorageUtil';

const PREFIX = 'keskiarvo__laskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
  hint: `${PREFIX}hint`,
  inputContainer: `${PREFIX}input__container`,
  changeCalcButton: `${PREFIX}changecalcbutton`,
};

const LaskuriContainer = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'embedded',
})<{ embedded: boolean }>(({ theme, embedded }) => ({
  [`& .${classes.inputContainer}`]: {
    [theme.breakpoints.down('xl')]: {
      marginTop: '1.5rem',
      '&:first-of-type': {
        marginTop: 0,
      },
    },
    [`& .${classes.input}`]: {
      border: `1px solid ${colors.grey500}`,
      padding: '0 0.5rem',
      marginTop: '0.5rem',
      maxWidth: '90%',
      '&:focus-within': {
        borderColor: colors.grey900,
      },
      '&:hover': {
        borderColor: colors.grey900,
      },
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
      },
    },
    [`& .${classes.error}`]: {
      color: colors.red,
      maxWidth: '60%',
    },
    [`& .${classes.hint}`]: {
      color: colors.grey700,
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
  p: {
    fontSize: embedded ? '0.9rem' : '1rem',
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

type KeskiarvoInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: React.ReactNode;
};

const KeskiarvoInput = ({ id, label, value, onChange, tooltip }: KeskiarvoInputProps) => {
  const { t } = useTranslation();
  const isValid = isValidKeskiarvo(value);
  const hintId = `${id}-ohje`;
  const errorId = `${id}-virhe`;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography component="label" htmlFor={id} sx={{ fontWeight: '600' }}>
          {label}
        </Typography>
        {tooltip}
      </Box>
      <Typography variant="body2" id={hintId} className={classes.hint}>
        {t('pistelaskuri.ka-placeholder')}
      </Typography>
      <Input
        id={id}
        className={classes.input}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        value={value}
        error={!isValid}
        disableUnderline={true}
        inputProps={{
          required: true,
          'aria-describedby': isValid ? hintId : `${hintId} ${errorId}`,
        }}
      />
      {!isValid && (
        <Typography variant="body2" id={errorId} className={classes.error}>
          {t('pistelaskuri.error.keskiarvo')}
        </Typography>
      )}
    </>
  );
};

export const KeskiarvoLaskuri = ({
  changeCalculator,
  updateKeskiarvoToCalculate,
  keskiarvot,
  embedded,
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
    const newKeskiArvo = assigner(keskiarvot, value);
    updateKeskiarvoToCalculate(newKeskiArvo);
  };

  return (
    <LaskuriContainer
      embedded={embedded}
      aria-label={t('pistelaskuri.keskiarvot-header')}>
      <Typography
        variant="h3"
        component={embedded ? 'h2' : 'h3'}
        sx={{ fontSize: '1.25rem' }}>
        {t('pistelaskuri.keskiarvot-header')}
      </Typography>
      <Button
        className={classes.changeCalcButton}
        onClick={() => changeCalculator(false)}>
        {t('pistelaskuri.vaihdalaskin')}
      </Button>
      <Typography sx={{ marginBottom: '1rem' }}>
        {t('pistelaskuri.pakolliset-kentat')}
      </Typography>
      <Grid
        container
        justifyContent="space-evenly"
        columns={{ xs: 1, xl: embedded ? 10 : 3 }}>
        <Grid item xs={1} xl={embedded ? 3 : 1} className={classes.inputContainer}>
          <KeskiarvoInput
            id="keskiarvo-lukuaineet"
            label={t('pistelaskuri.ka-lukuaineet')}
            value={keskiarvot?.lukuaineet}
            onChange={(val) =>
              changeKeskiarvo(val, (ka: Keskiarvot, v: string) =>
                Object.assign({}, ka, { lukuaineet: v })
              )
            }
          />
        </Grid>
        <Grid item xs={1} xl={embedded ? 4 : 1} className={classes.inputContainer}>
          <KeskiarvoInput
            id="keskiarvo-taideTaitoAineet"
            label={t('pistelaskuri.ka-taito')}
            value={keskiarvot?.taideTaitoAineet}
            onChange={(val) =>
              changeKeskiarvo(val, (ka: Keskiarvot, v: string) =>
                Object.assign({}, ka, { taideTaitoAineet: v })
              )
            }
            tooltip={
              <LabelTooltip
                title={t('pistelaskuri.taide-info')}
                sx={{ marginLeft: '3px', color: colors.brandGreen }}
              />
            }
          />
        </Grid>
        <Grid item xs={1} xl={embedded ? 3 : 1} className={classes.inputContainer}>
          <KeskiarvoInput
            id="keskiarvo-kaikki"
            label={t('pistelaskuri.ka-kaikki')}
            value={keskiarvot?.kaikki}
            onChange={(val) =>
              changeKeskiarvo(val, (ka: Keskiarvot, v: string) =>
                Object.assign({}, ka, { kaikki: v })
              )
            }
          />
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
