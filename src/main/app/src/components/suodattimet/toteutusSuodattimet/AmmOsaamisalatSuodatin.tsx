import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import {
  CheckboxRajainItem,
  RajainUIItem,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

export const AmmOsaamisalatSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { rajainValues = [], ...rest } = props;

  const filteredValues = (rajainValues as Array<CheckboxRajainItem>).filter(
    (v) => v?.count > 0 || v.checked
  );

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
      name={t('haku.amm-osaamisalat')}
      rajainValues={usedRajainValues}
      handleCheck={handleCheck}
      options={options}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
