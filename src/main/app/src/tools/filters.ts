import { useMemo } from 'react';

import { sortBy, toPairs, some, ceil, mapValues, castArray } from 'lodash';
import { match, P } from 'ts-pattern';

import { RAJAIN_TYPES, YHTEISHAKU_KOODI_URI } from '#/src/constants';
import {
  REPLACED_RAJAIN_IDS,
  LINKED_IDS,
  ORDER_TO_BE_RETAINED_RAJAINIDS,
  isBooleanRajainId,
  RajainItem,
  isNumberRangeRajainId,
  NumberRangeRajainId,
  isCompositeRajainId,
  isCheckboxRajainId,
  CheckboxRajainId,
  NumberRangeRajainItem,
  CheckboxRajainBase,
} from '#/src/types/SuodatinTypes';

import { RajainValues } from '../store/reducers/hakutulosSlice';
import { RajainName } from '../types/common';

export const sortValues = <T>(filterObj: Record<string, T>) =>
  sortBy(
    toPairs(filterObj).map(([id, values]) => ({ id, ...values })),
    'id'
  );

export const isRajainActive = (rajain: any) =>
  (rajain.checked !== undefined && rajain.checked === true) ||
  rajain.min !== undefined ||
  rajain.max !== undefined;

const getRajainAlakoodit = (
  alakoodit: Record<string, any>,
  alakooditSetInUI: Record<string, any> | undefined,
  rajainId: CheckboxRajainId
): Array<CheckboxRajainBase> => {
  const alakoodiArray = ORDER_TO_BE_RETAINED_RAJAINIDS.includes(rajainId)
    ? toPairs(alakoodit).map(([id, values]) => ({ id, ...values }))
    : sortValues(alakoodit);
  return alakoodiArray?.map((alakoodi) => ({
    ...alakoodi,
    checked: some(alakooditSetInUI, (checkedId) => checkedId === alakoodi.id),
    rajainId: rajainId,
  }));
};

const numberRangeRajain = (
  rajainId: NumberRangeRajainId,
  count: number,
  upperLimit: number,
  minmax?: Record<string, number>
): NumberRangeRajainItem => {
  const defaultValue = {
    id: rajainId,
    rajainId,
    count,
    upperLimit,
  };

  let min = minmax?.[rajainId + '_min'];
  const max = minmax?.[rajainId + '_max'];
  if (min === undefined && max !== undefined) {
    min = 0;
  }
  return min !== undefined && max !== undefined
    ? {
        ...defaultValue,
        min,
        max,
      }
    : defaultValue;
};

export const getAllRajainValuesInUIFormat = (
  rajainCountsFromBackend: Record<RajainName, any> | undefined,
  allRajainValuesSetInUI: Partial<RajainValues>
) =>
  mapValues(rajainCountsFromBackend, (_, key) =>
    getRajainValueInUIFormat(
      rajainCountsFromBackend,
      allRajainValuesSetInUI,
      key as RajainName
    )
  );

export const getRajainValueInUIFormat = (
  rajainCountsFromBackend: Record<RajainName, any> | undefined,
  allRajainValuesSetInUI: Partial<RajainValues> | undefined,
  originalRajainId: RajainName
): Array<RajainItem> => {
  const rajainId: RajainName =
    REPLACED_RAJAIN_IDS?.[originalRajainId] ?? originalRajainId;

  const rajainCount = rajainCountsFromBackend?.[rajainId];
  if (!rajainCount) {
    return [];
  }

  const returnValues = match(rajainId)
    .with(P.when(isBooleanRajainId), (booleanRajainId) => [
      {
        id: rajainId,
        rajainId: booleanRajainId,
        count: rajainCount.count,
        checked: Boolean(allRajainValuesSetInUI?.[booleanRajainId]),
        linkedIds: [],
      },
    ])
    .with(P.when(isNumberRangeRajainId), (numberRangeRajainId) => [
      // NumberRange -tyyppisissä rajaimissa min- ja max -parametrit on automaattisesti nimetty
      // <rajainId>_min ja <rajainId>_max
      numberRangeRajain(
        numberRangeRajainId,
        rajainCount.count,
        ceil(rajainCount.max),
        allRajainValuesSetInUI?.[numberRangeRajainId]
      ),
    ])
    .with(P.when(isCompositeRajainId), () =>
      Object.keys(rajainCount).flatMap((key: string) =>
        getRajainValueInUIFormat(rajainCount, allRajainValuesSetInUI, key as RajainName)
      )
    )
    .with(P.when(isCheckboxRajainId), (checkboxRajainId) => {
      const rajainValue = allRajainValuesSetInUI?.[checkboxRajainId];
      return Object.keys(rajainCount).map((key: string) => ({
        id: key,
        rajainId: checkboxRajainId,
        ...rajainCount[key],
        checked: some(rajainValue, (checkedId) => checkedId === key),
        alakoodit:
          key === YHTEISHAKU_KOODI_URI
            ? getRajainAlakoodit(
                rajainCountsFromBackend[RAJAIN_TYPES.YHTEISHAKU],
                allRajainValuesSetInUI?.[RAJAIN_TYPES.YHTEISHAKU],
                RAJAIN_TYPES.YHTEISHAKU
              )
            : getRajainAlakoodit(
                rajainCount[key].alakoodit,
                rajainValue,
                checkboxRajainId
              ),
      }));
    })
    .run();
  return returnValues.map((val) => {
    val.linkedIds = LINKED_IDS[val.id];
    return val;
  });
};

export const useRajainItems = (
  rajainOptions: Record<RajainName, any> | undefined,
  rajainValues: Partial<RajainValues> | undefined,
  rajainId: RajainName | Array<RajainName>
) => {
  return useMemo(
    () =>
      castArray(rajainId).flatMap((id) =>
        getRajainValueInUIFormat(rajainOptions, rajainValues, id)
      ),
    [rajainOptions, rajainValues, rajainId]
  );
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

const checkboxRajainPattern = {
  rajainId: P.when(isCheckboxRajainId),
  id: P.string,
  checked: P.boolean,
};

const pickAlakoodit = (rajainItem: RajainItem) =>
  match(rajainItem)
    .with({ alakoodit: P.select(P.array(checkboxRajainPattern)) }, (koodit) => koodit)
    .otherwise(() => []);

export const isChecked = (rajainItem: RajainItem) =>
  match(rajainItem)
    .with({ checked: true }, () => true)
    .otherwise(() => false);

// match -> with sopivalla patternilla osaa muuntaa RajainItemin CheckboxRajainItemiksi
// Ensin valitaan filterillä listalta kaikki Checkbox -tyyppiset (jotka ovat varmasti muunnettavissa),
// match heittää poikkeuksen ellei annettu arvo ole muunnettavissa.
const pickCheckboxRajainItems = (anyRajainItems: Array<RajainItem>) =>
  anyRajainItems
    .filter((v) =>
      match(v)
        .with({ rajainId: P.when(isCheckboxRajainId) }, () => true)
        .otherwise(() => false)
    )
    .map((v) =>
      match(v)
        .with(checkboxRajainPattern, (item) => item)
        .run()
    );

export const getStateChangesForCheckboxRajaimet =
  (rajainValuesRaw: Array<RajainItem>) => (checkedRajainItem: RajainItem) => {
    const rajainValues = pickCheckboxRajainItems(rajainValuesRaw);
    const allCheckedValues = rajainValues
      .map((v) => [v, ...(v.alakoodit ?? [])])
      .flat()
      .reduce(
        (a, { checked, rajainId, id }) =>
          checked ? { ...a, [rajainId]: (a[rajainId] || []).concat(id) } : a,
        {} as Record<string, Array<string>>
      );

    const koodiFn = isChecked(checkedRajainItem) ? removeIfExists : addIfNotExists;

    koodiFn(allCheckedValues, checkedRajainItem.rajainId, checkedRajainItem.id);

    const isYlakoodi = rajainValues.some((v) => v.id === checkedRajainItem.id);
    if (isYlakoodi) {
      // Jos koodilla oli alakoodeja, täytyy ne myös poistaa / lisätä
      pickAlakoodit(checkedRajainItem).forEach((alakoodi) =>
        koodiFn(allCheckedValues, alakoodi.rajainId, alakoodi.id)
      );
      return allCheckedValues;
    } else {
      // Koodi oli alakoodi -> Etsitään yläkoodi ja muut alakoodit
      const ylakoodi = rajainValues.find((v) =>
        pickAlakoodit(v).some((alakoodi) => alakoodi.id === checkedRajainItem.id)
      )!;

      // Jos alakoodivalinnan jälkeen kaikki alakoodit on valittu, myös yläkoodikin täytyy asettaa valituksi
      const allAlakooditWillBeSelected = pickAlakoodit(ylakoodi)!.every((v) =>
        v.id === checkedRajainItem.id ? !v.checked : v.checked
      );

      const ylakoodiFn = allAlakooditWillBeSelected ? addIfNotExists : removeIfExists;
      ylakoodiFn(allCheckedValues, ylakoodi.rajainId, ylakoodi.id);
    }

    return allCheckedValues;
  };

export const getFilterStateChangesForDelete =
  (values: Array<RajainItem>) => (item: RajainItem) =>
    match(item)
      .with({ rajainId: P.when(isBooleanRajainId) }, () => ({
        [item.rajainId]: !isChecked(item),
      }))
      .with({ rajainId: P.when(isNumberRangeRajainId) }, () => ({
        [item.rajainId]: { [`${item.rajainId}_min`]: 0, [`${item.rajainId}_max`]: 0 },
      }))
      .with({ rajainId: P.when(isCheckboxRajainId) }, () =>
        getStateChangesForCheckboxRajaimet(values)(item)
      )
      .run();
