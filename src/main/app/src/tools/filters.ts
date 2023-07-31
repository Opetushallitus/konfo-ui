import { sortBy, toPairs, get, some, toInteger, nth } from 'lodash';

import { FILTER_TYPES, YHTEISHAKU_KOODI_URI } from '#/src/constants';
import {
  BOOLEAN_FILTER_IDS,
  NUMBER_RANGE_FILTER_IDS,
  COMPOSITE_FILTER_IDS,
  REPLACED_FILTER_IDS,
  BooleanRajainItem,
  RajainValue,
  CheckboxRajainItem,
  RajainType,
  RajainUIItem,
  EMPTY_RAJAIN,
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
  if (BOOLEAN_FILTER_IDS.includes(filterId)) {
    return RajainType.BOOLEAN;
  }
  if (NUMBER_RANGE_FILTER_IDS.includes(filterId)) {
    return RajainType.NUMBER_RANGE;
  }
  if (COMPOSITE_FILTER_IDS.includes(filterId)) {
    return RajainType.COMPOSITE;
  }
  return RajainType.CHECKBOX;
};

export const replaceBackendOriginatedFilterIdAsNeeded = (filterId: string) =>
  get(REPLACED_FILTER_IDS, filterId, filterId);

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
  filtersFromBackend: Record<string, any> | undefined,
  allValuesSetInUI: Record<string, any>,
  originalFilterId: string
): RajainValue => {
  const filterId = replaceBackendOriginatedFilterIdAsNeeded(originalFilterId);

  const filter = filtersFromBackend?.[filterId];
  if (!filter) {
    return EMPTY_RAJAIN;
  }

  const filterValue = allValuesSetInUI[filterId];

  let rajainValues: Array<RajainItem> = [];

  switch (filterType(filterId)) {
    case RajainType.BOOLEAN:
      rajainValues = [
        {
          id: filterId,
          rajainId: filterId,
          count: filter.count,
          checked: Boolean(filterValue),
        },
      ];
      break;
    case RajainType.NUMBER_RANGE: {
      const rajainValueEmpty = { id: filterId, rajainId: filterId, count: filter.count };
      const asInt = (v: any) => toInteger(v);
      const firstNumberValue = nth(filterValue, 0);
      const secondNumberValue = nth(filterValue, 1);
      rajainValues = [
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
      break;
    default:
      rajainValues = Object.keys(filter).map((key: string) => ({
        id: key,
        rajainId: filterId,
        ...filter[key],
        checked: some(filterValue, (checkedId) => checkedId === key),
        alakoodit:
          key === YHTEISHAKU_KOODI_URI
            ? getRajainAlakoodit(
                filtersFromBackend[FILTER_TYPES.YHTEISHAKU],
                allValuesSetInUI[FILTER_TYPES.YHTEISHAKU],
                FILTER_TYPES.YHTEISHAKU
              )
            : getRajainAlakoodit(filter[key].alakoodit, filterValue, filterId),
      }));
      break;
  }
  return {
    values: rajainValues,
  };
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

export const getStateChangesForCheckboxRajaimet = (
  rajainValue: RajainValue,
  checkedRajainItem: CheckboxRajainItem | RajainUIItem
) => {
  const rajainValues = rajainValue.values as Array<CheckboxRajainItem>;
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

export const getFilterStateChangesForDelete = (
  values: Array<RajainItem>,
  item: RajainItem
) => {
  switch (filterType(item.rajainId)) {
    case RajainType.BOOLEAN:
      return { [item.rajainId]: !(item as BooleanRajainItem).checked };
    case RajainType.NUMBER_RANGE:
      return { [item.rajainId]: [] };
    default: {
      const checkboxValues = values.filter(
        (v) => filterType(v.rajainId) === RajainType.CHECKBOX
      ) as Array<CheckboxRajainItem>;
      return getStateChangesForCheckboxRajaimet(
        { values: checkboxValues },
        item as CheckboxRajainItem
      );
    }
  }
};
