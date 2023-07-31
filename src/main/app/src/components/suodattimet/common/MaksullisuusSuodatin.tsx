import React, { useState } from 'react';

import ExpandMore from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { isEqual } from 'lodash';
import { match } from 'ts-pattern';

import { FILTER_TYPES } from '#/src/constants';
import {
  SuodatinComponentProps,
  NumberRangeRajainItem,
  RajainUIItem,
} from '#/src/types/SuodatinTypes';

import { FilterCheckbox } from '../../common/Filter';
import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinSlider,
} from '../../common/Filter/CustomizedMuiComponents';

type SliderProps = {
  value: NumberRangeRajainItem;
  handleRangeChange: (range: Array<number>) => void;
  disabled?: boolean;
};

const UNDEFINED_SUMMA = [0, 1000];

const SummaSlider = ({ value, handleRangeChange, disabled }: SliderProps) => {
  const [showSliderInternalValues, setShowSliderInternalValues] =
    useState<boolean>(false);

  const [sliderInternalValues, setSliderInternalValues] = useState<Array<number>>([
    UNDEFINED_SUMMA[0],
    UNDEFINED_SUMMA[1],
  ]);

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
    const returnValue = isEqual(UNDEFINED_SUMMA, rangeValue) ? [] : rangeValue;
    handleRangeChange(returnValue);
  };

  const numberValues = (val: NumberRangeRajainItem) => [
    val.min || UNDEFINED_SUMMA[0],
    val.max || UNDEFINED_SUMMA[1],
  ];
  const valueText = (val: number) => (val === 0 ? '0' : `${val}€`);

  return (
    <SuodatinSlider
      disabled={disabled}
      value={showSliderInternalValues ? sliderInternalValues : numberValues(value)}
      min={UNDEFINED_SUMMA[0]}
      max={UNDEFINED_SUMMA[1]}
      step={1}
      // marks={marks}
      valueLabelDisplay="auto"
      valueLabelFormat={valueText}
      // aria-label={t('haku.koulutuksenkestokuukausina')}
      onChange={handleSliderValueChange}
      onChangeCommitted={handleSliderValueCommit}
    />
  );
};

export const MaksullisuusSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation,
  expanded,
  rajainValues = [],
  setFilters,
}: SuodatinComponentProps) => {
  const getBooleanRajain = (rajainId: string): RajainUIItem =>
    (rajainValues.find((r) => r.rajainId === rajainId) || {
      rajainId,
      id: rajainId,
      count: 0,
      checked: false,
    }) as RajainUIItem;
  const getNumberRangeRajain = (rajainId: string) =>
    (rajainValues.find((r) => r.rajainId === rajainId) || {
      rajainId,
      id: rajainId,
      count: 0,
    }) as NumberRangeRajainItem;

  const setMaksuRange = (_range: Array<number>) => {};
  const setLukuvuosiMaksuRange = (_range: Array<number>) => {};
  const handleCheck = (item: RajainUIItem) =>
    match(item.rajainId)
      .with(FILTER_TYPES.MAKSUTON, () => setFilters({ maksuton: !item.checked }))
      .with(FILTER_TYPES.MAKSULLINEN, () => {
        const newRajainValues =
          !item.checked === false ? { maksunmaara_min: -1, maksunmaara_max: -1 } : {};
        setFilters(Object.assign(newRajainValues, { maksullinen: !item.checked }));
      })
      .with(FILTER_TYPES.LUKUVUOSIMAKSU, () => {
        const newRajainValues =
          !item.checked === false
            ? { lukuvuosimaksunmaara_min: -1, lukuvuosimaksunmaara_max: -1 }
            : {};
        setFilters(Object.assign(newRajainValues, { lukuvuosimaksu: !item.checked }));
      })
      .with(FILTER_TYPES.APURAHA, () => setFilters({ apuraha: !item.checked }))
      .run();

  return (
    <SuodatinAccordion elevation={elevation} defaultExpanded={expanded} square>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="nowrap">
            <Grid item style={{ paddingRight: '8px' }}>
              <Typography variant="subtitle1">Maksullisuus</Typography>
            </Grid>
            {displaySelected && <Grid item>Heippa</Grid>}
          </Grid>
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column" wrap="nowrap">
          <Grid item>
            <List style={{ width: '100%' }}>
              <FilterCheckbox
                key={FILTER_TYPES.MAKSUTON}
                value={getBooleanRajain(FILTER_TYPES.MAKSUTON)}
                handleCheck={handleCheck}
                isCountVisible={true}
              />
              <FilterCheckbox
                key={FILTER_TYPES.MAKSULLINEN}
                value={getBooleanRajain(FILTER_TYPES.MAKSULLINEN)}
                handleCheck={handleCheck}
                isCountVisible={true}
              />
              <SummaSlider
                value={getNumberRangeRajain(FILTER_TYPES.MAKSUNMAARA)}
                handleRangeChange={setMaksuRange}
                disabled={!getBooleanRajain(FILTER_TYPES.MAKSULLINEN).checked}
              />
              <FilterCheckbox
                key={FILTER_TYPES.LUKUVUOSIMAKSU}
                value={getBooleanRajain(FILTER_TYPES.LUKUVUOSIMAKSU)}
                handleCheck={handleCheck}
                isCountVisible={true}
              />
              <SummaSlider
                value={getNumberRangeRajain(FILTER_TYPES.LUKUVUOSIMAKSUNMAARA)}
                handleRangeChange={setLukuvuosiMaksuRange}
                disabled={!getBooleanRajain(FILTER_TYPES.LUKUVUOSIMAKSU).checked}
              />
              <FilterCheckbox
                key={FILTER_TYPES.APURAHA}
                value={getBooleanRajain(FILTER_TYPES.APURAHA)}
                handleCheck={handleCheck}
                isCountVisible={true}
                disabled={!getBooleanRajain(FILTER_TYPES.LUKUVUOSIMAKSU).checked}
              />
            </List>
          </Grid>
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
