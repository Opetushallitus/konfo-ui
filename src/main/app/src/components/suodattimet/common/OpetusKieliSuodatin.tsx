import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps } from '../../haku/hakutulosHooks';

export const OpetuskieliSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const filterValues = useFilterProps(FILTER_TYPES.OPETUSKIELI);
  const propsValues = props.values === undefined ? [] : props.values;

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(propsValues)(item);
    console.log(item);
    console.log(changes);
    props.setFilters(changes);
  };
  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      values={props.isHaku ? filterValues : propsValues}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
