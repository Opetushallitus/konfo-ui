import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
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

  const config = useConfig();
  const naytaFiltterienHakutulosLuvut = config.naytaFiltterienHakutulosLuvut;

  const groupedSijainnit = useMemo(() => {
    const getSelectOption = (value: FilterValue, isMaakunta: boolean) => ({
      ...value,
      label: naytaFiltterienHakutulosLuvut
        ? `${localize(value)} (${value.count})`
        : localize(value),
      value: localize(value),
      isMaakunta,
      name: value.nimi,
    });

    return [
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: _.sortBy(kuntaValues.map((v) => getSelectOption(v, false), 'label')),
      },
      {
        label: t('haku.maakunnat'),
        options: _.sortBy(
          maakuntaValues.map((v) => getSelectOption(v, true)),
          'label'
        ),
      },
    ];
  }, [kuntaValues, maakuntaValues, t, naytaFiltterienHakutulosLuvut]);

  const usedValues = useMemo(
    () =>
      maakuntaValues
        .concat(
          kuntaValues.filter((k) => k.checked).map((v) => ({ ...v, hidden: false }))
        )
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
