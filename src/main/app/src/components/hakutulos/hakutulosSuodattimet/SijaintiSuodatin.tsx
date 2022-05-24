import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps, useSearch } from '../hakutulosHooks';

const getSelectOption = (value: FilterValue, isMaakunta: boolean) => ({
  ...value,
  label: `${localize(value)} (${value.count})`,
  value: localize(value),
  isMaakunta,
  name: value.nimi, // TODO: tarviiko tätä?
});

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { setFilters } = useSearch();

  const kuntaValues = useFilterProps(FILTER_TYPES.KUNTA);
  const maakuntaValues = useFilterProps(FILTER_TYPES.MAAKUNTA);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(kuntaValues.concat(maakuntaValues))(item);
    setFilters(changes);
  };

  const { isFetching } = useSearch();

  const optionsLoading = isFetching;

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
