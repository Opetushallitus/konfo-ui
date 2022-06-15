import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps, useSearch } from '../../haku/hakutulosHooks';

// TODO: Do not use this component until backend supports filtering no-haku-kaynnissa for valintatavat
export const ValintatapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const values = useFilterProps(FILTER_TYPES.VALINTATAPA);
  const propsValues = props.values !== undefined ? props.values : [];

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    props.setFilters(changes);
  };

  return (
    <Filter
      {...props}
      testId="valintatapa-filter"
      name={t('haku.valintatapa')}
      values={props.isHaku ? values : propsValues}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
