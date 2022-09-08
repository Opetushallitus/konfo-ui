import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

// NOTE: Hakutapa sisältää hakukaynnissa ja yhteishaku suodattimet -> tämä komponentti hoitaa yhdistelylogiikan
export const HakutapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { values = [], setFilters } = props;

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    setFilters(changes);
  };

  return (
    <Filter
      {...props}
      testId="hakutapa-filter"
      name={t('haku.hakutapa')}
      values={values}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
