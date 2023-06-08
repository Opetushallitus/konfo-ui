import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const AlkamiskausiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { values = [], setFilters } = props;

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    setFilters(changes);
  };

  return (
    <Filter
      {...props}
      name={t('haku.alkamiskausi')}
      values={values}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
