import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { RajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const OpetusaikaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { rajainValues = [], setFilters } = props;

  const handleCheck = (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(rajainValues)(item);
    setFilters(changes);
  };
  return (
    <Filter
      {...props}
      name={t('haku.opetusaika')}
      rajainValues={rajainValues}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
