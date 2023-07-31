import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import {
  CheckboxRajainItem,
  RajainType,
  RajainUIItem,
  RajainValue,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

import { useSearch } from '../../haku/hakutulosHooks';

const checkboxRajainItems = (rajainValue?: RajainValue) =>
  (rajainValue?.values || []) as Array<CheckboxRajainItem>;

export const SijaintiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { kuntaRajainValue, maakuntaRajainValue, setFilters, loading } = props;
  const sijaintiRajainValue = {
    rajainType: RajainType.CHECKBOX,
    values: checkboxRajainItems(kuntaRajainValue).concat(
      checkboxRajainItems(maakuntaRajainValue)
    ),
  };

  const handleCheck = (item: RajainUIItem) => {
    const changes = getStateChangesForCheckboxRajaimet(sijaintiRajainValue, item);
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
        options: sortBy(
          checkboxRajainItems(kuntaRajainValue).map(
            (v) => getSelectOption(v, false),
            'label'
          )
        ),
      },
      {
        label: t('haku.maakunnat'),
        options: sortBy(
          checkboxRajainItems(maakuntaRajainValue).map((v) => getSelectOption(v, true)),
          'label'
        ),
      },
    ];
  }, [kuntaRajainValue, maakuntaRajainValue, t, naytaFiltterienHakutulosLuvut]);

  const usedRajainValue = useMemo(
    () => ({
      rajainType: RajainType.CHECKBOX,
      values: checkboxRajainItems(maakuntaRajainValue)
        .concat(
          checkboxRajainItems(kuntaRajainValue)
            .filter((k) => k.checked)
            .map((v) => ({ ...v, hidden: false }))
        )
        .sort((a, b) => Number(b.checked) - Number(a.checked)),
    }),
    [maakuntaRajainValue, kuntaRajainValue]
  );

  return (
    <Filter
      {...props}
      options={groupedSijainnit}
      optionsLoading={optionsLoading || loading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      rajainValue={usedRajainValue}
      handleCheck={handleCheck}
      expandValues
      displaySelected
    />
  );
};
