import { useEffect, useState } from 'react';

import { sortBy, isEqual } from 'lodash';

import { SuodatinSlider } from './CustomizedMuiComponents';

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
  onRangeCommit: (numberVals: Array<number>) => void;
  disabled?: boolean;
};

const valueToKey = (value: Array<number>) => `${value[0]},${value[1]}`;

export const NumberRangeSlider = ({
  values,
  marks,
  min,
  max,
  labelFormatter,
  onRangeCommit,
  disabled,
}: SliderProps) => {
  const handleSliderValueCommit = (
    _e: React.SyntheticEvent | Event,
    value: number | Array<number>
  ) => {
    onRangeCommit(sortBy(value as Array<number>));
  };

  return (
    <SuodatinSlider
      key={valueToKey(values as Array<number>)}
      disabled={disabled}
      defaultValue={values}
      min={min}
      max={max}
      marks={marks}
      step={1}
      valueLabelDisplay="auto"
      valueLabelFormat={labelFormatter}
      onChangeCommitted={handleSliderValueCommit}
    />
  );
};
