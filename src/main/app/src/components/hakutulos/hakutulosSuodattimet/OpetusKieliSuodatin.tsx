import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps, useSearch } from '../hakutulosHooks';

export const OpetuskieliSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { setFilters } = useSearch();

  const values = useFilterProps(FILTER_TYPES.OPETUSKIELI);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    setFilters(changes);
  };

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
