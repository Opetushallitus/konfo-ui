import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { setFilterSelectedValues } from '#/src/store/reducers/hakutulosSlice';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps } from '../hakutulosHooks';

export const OpetustapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const values = useFilterProps(FILTER_TYPES.OPETUSTAPA);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    dispatch(setFilterSelectedValues(changes));
  };

  return (
    <Filter
      {...props}
      testId="opetustapa-filter"
      name={t('haku.opetustapa')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
