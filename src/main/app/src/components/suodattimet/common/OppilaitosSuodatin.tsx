import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { getFilterStateChanges } from '#/src/tools/filters';
import { getLanguage, localize } from '#/src/tools/localization';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const OppilaitosSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { values = [], ...rest } = props;

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    props.setFilters(changes);
  };

  const config = useConfig();
  const naytaFiltterienHakutulosLuvut = config.naytaFiltterienHakutulosLuvut;

  const options = useMemo(() => {
    const getSelectOption = (value: FilterValue) => ({
      ...value,
      label: naytaFiltterienHakutulosLuvut
        ? `${localize(value)} (${value.count})`
        : localize(value),
      value: localize(value),
      name: value.nimi,
    });

    return [
      {
        label: t('haku.oppilaitos'),
        options: _.sortBy(
          values.map((v) => getSelectOption(v)),
          'label'
        ),
      },
    ];
  }, [values, t, naytaFiltterienHakutulosLuvut]);

  const language = getLanguage();

  const usedValues = useMemo(
    () =>
      values.sort(
        (a, b) =>
          Number(b.checked) - Number(a.checked) ||
          localize(a.nimi).localeCompare(localize(b.nimi), language)
      ),
    [values, language]
  );

  return (
    <Filter
      name={t('haku.oppilaitos')}
      selectPlaceholder={t('haku.etsi-oppilaitos')}
      testId="oppilaitos-filter"
      values={usedValues}
      handleCheck={handleCheck}
      options={options}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
