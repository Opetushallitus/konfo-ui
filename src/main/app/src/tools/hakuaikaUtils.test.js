import { isHakuAuki } from './hakuaikaUtils';

describe('toteutus slice', () => {
  const mockDate = new Date('2020-10-15T12:24');
  const originalDate = Date;

  test.each([
    [undefined, undefined, true],
    ['2020-10-14', undefined, true],
    [undefined, '2020-10-16T23:59', true],
    ['2020-10-14', '2020-10-16T23:59', true],
    ['2018-10-14', '2022-10-16T23:59', true],
    ['2020-10-15', undefined, true],
    [undefined, '2020-10-15T23:59', true],
    ['2020-10-15', '2020-10-15T23:59', true],

    ['2020-10-16', undefined, false],
    [undefined, '2020-10-14T23:59', false],
    ['2020-10-12', '2020-10-14T23:59', false],
    ['2019-10-14', '2019-10-16T23:59', false],
  ])('isHakuAuki works', (alkaa, paattyy, expected) => {
    let mocked = false;

    // NOTE: Date is called multiple times and we only want to override the first call
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (mocked) {
        return new originalDate(...args);
      } else {
        mocked = true;
        return mockDate;
      }
    });

    expect(
      isHakuAuki([{ alkaa: alkaa, paattyy: paattyy, 'haku-auki': expected }])
    ).toEqual(expected);
  });
});
