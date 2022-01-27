import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import {
  setFilterSelectedValues,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps, getIsReady } from '#/src/store/reducers/hakutulosSliceSelector';
import { getFilterStateChanges } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import {
  FilterValues,
  FilterValue,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

const maakuntaSelector = getFilterProps(FILTER_TYPES.MAAKUNTA);
const kuntaSelector = getFilterProps(FILTER_TYPES.KUNTA);

const getSelectOption = (value: FilterValue, isMaakunta: boolean) => ({
  ...value,
  label: `${localize(value)} (${value.count})`,
  value: localize(value),
  isMaakunta,
  name: value.nimi, // TODO: tarviiko tätä?
});

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const kuntaValues = useSelector<any, FilterValues>(kuntaSelector);
  const maakuntaValues = useSelector<any, FilterValues>(maakuntaSelector);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(kuntaValues.concat(maakuntaValues))(item);
    dispatch(setFilterSelectedValues(changes));
    dispatch(newSearchAll());
  };

  const optionsLoading = !useSelector(getIsReady);
  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: _fp.sortBy('label')(
          kuntaValues.filter((v) => v.count > 0).map((v) => getSelectOption(v, false))
        ),
      },
      {
        label: t('haku.maakunnat'),
        options: _fp.sortBy('label')(
          maakuntaValues.filter((v) => v.count > 0).map((v) => getSelectOption(v, true))
        ),
      },
    ],
    [kuntaValues, maakuntaValues, t]
  );

  const usedValues = useMemo(
    () => maakuntaValues.concat(kuntaValues.map((v) => ({ ...v, hidden: true }))),
    [maakuntaValues, kuntaValues]
  );

  return (
    <Filter
      {...props}
      options={groupedSijainnit}
      optionsLoading={optionsLoading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      values={usedValues}
      handleCheck={handleCheck}
      expandValues
    />
  );
};
