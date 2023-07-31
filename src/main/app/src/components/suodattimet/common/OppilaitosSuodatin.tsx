import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { getLanguage, localize } from '#/src/tools/localization';
import {
  CheckboxRajainItem,
  RajainUIItem,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

export const OppilaitosSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { rajainValues = [], ...rest } = props;

  const handleCheck = (item: RajainUIItem) => {
    const changes = getStateChangesForCheckboxRajaimet(rajainValues)(item);
    props.setFilters(changes);
  };

  const config = useConfig();
  const naytaFiltterienHakutulosLuvut = config.naytaFiltterienHakutulosLuvut;

  const options = useMemo(() => {
    const getSelectOption = (value: CheckboxRajainItem) => ({
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
        options: sortBy(
          (rajainValues as Array<CheckboxRajainItem>).map((v) => getSelectOption(v)),
          'label'
        ),
      },
    ];
  }, [rajainValues, t, naytaFiltterienHakutulosLuvut]);

  const language = getLanguage();

  const usedRajainValues = useMemo(
    () =>
      (rajainValues as Array<CheckboxRajainItem>).sort(
        (a, b) =>
          Number(b.checked) - Number(a.checked) ||
          localize(a.nimi).localeCompare(localize(b.nimi), language)
      ),
    [rajainValues, language]
  );

  return (
    <Filter
      name={t('haku.oppilaitos')}
      selectPlaceholder={t('haku.etsi-oppilaitos')}
      testId="oppilaitos-filter"
      rajainValues={usedRajainValues}
      handleCheck={handleCheck}
      options={options}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
