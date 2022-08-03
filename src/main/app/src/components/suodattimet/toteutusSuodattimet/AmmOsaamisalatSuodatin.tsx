import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import _fp from 'lodash/fp';
import { Filter } from '#/src/components/common/Filter';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';
import { localize } from '#/src/tools/localization';

export const AmmOsaamisalatSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { values = [], ...rest } = props;

  const filteredValues = values.filter((v) => v?.count > 0 || v.checked);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    props.setFilters(changes);
  };

  const getSelectOption = (value: FilterValue) => ({
    ...value,
    label: `${localize(value)} (${value.count})`,
    value: localize(value),
    name: value.nimi,
  });

  const options = useMemo(
    () => [
      {
        label: t('haku.amm-osaamisalat'),
        options: _fp.sortBy('label')(filteredValues.map((v) => getSelectOption(v))),
      },
    ],
    [filteredValues, t]
  );

  const usedValues = useMemo(
    () =>
    filteredValues.sort((a, b) => Number(b.checked) - Number(a.checked)),
    [filteredValues]
  );

  return (
    <Filter
      name={t('haku.amm-osaamisalat')}
      values={usedValues}
      handleCheck={handleCheck}
      options={options}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
