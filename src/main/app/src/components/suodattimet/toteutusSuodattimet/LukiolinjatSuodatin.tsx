import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getFilterStateChanges } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const LukiolinjatSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { name, values = [], ...rest } = props;

  const filteredValues = values.filter((v) => v?.count > 0);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(filteredValues)(item);
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
        label: t(`haku.${name}`),
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
      name={t(`haku.${name}`)}
      values={usedValues}
      options={options}
      handleCheck={handleCheck}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
