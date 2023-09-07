import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { FILTER_TYPES } from '#/src/constants';
import { getStateChangesForCheckboxRajaimet, useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import {
  CheckboxRajainItem,
  RajainItem,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

import { useSearch } from '../../haku/hakutulosHooks';

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { rajainValues, rajainOptions, setFilters, loading } = props;

  const kuntaRajainValues = useRajainItems(
    rajainOptions,
    rajainValues,
    FILTER_TYPES.KUNTA
  ) as Array<CheckboxRajainItem>;

  const maakuntaRajainValues = useRajainItems(
    rajainOptions,
    rajainValues,
    FILTER_TYPES.MAAKUNTA
  ) as Array<CheckboxRajainItem>;

  const handleCheck = (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(
      kuntaRajainValues.concat(maakuntaRajainValues)
    )(item);
    setFilters(changes);
  };

  const { isFetching } = useSearch();

  const optionsLoading = isFetching;

  const config = useConfig();
  const naytaFiltterienHakutulosLuvut = config.naytaFiltterienHakutulosLuvut;

  const groupedSijainnit = useMemo(() => {
    const getSelectOption = (value: CheckboxRajainItem, isMaakunta: boolean) => ({
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
        options: sortBy(kuntaRajainValues.map((v) => getSelectOption(v, false), 'label')),
      },
      {
        label: t('haku.maakunnat'),
        options: sortBy(
          maakuntaRajainValues.map((v) => getSelectOption(v, true)),
          'label'
        ),
      },
    ];
  }, [kuntaRajainValues, maakuntaRajainValues, t, naytaFiltterienHakutulosLuvut]);

  const usedRajainValues = useMemo(
    () =>
      maakuntaRajainValues
        .concat(
          kuntaRajainValues.filter((k) => k.checked).map((v) => ({ ...v, hidden: false }))
        )
        .sort((a, b) => Number(b.checked) - Number(a.checked)),
    [maakuntaRajainValues, kuntaRajainValues]
  );

  return (
    <Filter
      {...props}
      options={groupedSijainnit}
      optionsLoading={optionsLoading || loading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      rajainValues={usedRajainValues}
      handleCheck={handleCheck}
      expandValues
      displaySelected
    />
  );
};
