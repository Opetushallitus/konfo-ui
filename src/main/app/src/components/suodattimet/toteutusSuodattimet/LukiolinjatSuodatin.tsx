import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { FILTER_TYPES } from '#/src/constants';
import { getStateChangesForCheckboxRajaimet, useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import {
  CheckboxRajainItem,
  RajainItem,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

export const LukiolinjatSuodatin = (
  props: SuodatinComponentProps & {
    name: 'lukiolinjat_er' | 'lukiopainotukset';
  }
) => {
  const { t } = useTranslation();
  const { name, rajainValues, rajainOptions, ...rest } = props;

  const rajainType = match(name)
    .with('lukiolinjat_er', () => FILTER_TYPES.LUKIOLINJATERITYINENKOULUTUSTEHTAVA)
    .with('lukiopainotukset', () => FILTER_TYPES.LUKIOPAINOTUKSET)
    .run();

  const rajainItems = useRajainItems(rajainOptions, rajainValues, rajainType);

  const filteredValues = (rajainItems as Array<CheckboxRajainItem>).filter(
    (v) => v?.count > 0 || v.checked
  );

  const handleCheck = (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(filteredValues)(item);
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

  const usedRajainValues = useMemo(
    () => filteredValues.sort((a, b) => Number(b.checked) - Number(a.checked)),
    [filteredValues]
  );

  return (
    <Filter
      name={t(`haku.${name}`)}
      rajainValues={usedRajainValues}
      options={options}
      handleCheck={handleCheck}
      expandValues
      displaySelected
      {...rest}
    />
  );
};
