import { isUndefined } from 'lodash';

import { RajainItem } from '#/src/types/SuodatinTypes';

import { Rajain } from './Question';

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

export const combineMaksunMaaraWithMaksullisuustyyppi = (
  rajainItems: Array<RajainItem>
): Array<RajainItem> => {
  return rajainItems
    .map((rajainItem) => {
      const linkedRajainIds = rajainItem?.linkedIds;
      if (linkedRajainIds) {
        const linkedRajainItems = linkedRajainIds
          .map((id) => {
            return rajainItems.find((item) => {
              return id === item.id && /maksunmaara$/.test(id);
            });
          })
          .filter(Boolean);
        return { ...rajainItem, linkedRajainItems };
      } else {
        return rajainItem;
      }
    })
    .filter(
      (rajainItem): rajainItem is RajainItem =>
        rajainItem && rajainItem.rajainId === 'maksullisuustyyppi'
    );
};
