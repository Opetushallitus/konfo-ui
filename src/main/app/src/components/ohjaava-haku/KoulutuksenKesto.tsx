import React, { useState } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { colors } from '#/src/colors';
import { MaksunMaaraInput } from '#/src/components/ohjaava-haku/common/MaksunMaaraInput';
import { Rajain } from '#/src/components/ohjaava-haku/Kysymys';
import {
  getChangedKestoInMonths,
  getYearsAndMonthsFromRangeValue,
} from '#/src/components/ohjaava-haku/utils';
import { KoulutuksenKestoSlider } from '#/src/components/suodattimet/common/KoulutuksenKestoSuodatin';
import { NDASH } from '#/src/constants';
import { styled } from '#/src/theme';
import { RajainItem, NumberRangeRajainItem } from '#/src/types/SuodatinTypes';

const DEFAULT_UPPERLIMIT = 72;
const PREFIX = 'ohjaava-haku__';

const classes = {
  root: `${PREFIX}root`,
  input: `${PREFIX}input`,
  inputContainer: `${PREFIX}input-container`,
  lyhenne: `${PREFIX}lyhenne`,
  ndash: `${PREFIX}ndash`,
  error: `${PREFIX}error`,
};

const Root = styled('div')`
  & .${classes.root} {
    display: flex;
  }
  & .${classes.input} {
    display: flex;
    gap: 0.5rem;
  }
  & .${classes.inputContainer} {
    display: flex;
    gap: 1.5rem;
  }
  & .${classes.lyhenne} {
    align-self: center;
  }
  & .${classes.ndash} {
    display: flex;
    justify-content: center;
    align-items: end;
  }
  & .${classes.error} {
    color: ${colors.red};
    margin-top: 1rem;
  }
`;

export const KoulutuksenKesto = ({
  rajainItems,
  allSelectedRajainValues,
  setAllSelectedRajainValues,
  setErrorKey,
  errorKey,
}: {
  rajainItems: Array<RajainItem>;
  allSelectedRajainValues: Rajain;
  setAllSelectedRajainValues: (val: Rajain) => void;
  setErrorKey: (errorKey: string) => void;
  errorKey: string;
}) => {
  const { t } = useTranslation();

  const rajainItem = rajainItems?.[0] as NumberRangeRajainItem;
  const undefinedRajainValues = [0, rajainItem?.upperLimit || DEFAULT_UPPERLIMIT];

  const initialEnintaan = rajainItem?.max || undefinedRajainValues[1];
  const initialEnintaanV = Math.floor(initialEnintaan / 12);
  const initialEnintaanKk = initialEnintaan % 12;
  const [rangeValues, setRangeValues] = useState([
    rajainItem?.min || undefinedRajainValues[0],
    initialEnintaan || undefinedRajainValues[1],
  ]);

  const [vahintaan, setVahintaan] = useState(['0', '0']);
  const [enintaan, setEnintaan] = useState([
    initialEnintaanV.toString(),
    initialEnintaanKk.toString(),
  ]);

  const handleSliderValueCommit = (newValues: Array<number>) => {
    setVahintaan(getYearsAndMonthsFromRangeValue(newValues[0]));
    setEnintaan(getYearsAndMonthsFromRangeValue(newValues[1]));
    setRangeValues(newValues);
    setAllSelectedRajainValues({
      ...allSelectedRajainValues,
      koulutuksenkestokuukausina: {
        koulutuksenkestokuukausina_min: newValues[0],
        koulutuksenkestokuukausina_max: newValues[1],
      },
    });
  };

  const handleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedValue = event.target.value;

    const newValues = match(event.target.id)
      .with('vahintaan-vuosi', () => {
        setVahintaan([changedValue, vahintaan[1]]);
        const kestoInMonths = getChangedKestoInMonths(changedValue, vahintaan[1]);
        return [kestoInMonths, rangeValues[1]];
      })
      .with('vahintaan-kk', () => {
        setVahintaan([vahintaan[0], changedValue]);
        const kestoInMonths = getChangedKestoInMonths(vahintaan[0], changedValue);
        return [kestoInMonths, rangeValues[1]];
      })
      .with('enintaan-vuosi', () => {
        setEnintaan([changedValue, enintaan[1]]);
        const kestoInMonths = getChangedKestoInMonths(changedValue, enintaan[1]);
        return [rangeValues[0], kestoInMonths];
      })
      .with('enintaan-kk', () => {
        setEnintaan([enintaan[0], changedValue]);
        const kestoInMonths = getChangedKestoInMonths(enintaan[0], changedValue);
        return [rangeValues[0], kestoInMonths];
      })
      .otherwise(() => rangeValues);

    newValues[0] > newValues[1]
      ? setErrorKey('vahintaan-suurempi-kuin-enintaan')
      : setErrorKey('');
    setRangeValues(newValues);
    setAllSelectedRajainValues({
      ...allSelectedRajainValues,
      koulutuksenkestokuukausina: {
        koulutuksenkestokuukausina_min: newValues[0],
        koulutuksenkestokuukausina_max: newValues[1],
      },
    });
  };

  const unitComponent = (id: string) => (
    <Typography className={classes.lyhenne}>{t(`haku.lyhenne-${id}`)}</Typography>
  );

  return (
    <Root className={classes.root}>
      <Grid container direction="column" wrap="nowrap">
        <Grid
          item
          container
          direction="row"
          wrap="nowrap"
          className={classes.inputContainer}>
          <Grid item container direction="column" wrap="nowrap" xs={3}>
            <Typography sx={{ fontWeight: '600' }}>
              {t(
                'ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-vahintaan'
              )}
            </Typography>
            <Box className={classes.inputContainer}>
              <MaksunMaaraInput
                id="vahintaan-vuosi"
                value={vahintaan[0]}
                handleInputValueChange={handleInputValueChange}
                unitComponent={unitComponent('vuosi')}
              />
              <MaksunMaaraInput
                id="vahintaan-kk"
                value={vahintaan[1]}
                handleInputValueChange={handleInputValueChange}
                unitComponent={unitComponent('kuukausi')}
              />
            </Box>
          </Grid>
          <Grid item className={classes.ndash}>
            <Typography sx={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              {NDASH}
            </Typography>
          </Grid>
          <Grid item container direction="column" wrap="nowrap" xs={3}>
            <Typography sx={{ fontWeight: '600' }}>
              {t('ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-enintaan')}
            </Typography>
            <Box display="flex" className={classes.inputContainer}>
              <MaksunMaaraInput
                id="enintaan-vuosi"
                value={enintaan[0]}
                handleInputValueChange={handleInputValueChange}
                unitComponent={unitComponent('vuosi')}
              />
              <MaksunMaaraInput
                id="enintaan-kk"
                value={enintaan[1]}
                handleInputValueChange={handleInputValueChange}
                unitComponent={unitComponent('kuukausi')}
              />
            </Box>
          </Grid>
        </Grid>
        {!isEmpty(errorKey) && (
          <Typography className={classes.error}>
            {t(`ohjaava-haku.error.${errorKey}`)}
          </Typography>
        )}
        <KoulutuksenKestoSlider
          rangeValues={rangeValues}
          undefinedRajainValues={undefinedRajainValues}
          handleSliderValueCommit={handleSliderValueCommit}
        />
      </Grid>
    </Root>
  );
};
