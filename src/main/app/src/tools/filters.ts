import { sortBy, toPairs, get, some, toInteger, nth } from 'lodash';

import { FILTER_TYPES, YHTEISHAKU_KOODI_URI } from '#/src/constants';
import {
  BOOLEAN_RAJAIN_IDS,
  NUMBER_RANGE_RAJAIN_IDS,
  COMPOSITE_RAJAIN_IDS,
  REPLACED_RAJAIN_IDS,
  BooleanRajainItem,
  CheckboxRajainItem,
  RajainType,
  RajainUIItem,
  RajainItem,
} from '#/src/types/SuodatinTypes';

export const sortValues = <T>(filterObj: Record<string, T>) =>
  sortBy(
    toPairs(filterObj).map(([id, values]) => ({ id, ...values })),
    'id'
  );

export const isRajainActive = (rajain: any) =>
  (rajain.checked !== undefined && rajain.checked === true) || rajain.min !== undefined;

export const filterType = (filterId: string) => {
  if (BOOLEAN_RAJAIN_IDS.includes(filterId)) {
    return RajainType.BOOLEAN;
  }
  if (NUMBER_RANGE_RAJAIN_IDS.includes(filterId)) {
    return RajainType.NUMBER_RANGE;
  }
  if (COMPOSITE_RAJAIN_IDS.includes(filterId)) {
    return RajainType.COMPOSITE;
  }
  return RajainType.CHECKBOX;
};

export const replaceBackendOriginatedRajainIdAsNeeded = (filterId: string) =>
  get(REPLACED_RAJAIN_IDS, filterId, filterId);

const getRajainAlakoodit = (
  alakoodit: Record<string, any>,
  alakooditSetInUI: Record<string, any>,
  rajainId: string
) => {
  return sortValues(alakoodit)?.map((alakoodi) => ({
    ...alakoodi,
    checked: some(alakooditSetInUI, (checkedId) => checkedId === alakoodi.id),
    rajainId: rajainId,
  }));
};

export const getRajainValueInUIFormat = (
  rajainCountsFromBackend: Record<string, any> | undefined,
  allRajainValuesSetInUI: Record<string, any>,
  originalRajainId: string
): Array<RajainItem> => {
  const rajainId = replaceBackendOriginatedRajainIdAsNeeded(originalRajainId);

  const rajainCount = rajainCountsFromBackend?.[rajainId];
  if (!rajainCount) {
    return [];
  }

  const rajainValue = allRajainValuesSetInUI[rajainId];

  let returnValues: Array<RajainItem> = [];

  switch (filterType(rajainId)) {
    case RajainType.BOOLEAN:
      returnValues = [
        {
          id: rajainId,
          rajainId: rajainId,
          count: rajainCount.count,
          checked: Boolean(rajainValue),
        },
      ];
      break;
    case RajainType.NUMBER_RANGE: {
      const rajainValueEmpty = {
        id: rajainId,
        rajainId: rajainId,
        count: rajainCount.count,
      };
      const asInt = (v: any) => toInteger(v);
      const firstNumberValue = nth(rajainValue, 0);
      const secondNumberValue = nth(rajainValue, 1);
      returnValues = [
        firstNumberValue !== undefined && secondNumberValue !== undefined
          ? {
              ...rajainValueEmpty,
              min: Math.min(asInt(firstNumberValue), asInt(secondNumberValue)),
              max: Math.max(asInt(firstNumberValue), asInt(secondNumberValue)),
            }
          : rajainValueEmpty,
      ];
      break;
    }
    case RajainType.COMPOSITE:
      returnValues = Object.keys(rajainCount).flatMap((key: string) =>
        getRajainValueInUIFormat(rajainCount, allRajainValuesSetInUI, key)
      );
      break;
    default:
      returnValues = Object.keys(rajainCount).map((key: string) => ({
        id: key,
        rajainId: rajainId,
        ...rajainCount[key],
        checked: some(rajainValue, (checkedId) => checkedId === key),
        alakoodit:
          key === YHTEISHAKU_KOODI_URI
            ? getRajainAlakoodit(
                rajainCountsFromBackend[FILTER_TYPES.YHTEISHAKU],
                allRajainValuesSetInUI[FILTER_TYPES.YHTEISHAKU],
                FILTER_TYPES.YHTEISHAKU
              )
            : getRajainAlakoodit(rajainCount[key].alakoodit, rajainValue, rajainId),
      }));
      break;
  }
  return returnValues;
};

const addIfNotExists = (
  retVal: Record<string, Array<string>>,
  rajainId: string,
  id: string
) =>
  retVal[rajainId]?.includes(id)
    ? retVal
    : (retVal[rajainId] = (retVal[rajainId] ?? []).concat(id));

const removeIfExists = (
  retVal: Record<string, Array<string>>,
  rajainId: string,
  id: string
) =>
  retVal[rajainId]?.includes(id)
    ? (retVal[rajainId] = retVal[rajainId].filter((v) => v !== id))
    : retVal;

export const getStateChangesForCheckboxRajaimet =
  (rajainValuesRaw: Array<RajainItem>) =>
  (checkedRajainItem: CheckboxRajainItem | RajainUIItem) => {
    const rajainValues = rajainValuesRaw as Array<CheckboxRajainItem>;
    const allCheckedValues = rajainValues
      .map((v) => [v, ...(v.alakoodit ?? [])])
      .flat()
      .reduce(
        (a, { checked, rajainId, id }) =>
          checked ? { ...a, [rajainId]: (a[rajainId] || []).concat(id) } : a,
        {} as Record<string, Array<string>>
      );

    const koodiFn = checkedRajainItem.checked ? removeIfExists : addIfNotExists;

    koodiFn(allCheckedValues, checkedRajainItem.rajainId, checkedRajainItem.id);

    const isYlakoodi = rajainValues.some((v) => v.id === checkedRajainItem.id);
    if (isYlakoodi) {
      // Jos koodilla oli alakoodeja, täytyy ne myös poistaa / lisätä
      checkedRajainItem.alakoodit?.forEach((alakoodi) =>
        koodiFn(allCheckedValues, alakoodi.rajainId, alakoodi.id)
      );
      return allCheckedValues;
    } else {
      // Koodi oli alakoodi -> Etsitään yläkoodi ja muut alakoodit
      const ylakoodi = rajainValues.find(
        (v) => v.alakoodit?.some((alakoodi) => alakoodi.id === checkedRajainItem.id)
      )!;

      // Jos alakoodivalinnan jälkeen kaikki alakoodit on valittu, myös yläkoodikin täytyy asettaa valituksi
      const allAlakooditWillBeSelected = ylakoodi.alakoodit!.every((v) =>
        v.id === checkedRajainItem.id ? !v.checked : v.checked
      );

      const ylakoodiFn = allAlakooditWillBeSelected ? addIfNotExists : removeIfExists;
      ylakoodiFn(allCheckedValues, ylakoodi.rajainId, ylakoodi.id);
    }

    return allCheckedValues;
  };

export const getFilterStateChangesForDelete =
  (values: Array<RajainItem>) => (item: RajainItem) => {
    switch (filterType(item.rajainId)) {
      case RajainType.BOOLEAN:
        return { [item.rajainId]: !(item as BooleanRajainItem).checked };
      case RajainType.NUMBER_RANGE:
        return { [item.rajainId]: [] };
      default: {
        const checkboxValues = values.filter(
          (v) => filterType(v.rajainId) === RajainType.CHECKBOX
        ) as Array<CheckboxRajainItem>;
        return getStateChangesForCheckboxRajaimet(checkboxValues)(
          item as CheckboxRajainItem
        );
      }
    }
  };
