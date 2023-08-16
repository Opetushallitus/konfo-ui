import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { toInteger, nth, isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { FilterValues, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinSlider,
} from '../../common/Filter/CustomizedMuiComponents';

const numberValues = (filterValues: FilterValues | undefined) => {
  const anyValue = nth(filterValues, 0)?.anyValue;
  const firstNumVal = anyValue && anyValue.length > 0 ? toInteger(anyValue[0]) : 0;
  const secondNumVal = anyValue && anyValue.length > 1 ? toInteger(anyValue[1]) : 72;
  return [Math.min(firstNumVal, secondNumVal), Math.max(firstNumVal, secondNumVal)];
};

export const KoulutuksenKestoSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation = 0,
  expanded,
  values,
  setFilters,
}: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const yearsAbbr = (years: number) => `${years}${t('haku.lyhenne-vuosi')}`;
  const monthsAbbr = (months: number) => `${months}${t('haku.lyhenne-kuukausi')}`;

  const [showSliderInternalValues, setShowSliderInternalValues] =
    React.useState<boolean>(false);

  const [sliderInternalValues, setSliderInternalValues] = React.useState<Array<number>>([
    0, 72,
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

  const sliderValues = showSliderInternalValues
    ? sliderInternalValues
    : numberValues(values);

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
    rangeValues: any
  ) => {
    const min = toInteger(nth(rangeValues, 0));
    const max = toInteger(nth(rangeValues, 1));
    setShowSliderInternalValues(false);
    const valueRange = min !== 0 || max !== 72 ? [min, max] : [];
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
    const rangeValues = numberValues(values);
    return isEqual(rangeValues, [0, 72])
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
              value={sliderValues}
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
