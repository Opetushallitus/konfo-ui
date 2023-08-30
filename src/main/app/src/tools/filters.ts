import { mapValues, sortBy, toPairs, some, ceil } from 'lodash';
import { match, P } from 'ts-pattern';

import { FILTER_TYPES, YHTEISHAKU_KOODI_URI } from '#/src/constants';
import {
  REPLACED_RAJAIN_IDS,
  LINKED_IDS,
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
  alakooditSetInUI: Record<string, any>,
  rajainId: CheckboxRajainId
): Array<CheckboxRajainBase> => {
  return sortValues(alakoodit)?.map((alakoodi) => ({
    ...alakoodi,
    checked: some(alakooditSetInUI, (checkedId) => checkedId === alakoodi.id),
    rajainId: rajainId,
  }));
};

export const getRajainOptions = (
  filters: Record<string, any> | undefined,
  filterId: string
) => {
  const filter = filters?.[filterId];
  return mapValues(filter, (v, id) => ({
    ...v,
    id,
    filterId,
  }));
};

const numberRangeRajain = (
  rajainId: NumberRangeRajainId,
  count: number,
  upperLimit: number,
  minmax: Record<string, number>
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

export const getRajainValueInUIFormat = (
  rajainCountsFromBackend: Record<string, any> | undefined,
  allRajainValuesSetInUI: Record<string, any>,
  originalRajainId: string
): Array<RajainItem> => {
  const rajainId = REPLACED_RAJAIN_IDS[originalRajainId]
    ? REPLACED_RAJAIN_IDS[originalRajainId]
    : originalRajainId;

  const rajainCount = rajainCountsFromBackend?.[rajainId];
  if (!rajainCount) {
    return [];
  }

  const rajainValue = allRajainValuesSetInUI[rajainId];

  const returnValues = match(rajainId)
    .with(P.when(isBooleanRajainId), (booleanRajainId) => [
      {
        id: rajainId,
        rajainId: booleanRajainId,
        count: rajainCount.count,
        checked: Boolean(rajainValue),
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
        allRajainValuesSetInUI[rajainId]
      ),
    ])
    .with(P.when(isCompositeRajainId), () =>
      Object.keys(rajainCount).flatMap((key: string) =>
        getRajainValueInUIFormat(rajainCount, allRajainValuesSetInUI, key)
      )
    )
    .with(P.when(isCheckboxRajainId), (checkboxRajainId) =>
      Object.keys(rajainCount).map((key: string) => ({
        id: key,
        rajainId: checkboxRajainId,
        ...rajainCount[key],
        checked: some(rajainValue, (checkedId) => checkedId === key),
        alakoodit:
          key === YHTEISHAKU_KOODI_URI
            ? getRajainAlakoodit(
                rajainCountsFromBackend[FILTER_TYPES.YHTEISHAKU],
                allRajainValuesSetInUI[FILTER_TYPES.YHTEISHAKU],
                FILTER_TYPES.YHTEISHAKU
              )
            : getRajainAlakoodit(
                rajainCount[key].alakoodit,
                rajainValue,
                checkboxRajainId
              ),
      }))
    )
    .run();
  return returnValues.map((val) => {
    val.linkedIds = LINKED_IDS[val.id];
    return val;
  });
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
