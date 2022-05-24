import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { setFilterSelectedValues } from '#/src/store/reducers/hakutulosSlice';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps } from '../hakutulosHooks';

export const KoulutusalaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const values = useFilterProps(FILTER_TYPES.KOULUTUSALA);

  const getChanges = getFilterStateChanges(values);
  const handleCheck = (item: FilterValue) => {
    const changes = getChanges(item);
    dispatch(setFilterSelectedValues(changes));
  };

  return (
    <Filter
      {...props}
      testId="koulutusalat-filter"
      name={t('haku.koulutusalat')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
