import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { nth, isEqual, ceil, range, round, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { NumberRangeRajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinSlider,
} from '../../common/Filter/CustomizedMuiComponents';

type SliderMark = {
  value: number;
  label: string;
};

type SliderProps = {
  values: number | Array<number>;
  marks: Array<SliderMark>;
  min: number;
  max: number;
  labelFormatter: (numberVal: number) => string;
  handleRangeChange: (
    _e: Event,
    range: number | Array<number>,
    _activeThumb: number
  ) => void;
  handleRangeCommit: (
    _e: React.SyntheticEvent | Event,
    range: number | Array<number>
  ) => void;
  disabled?: boolean;
};

export const NumberRangeSlider = ({
  values,
  marks,
  min,
  max,
  labelFormatter,
  handleRangeChange,
  handleRangeCommit,
}: SliderProps) => {
  return (
    <SuodatinSlider
      value={values}
      min={min}
      max={max}
      marks={marks}
      step={1}
      valueLabelDisplay="auto"
      valueLabelFormat={labelFormatter}
      onChange={handleRangeChange}
      onChangeCommitted={handleRangeCommit}
    />
  );
};

export enum UnitOfMeasure {
  MONTH = 1,
  HALF_YEAR = 6,
  YEAR = 12,
}

const MAX_NUMBER_OF_MARKS = 6;
const MIN_MONTHS_TO_USE_HALFYEARS = 18;
const MIN_MONTHS_TO_USE_YEARS = 36;
const DEFAULT_UPPERLIMIT = 72;

let UNDEFINED_RANGE = [0, DEFAULT_UPPERLIMIT];

// Sliderin merkit päätellään kuukausien maksimimäärästä, siten että merkkejä maksimissaan kuusi.
// Jos kuukausien määrä alle 18, lasketaan merkit suoraan kuukausina. Jos määrä välillä
// 18 ja 36, lasketaan merkit vuoden puolikkaina. Muuten merkit lasketaan vuosina.
// Viimeisenä merkkinä on aina kuukausien maksimimäärä.
export const resolveSliderMarks = (upperLimit: number, unitOfMeasure: UnitOfMeasure) => {
  const monthsInMaxNbrOfSteps = unitOfMeasure * MAX_NUMBER_OF_MARKS;
  const stepLength = ceil(upperLimit / monthsInMaxNbrOfSteps) * unitOfMeasure;
  const remainder = upperLimit % stepLength;
  return remainder > 0
    ? range(0, upperLimit, stepLength).concat([upperLimit])
    : range(0, upperLimit + 1, stepLength);
};

export const KoulutuksenKestoSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation = 0,
  expanded,
  rajainValues = [],
  setFilters,
}: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const rajainValueItem = nth(rajainValues, 0) as NumberRangeRajainItem;
  UNDEFINED_RANGE = [0, rajainValueItem?.upperLimit || DEFAULT_UPPERLIMIT];

  const yearsAbbr = (years: number) => `${years}${t('haku.lyhenne-vuosi')}`;
  const monthsAbbr = (months: number) => `${months}${t('haku.lyhenne-kuukausi')}`;

  const rangeText = (val: number) => {
    if (val === 0) {
      return '0';
    } else if (val > 11) {
      const months = val % 12;
      const years = (val - months) / 12;
      if (months === 0) {
        return yearsAbbr(years);
      } else {
        return `${yearsAbbr(years)} ${monthsAbbr(months)}`;
      }
    } else {
      return monthsAbbr(val);
    }
  };

  const marks = (upperLimit: number) => {
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
          return yearsAbbr(round(numberOfMonths / 12, 0));
        case UnitOfMeasure.HALF_YEAR:
          return yearsAbbr(round(numberOfMonths / 12, 1));
        default:
          return monthsAbbr(numberOfMonths);
      }
    };
    const marx = valueSeq.map((val) => ({ value: val, label: label(val) }));
    marx[0].label = '';
    marx[marx.length - 1].label = rangeText(upperLimit);
    return marx;
  };

  const [sliderValues, setSliderValues] = useState<Array<number>>([
    UNDEFINED_RANGE[0],
    UNDEFINED_RANGE[1],
  ]);
  useEffect(() => {
    const vals = [
      rajainValueItem?.min || UNDEFINED_RANGE[0],
      rajainValueItem?.max || UNDEFINED_RANGE[1],
    ];
    if (!isEqual(sliderValues, vals)) {
      setSliderValues(vals);
    }
  }, [sliderValues, rajainValueItem]);
  const handleSliderValueChange = (
    _e: Event,
    newValue: number | Array<number>,
    _activeThumb: number
  ) => {
    setSliderValues(sortBy(newValue as Array<number>));
  };

  const handleSliderValueCommit = (
    _e: React.SyntheticEvent | Event,
    newValue: number | Array<number>
  ) => {
    setSliderValues(sortBy(newValue as Array<number>));

    if (isEqual(UNDEFINED_RANGE, sliderValues)) {
      setFilters({
        koulutuksenkestokuukausina: {},
      });
    } else {
      setFilters({
        koulutuksenkestokuukausina: {
          koulutuksenkestokuukausina_min: sliderValues[0],
          koulutuksenkestokuukausina_max: sliderValues[1],
        },
      });
    }
  };

  const rangeHeader = () => {
    return isEqual(UNDEFINED_RANGE, sliderValues)
      ? ''
      : `${rangeText(sliderValues[0])} - ${rangeText(sliderValues[1])}`;
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
            {displaySelected && <Grid item>{rangeHeader()}</Grid>}
          </Grid>
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column" wrap="nowrap">
          <Grid item sx={{ mx: 1 }}>
            <NumberRangeSlider
              values={sliderValues}
              min={UNDEFINED_RANGE[0]}
              max={UNDEFINED_RANGE[1]}
              marks={marks(UNDEFINED_RANGE[1])}
              labelFormatter={rangeText}
              handleRangeChange={handleSliderValueChange}
              handleRangeCommit={handleSliderValueCommit}
            />
          </Grid>
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
