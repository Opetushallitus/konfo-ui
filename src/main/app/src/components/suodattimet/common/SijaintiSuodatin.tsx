import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getFilterStateChanges } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useSearch } from '../../haku/hakutulosHooks';

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { kuntaValues = [], maakuntaValues = [], setFilters, loading } = props;

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(kuntaValues.concat(maakuntaValues))(item);
    setFilters(changes);
  };

  const { isFetching } = useSearch();

  const optionsLoading = isFetching;

  const getSelectOption = (value: FilterValue, isMaakunta: boolean) => ({
    ...value,
    label: `${localize(value)} (${value.count})`,
    value: localize(value),
    isMaakunta,
    name: value.nimi,
  });

  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: _fp.sortBy('label')(kuntaValues.map((v) => getSelectOption(v, false))),
      },
      {
        label: t('haku.maakunnat'),
        options: _fp.sortBy('label')(maakuntaValues.map((v) => getSelectOption(v, true))),
      },
    ],
    [kuntaValues, maakuntaValues, t]
  );

  const usedValues = useMemo(
    () =>
      maakuntaValues
        .concat(kuntaValues.map((v) => ({ ...v, hidden: false })))
        .sort((a, b) => Number(b.checked) - Number(a.checked)),
    [maakuntaValues, kuntaValues]
  );

  return (
    <Filter
      {...props}
      options={groupedSijainnit}
      optionsLoading={optionsLoading || loading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      values={usedValues}
      handleCheck={handleCheck}
      expandValues
      displaySelected
    />
  );
};
