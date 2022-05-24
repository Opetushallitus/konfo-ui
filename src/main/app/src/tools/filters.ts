import _ from 'lodash';

import { FILTER_TYPES, YHTEISHAKU_KOODI_URI } from '#/src/constants';
import { FilterValue } from '#/src/types/SuodatinTypes';

export const sortValues = <T>(filterObj: Record<string, T>) =>
  _.sortBy(
    _.toPairs(filterObj).map(([id, values]) => ({ id, ...values })),
    'id'
  );

// NOTE: Tämä funktio hoitaa kovakoodatut rakenteet erikoisemmille suodattimille e.g. hakukaynnissa / hakutapa + yhteishaku
export const getFilterWithChecked = (
  filters: Record<string, any> | undefined,
  allCheckedValues: Record<string, any>,
  originalFilterId: string
) => {
  // Yhteishaku -suodatin käsitellään osana hakutapa-suodatinta
  const filterId =
    originalFilterId === FILTER_TYPES.YHTEISHAKU
      ? FILTER_TYPES.HAKUTAPA
      : originalFilterId;
  const filter = filters?.[filterId];

  if (!filter) {
    return {};
  }

  if (filterId === FILTER_TYPES.HAKUKAYNNISSA) {
    return {
      [FILTER_TYPES.HAKUKAYNNISSA]: {
        id: FILTER_TYPES.HAKUKAYNNISSA,
        filterId: FILTER_TYPES.HAKUKAYNNISSA,
        count: filter.count,
        checked: !!allCheckedValues[FILTER_TYPES.HAKUKAYNNISSA],
      },
    };
  }

  return _.mapValues(filter, (v, id) => ({
    ...v,
    id,
    filterId,
    checked: _.some(allCheckedValues[filterId], (checkedId) => checkedId === id),
    alakoodit:
      id === YHTEISHAKU_KOODI_URI
        ? sortValues(filters[FILTER_TYPES.YHTEISHAKU])?.map((alakoodi) => ({
            ...alakoodi,
            filterId: FILTER_TYPES.YHTEISHAKU,
            checked: _.some(
              allCheckedValues[FILTER_TYPES.YHTEISHAKU],
              (checkedId) => checkedId === alakoodi.id
            ),
          }))
        : sortValues(v.alakoodit)?.map((alakoodi) => ({
            ...alakoodi,
            filterId,
            checked: _.some(
              allCheckedValues[filterId],
              (checkedId) => checkedId === alakoodi.id
            ),
          })),
  }));
};

const addIfNotExists = (
  retVal: Record<string, Array<string>>,
  { filterId, id }: FilterValue
) =>
  retVal[filterId]?.includes(id)
    ? retVal
    : (retVal[filterId] = (retVal[filterId] ?? []).concat(id));

const removeIfExists = (
  retVal: Record<string, Array<string>>,
  { filterId, id }: FilterValue
) =>
  retVal[filterId]?.includes(id)
    ? (retVal[filterId] = retVal[filterId].filter((v) => v !== id))
    : retVal;

const getCheckedValues = (values: Array<FilterValue>) =>
  values
    .map((v) => [v, ...(v.alakoodit ?? [])])
    .flat()
    .reduce(
      (a, { checked, filterId, id }) =>
        checked ? { ...a, [filterId]: (a[filterId] || []).concat(id) } : a,
      {} as Record<string, Array<string>>
    );

// NOTE: values voi sisältää arvoja useasta eri rajaimesta e.g. ylakoodi on filterId: 'id1' ja sen alakoodit filterId: 'id2'
export const getFilterStateChanges =
  (values: Array<FilterValue>) => (item: FilterValue) => {
    const retVal = getCheckedValues(values);
    const koodiFn = item.checked ? removeIfExists : addIfNotExists;

    koodiFn(retVal, item);

    const isYlakoodi = values.some((v) => v.id === item.id);
    if (isYlakoodi) {
      // Jos koodilla oli alakoodeja, täytyy ne myös poistaa / lisätä
      item.alakoodit?.forEach((alakoodi) => koodiFn(retVal, alakoodi));
      return retVal;
    } else {
      // Koodi oli alakoodi -> Etsitään yläkoodi ja muut alakoodit
      const ylakoodi = values.find((v) =>
        v.alakoodit?.some((alakoodi) => alakoodi.id === item.id)
      )!;

      // Jos alakoodivalinnan jälkeen kaikki alakoodit on valittu, myös yläkoodikin täytyy asettaa valituksi
      const allAlakooditWillBeSelected = ylakoodi.alakoodit!.every((v) =>
        v.id !== item.id ? v.checked : !v.checked
      );

      const ylakoodiFn = allAlakooditWillBeSelected ? addIfNotExists : removeIfExists;
      ylakoodiFn(retVal, ylakoodi);
    }

    return retVal;
  };
