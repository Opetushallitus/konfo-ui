import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { RajainUIItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const OpetustapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { rajainValues = [], setFilters } = props;

  const handleCheck = (item: RajainUIItem) => {
    const changes = getStateChangesForCheckboxRajaimet(rajainValues)(item);
    setFilters(changes);
  };

  return (
    <Filter
      {...props}
      testId="opetustapa-filter"
      name={t('haku.opetustapa')}
      rajainValues={rajainValues}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
