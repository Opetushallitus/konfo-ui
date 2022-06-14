import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getSelectOption } from '#/src/components/common/utils';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps, useSearch } from '../haku/hakutulosHooks';

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { setFilters } = useSearch();

  const filterKuntavalues = useFilterProps(FILTER_TYPES.KUNTA);
  const filterMaaKuntavalues = useFilterProps(FILTER_TYPES.MAAKUNTA);
  const kuntaValues = props.isHaku
    ? filterKuntavalues
    : props.kuntaValues !== undefined
    ? props.kuntaValues
    : [];
  const maakuntaValues = props.isHaku
    ? filterMaaKuntavalues
    : props.maakuntaValues !== undefined
    ? props.maakuntaValues
    : [];

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
          props.isHaku
            ? kuntaValues.filter((v) => v.count > 0).map((v) => getSelectOption(v, false))
            : kuntaValues.map((v) => getSelectOption(v, false))
        ),
      },
      {
        label: t('haku.maakunnat'),
        options: _fp.sortBy('label')(
          props.isHaku
            ? maakuntaValues
                .filter((v) => v.count > 0)
                .map((v) => getSelectOption(v, true))
            : maakuntaValues.map((v) => getSelectOption(v, true))
        ),
      },
    ],
    [kuntaValues, maakuntaValues, props.isHaku, t]
  );

  const usedValues = useMemo(
    () => maakuntaValues.concat(kuntaValues.map((v) => ({ ...v, hidden: true }))),
    [maakuntaValues, kuntaValues]
  );

  return (
    <Filter
      {...props}
      options={groupedSijainnit}
      optionsLoading={props.isHaku ? optionsLoading : props.loading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      values={usedValues}
      handleCheck={props.isHaku ? handleCheck : props.handleFilterChange!}
      expandValues
      displaySelected
    />
  );
};
