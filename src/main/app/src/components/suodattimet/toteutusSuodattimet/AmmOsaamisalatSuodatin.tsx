import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const AmmOsaamisalatSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { values = [], ...rest } = props;

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    props.setFilters(changes);
  };

  return (
    <Filter
      name={t('haku.amm-osaamisalat')}
      values={values}
      handleCheck={handleCheck}
      displaySelected
      {...rest}
    />
  );
};
