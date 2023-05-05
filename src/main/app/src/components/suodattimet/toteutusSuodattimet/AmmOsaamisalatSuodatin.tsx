import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { getFilterStateChanges } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const AmmOsaamisalatSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { values = [], ...rest } = props;

  const filteredValues = values.filter((v) => v?.count > 0 || v.checked);

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
        label: t('haku.amm-osaamisalat'),
        options: sortBy(
          filteredValues.map((v) => getSelectOption(v)),
          'label'
        ),
      },
    ];
  }, [filteredValues, t, naytaFiltterienHakutulosLuvut]);

  const usedValues = useMemo(
    () => filteredValues.sort((a, b) => Number(b.checked) - Number(a.checked)),
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
