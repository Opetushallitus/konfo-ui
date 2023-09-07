import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { getLanguage, localize } from '#/src/tools/localization';
import { CheckboxRajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const OppilaitosSuodatin = (
  props: Omit<SuodatinComponentProps, 'rajainValues'>
) => {
  const { t } = useTranslation();
  const { setFilters, rajainOptions, rajainUIValues, ...rest } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainUIValues,
    FILTER_TYPES.OPPILAITOS
  );

  const handleCheck = useCheckboxRajainOnChange(rajainItems, setFilters);

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
          (rajainItems as Array<CheckboxRajainItem>).map((v) => getSelectOption(v)),
          'label'
        ),
      },
    ];
  }, [rajainItems, t, naytaFiltterienHakutulosLuvut]);

  const language = getLanguage();

  const usedRajainItems = useMemo(
    () =>
      (rajainItems as Array<CheckboxRajainItem>).sort(
        (a, b) =>
          Number(b.checked) - Number(a.checked) ||
          localize(a.nimi).localeCompare(localize(b.nimi), language)
      ),
    [rajainItems, language]
  );

  return (
    <Filter
      name={t('haku.oppilaitos')}
      selectPlaceholder={t('haku.etsi-oppilaitos')}
      testId="oppilaitos-filter"
      rajainValues={usedRajainItems}
      handleCheck={handleCheck}
      options={options}
      expandValues
      displaySelected
      setFilters={setFilters}
      {...rest}
    />
  );
};
