import React, { useState } from 'react';

import { Box, Grid, OutlinedInput } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TFunction } from 'i18next';
import { isEmpty, isEqual, ceil, range, round } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { colors } from '#/src/colors';
import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from '#/src/components/common/Filter/CustomizedMuiComponents';
import { NumberRangeSlider } from '#/src/components/common/Filter/NumberRangeSlider';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Rajain } from '#/src/components/ohjaava-haku/Kysymys';
import {
  getChangedKestoInMonths,
  getYearsAndMonthsFromRangeValue,
} from '#/src/components/ohjaava-haku/utils';
import { NDASH, RAJAIN_TYPES } from '#/src/constants';
import { styled } from '#/src/theme';
import { useRajainItems } from '#/src/tools/filters';
import {
  RajainItem,
  NumberRangeRajainItem,
  RajainComponentProps,
} from '#/src/types/SuodatinTypes';

enum UnitOfMeasure {
  MONTH = 1,
  HALF_YEAR = 6,
  YEAR = 12,
}

const MAX_NUMBER_OF_MARKS = 6;
const MIN_MONTHS_TO_USE_HALFYEARS = 18;
const MIN_MONTHS_TO_USE_YEARS = 36;
const DEFAULT_UPPERLIMIT = 72;

// Sliderin merkit päätellään kuukausien maksimimäärästä, siten että merkkejä maksimissaan kuusi.
// Jos kuukausien määrä alle 18, lasketaan merkit suoraan kuukausina. Jos määrä välillä
// 18 ja 36, lasketaan merkit vuoden puolikkaina. Muuten merkit lasketaan vuosina.
// Viimeisenä merkkinä on aina kuukausien maksimimäärä.
const resolveSliderMarks = (upperLimit: number, unitOfMeasure: UnitOfMeasure) => {
  const monthsInMaxNbrOfSteps = unitOfMeasure * MAX_NUMBER_OF_MARKS;
  const stepLength = ceil(upperLimit / monthsInMaxNbrOfSteps) * unitOfMeasure;
  const remainder = upperLimit % stepLength;
  return remainder > 0
    ? range(0, upperLimit, stepLength).concat([upperLimit])
    : range(0, upperLimit + 1, stepLength);
};

const yearsAbbr = (years: number, t: TFunction) => `${years}${t('haku.lyhenne-vuosi')}`;
const monthsAbbr = (months: number, t: TFunction) =>
  `${months}${t('haku.lyhenne-kuukausi')}`;

const rangeText = (val: number, t: TFunction) => {
  if (val === 0) {
    return '0';
  } else if (val > 11) {
    const months = val % 12;
    const years = (val - months) / 12;
    if (months === 0) {
      return yearsAbbr(years, t);
    } else {
      return `${yearsAbbr(years, t)} ${monthsAbbr(months, t)}`;
    }
  } else {
    return monthsAbbr(val, t);
  }
};

const marks = (upperLimit: number, t: TFunction) => {
  const unitOfMeasure =
    upperLimit >= MIN_MONTHS_TO_USE_HALFYEARS
      ? upperLimit >= MIN_MONTHS_TO_USE_YEARS
        ? UnitOfMeasure.YEAR
        : UnitOfMeasure.HALF_YEAR
      : UnitOfMeasure.MONTH;

  const valueSeq = resolveSliderMarks(upperLimit, unitOfMeasure);

  const label = (numberOfMonths: number) => {
    switch (unitOfMeasure) {
      case UnitOfMeasure.YEAR:
        return yearsAbbr(round(numberOfMonths / 12, 0), t);
      case UnitOfMeasure.HALF_YEAR:
        return yearsAbbr(round(numberOfMonths / 12, 1), t);
      default:
        return monthsAbbr(numberOfMonths, t);
    }
  };
  const marx = valueSeq.map((val) => ({ value: val, label: label(val) }));
  marx[0].label = '';
  marx[marx.length - 1].label = rangeText(upperLimit, t);
  return marx;
};

export const KoulutuksenKestoSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation = 0,
  expanded,
  rajainValues,
  rajainOptions,
  setRajainValues,
}: RajainComponentProps) => {
  const { t } = useTranslation();

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.KOULUTUKSENKESTOKUUKAUSINA
  );

  const rajainItem = rajainItems?.[0] as NumberRangeRajainItem;
  const undefinedRajainValues = [0, rajainItem?.upperLimit || DEFAULT_UPPERLIMIT];
  const rangeValues = [
    rajainItem?.min || undefinedRajainValues[0],
    rajainItem?.max || undefinedRajainValues[1],
  ];

  const handleSliderValueCommit = (newValues: Array<number>) => {
    if (isEqual(undefinedRajainValues, newValues)) {
      setRajainValues({
        koulutuksenkestokuukausina: {
          koulutuksenkestokuukausina_min: 0,
          koulutuksenkestokuukausina_max: 0,
        },
      });
    } else {
      setRajainValues({
        koulutuksenkestokuukausina: {
          koulutuksenkestokuukausina_min: newValues[0],
          koulutuksenkestokuukausina_max: newValues[1],
        },
      });
    }
  };

  const rangeHeader = () => {
    return isEqual(undefinedRajainValues, rangeValues)
      ? ''
      : `${rangeText(rangeValues[0], t)} - ${rangeText(rangeValues[1], t)}`;
  };

  return (
    <SuodatinAccordion elevation={elevation} defaultExpanded={expanded} square>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<MaterialIcon icon="expand_more" />}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="nowrap">
            <Grid item style={{ paddingRight: '8px' }}>
              <Typography variant="subtitle1">
                {t('haku.koulutuksenkestokuukausina')}
              </Typography>
            </Grid>
            {displaySelected && <span>{rangeHeader()}</span>}
          </Grid>
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <KoulutuksenKestoSlider
          rangeValues={rangeValues}
          undefinedRajainValues={undefinedRajainValues}
          handleSliderValueCommit={handleSliderValueCommit}
        />
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};

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

const KoulutuksenKestoSlider = ({
  rangeValues,
  undefinedRajainValues,
  handleSliderValueCommit,
}: {
  rangeValues: Array<number>;
  undefinedRajainValues: Array<number>;
  handleSliderValueCommit: (val: Array<number>) => void;
}) => {
  const { t } = useTranslation();
  const labelFormatter = (val: number) => rangeText(val, t);
  return (
    <Grid item sx={{ mx: 1 }}>
      <NumberRangeSlider
        values={rangeValues}
        min={undefinedRajainValues[0]}
        max={undefinedRajainValues[1]}
        marks={marks(undefinedRajainValues[1], t)}
        labelFormatter={labelFormatter}
        onRangeCommit={handleSliderValueCommit}
      />
    </Grid>
  );
};

const KoulutuksenKestoInput = ({
  id,
  value,
  handleInputValueChange,
  timePeriod,
}: {
  id: string;
  value: string;
  handleInputValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  timePeriod: string;
}) => {
  const { t } = useTranslation();
  return (
    <Box className={classes.input}>
      <OutlinedInput id={id} value={value} onChange={handleInputValueChange} />
      <Typography className={classes.lyhenne}>
        {t(`haku.lyhenne-${timePeriod}`)}
      </Typography>
    </Box>
  );
};

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
    initialEnintaan,
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
              {t('ohjaava-haku.kysymykset.koulutuksen-kesto.opiskelen-vahintaan')}
            </Typography>
            <Box className={classes.inputContainer}>
              <KoulutuksenKestoInput
                id="vahintaan-vuosi"
                value={vahintaan[0]}
                handleInputValueChange={handleInputValueChange}
                timePeriod="vuosi"
              />
              <KoulutuksenKestoInput
                id="vahintaan-kk"
                value={vahintaan[1]}
                handleInputValueChange={handleInputValueChange}
                timePeriod="kuukausi"
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
              {t('ohjaava-haku.kysymykset.koulutuksen-kesto.opiskelen-enintaan')}
            </Typography>
            <Box display="flex" className={classes.inputContainer}>
              <KoulutuksenKestoInput
                id="enintaan-vuosi"
                value={enintaan[0]}
                handleInputValueChange={handleInputValueChange}
                timePeriod="vuosi"
              />
              <KoulutuksenKestoInput
                id="enintaan-kk"
                value={enintaan[1]}
                handleInputValueChange={handleInputValueChange}
                timePeriod="kuukausi"
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
