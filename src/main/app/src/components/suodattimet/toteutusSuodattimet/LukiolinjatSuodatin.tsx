import React, {useMemo} from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';
import _fp from "lodash/fp";
import {localize} from "#/src/tools/localization";

export const LukiolinjatSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { name, values = [], ...rest } = props;

  const filteredValues = values.filter(v => v?.count > 0)

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
        options: _fp.sortBy('label')(
          filteredValues.map((v) => getSelectOption(v))
        ),
      },
    ],
    [filteredValues, t]
  );


  return (
    <Filter
      name={t(`haku.${name}`)}
      values={filteredValues}
      options={options}
      handleCheck={handleCheck}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
