import { Typography } from '@mui/material';
import { sortBy, castArray } from 'lodash';

import { SuodatinSlider } from './CustomizedMuiComponents';

type SliderMark = {
  value: number;
  label: string;
};

type SliderProps = {
  values: Array<number>;
  marks: Array<SliderMark>;
  min: number;
  max: number;
  labelFormatter: (numberVal: number) => string;
  onRangeCommit: (numberVals: Array<number>) => void;
  disabled?: boolean;
  sliderLabel?: string;
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
  sliderLabel,
}: SliderProps) => {
  const handleSliderValueCommit = (
    _e: React.SyntheticEvent | Event,
    value: number | Array<number>
  ) => {
    onRangeCommit(sortBy(Array.isArray(value) ? value : castArray(value)));
  };

  return (
    <>
      {sliderLabel && (
        <Typography id="suodatin-slider" gutterBottom>
          {sliderLabel}
        </Typography>
      )}
      <SuodatinSlider
        aria-labelledby="suodatin-slider"
        key={valueToKey(values)}
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
    </>
  );
};
