import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getSelectOption } from '#/src/components/common/utils';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useSearch } from '../../haku/hakutulosHooks';

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const kuntaValues = props.kuntaValues!;
  const maakuntaValues = props.maakuntaValues!;

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(kuntaValues.concat(maakuntaValues))(item);
    props.setFilters(changes);
  };

  const { isFetching } = useSearch();

  const optionsLoading = isFetching;

  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: _fp.sortBy('label')(
          // ? kuntaValues.filter((v) => v.count > 0).map((v) => getSelectOption(v, false))
          kuntaValues.map((v) => getSelectOption(v, false))
        ),
      },
      {
        label: t('haku.maakunnat'),
        options: _fp.sortBy('label')(
          // ? maakuntaValues
          //     .filter((v) => v.count > 0)
          //     .map((v) => getSelectOption(v, true))
          maakuntaValues.map((v) => getSelectOption(v, true))
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
      optionsLoading={optionsLoading || props.loading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      values={usedValues}
      handleCheck={handleCheck}
      expandValues
      displaySelected
    />
  );
};
