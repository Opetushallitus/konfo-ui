import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { nth, isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import {
  EMPTY_RAJAIN,
  NumberRangeRajainItem,
  RajainValue,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinSlider,
} from '../../common/Filter/CustomizedMuiComponents';

const numberRangeRajain = (minmax: Array<number>) => ({
  id: '',
  rajainId: '',
  count: 0,
  min: minmax[0],
  max: minmax[1],
});

const UNDEFINED = numberRangeRajain([0, 72]);

const numberValues = (rajainValue: RajainValue) => {
  const range = (nth(rajainValue?.values, 0) as NumberRangeRajainItem) || UNDEFINED;
  return [range.min || UNDEFINED.min, range.max || UNDEFINED.max];
};

export const KoulutuksenKestoSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation = 0,
  expanded,
  rajainValue = EMPTY_RAJAIN,
  setFilters,
}: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const yearsAbbr = (years: number) => `${years}${t('haku.lyhenne-vuosi')}`;
  const monthsAbbr = (months: number) => `${months}${t('haku.lyhenne-kuukausi')}`;

  const [showSliderInternalValues, setShowSliderInternalValues] =
    React.useState<boolean>(false);

  const [sliderInternalValues, setSliderInternalValues] = React.useState<Array<number>>([
    UNDEFINED.min,
    UNDEFINED.max,
  ]);

  const marks = [
    { value: 0, label: '' },
    { value: 12, label: yearsAbbr(1) },
    { value: 24, label: yearsAbbr(2) },
    { value: 36, label: yearsAbbr(3) },
    { value: 48, label: yearsAbbr(4) },
    { value: 60, label: yearsAbbr(5) },
    { value: 72, label: yearsAbbr(6) },
  ];

  const handleSliderValueChange = (
    _e: Event,
    newValue: number | Array<number>,
    _activeThumb: number
  ) => {
    setShowSliderInternalValues(true);
    setSliderInternalValues(newValue as Array<number>);
  };

  const handleSliderValueCommit = (
    _e: React.SyntheticEvent | Event,
    rangeValuesRaw: number | Array<number>
  ) => {
    const rangeValue = rangeValuesRaw as Array<number>;
    setShowSliderInternalValues(true);
    setSliderInternalValues(rangeValue);
    setShowSliderInternalValues(false);
    const valueRange = isEqual(UNDEFINED, numberRangeRajain(rangeValue))
      ? []
      : rangeValue;
    setFilters({ koulutuksenkestokuukausina: valueRange });
  };

  const valueText = (val: number) => {
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

  const rangeHeader = () => {
    const rangeValues = numberValues(rajainValue);
    return isEqual(UNDEFINED, numberRangeRajain(rangeValues))
      ? ''
      : `${valueText(rangeValues[0])} - ${valueText(rangeValues[1])}`;
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
            <SuodatinSlider
              value={
                showSliderInternalValues
                  ? sliderInternalValues
                  : numberValues(rajainValue)
              }
              min={0}
              max={72}
              marks={marks}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={valueText}
              onChange={handleSliderValueChange}
              onChangeCommitted={handleSliderValueCommit}
            />
          </Grid>
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
