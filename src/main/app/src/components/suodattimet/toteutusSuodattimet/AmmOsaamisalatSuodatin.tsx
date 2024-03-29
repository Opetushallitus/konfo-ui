import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { CheckboxRajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from '../common/useCheckboxRajainOnChange';

export const AmmOsaamisalatSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();
  const { setRajainValues, rajainValues, rajainOptions, ...rest } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.OSAAMISALA
  );

  const filteredValues = (rajainItems as Array<CheckboxRajainItem>).filter(
    (v) => v?.count > 0 || v.checked
  );

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

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
        label: t('haku.amm-osaamisalat'),
        options: sortBy(
          filteredValues.map((v) => getSelectOption(v)),
          'label'
        ),
      },
    ];
  }, [filteredValues, t, naytaFiltterienHakutulosLuvut]);

  const usedRajainValues = useMemo(
    () => filteredValues.sort((a, b) => Number(b.checked) - Number(a.checked)),
    [filteredValues]
  );

  return (
    <Filter
      {...rest}
      name={t('haku.amm-osaamisalat')}
      rajainItems={usedRajainValues}
      onItemChange={onItemChange}
      options={options}
      expandValues
      displaySelected
    />
  );
};
