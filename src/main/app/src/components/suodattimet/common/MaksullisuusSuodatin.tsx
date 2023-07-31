import React, { useState } from 'react';

import ExpandMore from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { isEqual } from 'lodash';

import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
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
  setRange: (range: Array<number>) => void;
};

const UNDEFINED_SUMMA = [0, 1000];

const SummaSlider = ({ value, setRange }: SliderProps) => {
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
    // setShowSliderInternalValues(false);
    const returnValue = isEqual(UNDEFINED_SUMMA, rangeValue) ? [] : rangeValue;
    setRange(returnValue);
  };

  const numberValues = (val: NumberRangeRajainItem) => [
    val.min || UNDEFINED_SUMMA[0],
    val.max || UNDEFINED_SUMMA[1],
  ];
  const valueText = (val: number) => (val === 0 ? '0' : `${val}€`);

  return (
    <SuodatinSlider
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
}: SuodatinComponentProps) => {
  const setMaksuRange = (_range: Array<number>) => {};
  const setLukuvuosiMaksuRange = (_range: Array<number>) => {};
  const handleCheck = (item: RajainUIItem) => {
    getStateChangesForCheckboxRajaimet(rajainValues)(item);
    //setFilters(changes);
  };

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
                value={{
                  id: 'eimaksullinen',
                  rajainId: 'eimaksullinen',
                  count: 0,
                  checked: false,
                }}
                handleCheck={handleCheck}
                isCountVisible={true}
              />
              <FilterCheckbox
                value={{
                  id: 'maksullinen',
                  rajainId: 'maksullinen',
                  count: 0,
                  checked: false,
                }}
                handleCheck={handleCheck}
                isCountVisible={true}
              />
              <SummaSlider
                value={{ id: '', rajainId: '', count: 0, min: 100, max: 700 }}
                setRange={setMaksuRange}
              />
              <FilterCheckbox
                value={{
                  id: 'lukukausimaksu',
                  rajainId: 'lukukausimaksu',
                  count: 0,
                  checked: false,
                }}
                handleCheck={handleCheck}
                isCountVisible={true}
              />
              <SummaSlider
                value={{ id: '', rajainId: '', count: 0, min: 100, max: 700 }}
                setRange={setLukuvuosiMaksuRange}
              />
              <FilterCheckbox
                value={{
                  id: 'onkoapuraha',
                  rajainId: 'onkoapuraha',
                  count: 0,
                  checked: false,
                }}
                handleCheck={handleCheck}
                isCountVisible={true}
              />
            </List>
          </Grid>
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
