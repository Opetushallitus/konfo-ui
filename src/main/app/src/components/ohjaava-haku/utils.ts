import { isEmpty, isUndefined, some } from 'lodash';

import { RajainItem } from '#/src/types/SuodatinTypes';

import { CombinedRajaimet, Rajain } from './Question';

export const updateRajainValues = (updated: Array<string> = [], rajainValue: string) => {
  return updated.includes(rajainValue)
    ? updated.filter((v: string) => v !== rajainValue)
    : [...updated, rajainValue];
};

export const getChangedRajaimet = (
  allSelectedRajainValues: Rajain,
  rajainId: string,
  selectedRajainValues: Array<string> = []
) => {
  const selected = allSelectedRajainValues[rajainId] as Array<string>;

  if (isUndefined(selected)) {
    return { ...allSelectedRajainValues, [rajainId]: selectedRajainValues };
  } else {
    let updated = selected;
    for (const rajainValue of selectedRajainValues) {
      updated = updateRajainValues(updated, rajainValue);
    }
    return { ...allSelectedRajainValues, [rajainId]: updated };
  }
};

export const getIsRajainSelected = (
  allSelectedRajainValues: Rajain,
  rajainId: string,
  rajainValueIds: Array<string> = []
) => {
  if (isEmpty(allSelectedRajainValues) || isEmpty(rajainValueIds)) {
    return false;
  } else {
    const selectedRajainValues = allSelectedRajainValues[rajainId] as Array<string>;
    return rajainValueIds
      .map((rajainValue: string) => {
        return selectedRajainValues?.includes(rajainValue);
      })
      .every((v) => v);
  }
};

export const getChangedKestoInMonths = (vuodet: string, months: string) => {
  const vuodetWithoutSpaces = vuodet.replace(/\s/g, '');
  const vuodetKuukausinaInt = parseInt(vuodetWithoutSpaces) * 12;
  const kkWithoutSpaces = months.replace(/\s/g, '');
  const kuukaudetInt = parseInt(kkWithoutSpaces);
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

export const getRajainOptionsToShow = (
  rajainItems?: Array<RajainItem>,
  rajainOptionsToBeRemoved?: Array<string>,
  rajainOptionsToBeCombined?: Array<CombinedRajaimet>
): Array<Omit<RajainItem, 'count'> & { rajainValueIds?: Array<string> }> => {
  const filteredRajainItems =
    rajainItems?.filter(({ id }) => {
      return !some(rajainOptionsToBeRemoved, (rajain) => {
        return rajain === id;
      });
    }) || [];

  const combined =
    rajainOptionsToBeCombined?.map(({ translationKey, rajainKoodiuris }) => {
      const toBeCombinedRajainItems = filteredRajainItems?.filter(({ id }) => {
        return some(rajainKoodiuris, (rajain) => {
          return rajain === id;
        });
      });

      return {
        id: translationKey,
        rajainId: toBeCombinedRajainItems[0].rajainId,
        rajainValueIds: toBeCombinedRajainItems.map(({ id }) => id),
      };
    }) || [];

  const toBeCombinedRajainKoodiuris = combined?.flatMap(
    ({ rajainValueIds }) => rajainValueIds
  );

  const rajainItemsWithoutCombined = filteredRajainItems
    ?.filter(({ id }) => {
      return !some(toBeCombinedRajainKoodiuris, (rajain) => {
        return rajain === id;
      });
    })
    .map((rajainItem) => {
      return {
        ...rajainItem,
        rajainValueIds: [rajainItem.id],
      };
    });

  return [...rajainItemsWithoutCombined, ...combined].filter(Boolean);
};
