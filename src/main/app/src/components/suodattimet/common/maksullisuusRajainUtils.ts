import { range } from 'lodash';

const MAX_NUMBER_OF_SLIDER_MARKS = 5;
const ALLOWED_SLIDER_MARK_BASES = [1, 2, 2.5, 5];

const getExponent = (n: number) => parseInt(n.toExponential().split('e+')?.[1], 10);

export const resolveSliderMarkValues = (upperLimit: number) => {
  const markCandidate = upperLimit / MAX_NUMBER_OF_SLIDER_MARKS;
  const markE10Multiplier = 10 ** getExponent(markCandidate);
  const markStep =
    markE10Multiplier *
    (ALLOWED_SLIDER_MARK_BASES.find((v) => v >= markCandidate / markE10Multiplier) ??
      Math.max(...ALLOWED_SLIDER_MARK_BASES));

  return range(0, upperLimit, markStep).concat([upperLimit]);
};

export const marks = (upperLimit: number) =>
  resolveSliderMarkValues(upperLimit).map((value) => ({
    value,
    label: value ? `${value / 1000}k€` : '',
  }));
