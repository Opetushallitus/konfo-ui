import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const JotpaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { values = [], setFilters } = props;

  const handleCheck = (item: FilterValue) => {
    if (item.filterId === FILTER_TYPES.JOTPA) {
      setFilters({ jotpa: !item.checked });
    }
  };

  return (
    <Filter
      {...props}
      testId="jotpa-filter"
      name={t('haku.jotpa')}
      values={values}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
