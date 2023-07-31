import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import {
  CheckboxRajainItem,
  EMPTY_RAJAIN,
  RajainType,
  RajainUIItem,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

export const LukiolinjatSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { name, rajainValue = EMPTY_RAJAIN, ...rest } = props;

  const filteredValues = (rajainValue.values as Array<CheckboxRajainItem>).filter(
    (v) => v?.count > 0 || v.checked
  );

  const handleCheck = (item: RajainUIItem) => {
    const changes = getStateChangesForCheckboxRajaimet({ values: filteredValues }, item);
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
        label: t(`haku.${name}`),
        options: sortBy(
          filteredValues.map((v) => getSelectOption(v)),
          'label'
        ),
      },
    ];
  }, [filteredValues, t, name, naytaFiltterienHakutulosLuvut]);

  const usedRajainValue = useMemo(
    () => ({
      rajainType: RajainType.CHECKBOX,
      values: filteredValues.sort((a, b) => Number(b.checked) - Number(a.checked)),
    }),
    [filteredValues]
  );

  return (
    <Filter
      name={t(`haku.${name}`)}
      rajainValue={usedRajainValue}
      options={options}
      handleCheck={handleCheck}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
