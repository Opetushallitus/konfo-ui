import { resolveSliderMarkValues } from './maksullisuusRajainUtils';

test.each([
  [0, [0]],
  [1, [0, 1]],
  [5, [0, 1, 2, 3, 4, 5]],
  [10000, [0, 2000, 4000, 6000, 8000, 10000]],
  [10, [0, 2, 4, 6, 8, 10]],
  [17, [0, 5, 10, 17]],
  [234, [0, 50, 100, 150, 234]],
])('maksullisuusRajainUtils', (upperLimit: number, markValue) => {
  expect(resolveSliderMarkValues(upperLimit)).toEqual(markValue);
});
