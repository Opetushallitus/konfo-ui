import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps } from '../../haku/hakutulosHooks';

export const OpetustapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const values = useFilterProps(FILTER_TYPES.OPETUSTAPA);
  const propsValues = props.values !== undefined ? props.values : [];

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    props.setFilters(changes);
  };

  return (
    <Filter
      {...props}
      testId="opetustapa-filter"
      name={t('haku.opetustapa')}
      values={props.isHaku ? values : propsValues}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
