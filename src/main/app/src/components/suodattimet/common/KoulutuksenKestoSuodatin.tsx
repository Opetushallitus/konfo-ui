import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TFunction } from 'i18next';
import { isEqual, ceil, range, round } from 'lodash';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { NumberRangeRajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from '../../common/Filter/CustomizedMuiComponents';
import { NumberRangeSlider } from '../../common/Filter/NumberRangeSlider';

export enum UnitOfMeasure {
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
export const resolveSliderMarks = (upperLimit: number, unitOfMeasure: UnitOfMeasure) => {
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
  rajainValues = [],
  setFilters,
}: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const rajainValueItem = rajainValues?.[0] as NumberRangeRajainItem;
  const undefinedRajainValues = [0, rajainValueItem?.upperLimit || DEFAULT_UPPERLIMIT];
  const rangeValues = [
    rajainValueItem?.min || undefinedRajainValues[0],
    rajainValueItem?.max || undefinedRajainValues[1],
  ];

  const handleSliderValueCommit = (newValues: Array<number>) => {
    if (isEqual(undefinedRajainValues, newValues)) {
      setFilters({
        koulutuksenkestokuukausina: {
          koulutuksenkestokuukausina_min: 0,
          koulutuksenkestokuukausina_max: 0,
        },
      });
    } else {
      setFilters({
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

  const labelFormatter = (val: number) => rangeText(val, t);

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
        <Grid container direction="column" wrap="nowrap">
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
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
