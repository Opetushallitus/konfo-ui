import { isUndefined } from 'lodash';

import { Rajain } from './Kysymys';

export const getChangedRajaimet = (
  selectedRajainValues: Rajain,
  rajainId: string,
  rajainValue: string
) => {
  const rajainValues = selectedRajainValues[rajainId] as Array<string>;
  if (isUndefined(rajainValues)) {
    return { ...selectedRajainValues, [rajainId]: [rajainValue] };
  } else {
    const updatedSelected = rajainValues.includes(rajainValue)
      ? rajainValues.filter((v: string) => v !== rajainValue)
      : [...rajainValues, rajainValue];
    return { ...selectedRajainValues, [rajainId]: updatedSelected };
  }
};

export const getChangedKestoInMonths = (vuodet: string, months: string) => {
  const vuodetKuukausinaInt = parseInt(vuodet) * 12;
  const kuukaudetInt = parseInt(months);
  const vuodetKk = isFinite(vuodetKuukausinaInt) ? vuodetKuukausinaInt : 0;
  const kk = isFinite(kuukaudetInt) ? kuukaudetInt : 0;
  return vuodetKk + kk;
};

export const getYearsAndMonthsFromRangeValue = (rangeValue: number) => {
  const years = Math.floor(rangeValue / 12);
  const months = rangeValue % 12;
  return [years.toString(), months.toString()];
};
