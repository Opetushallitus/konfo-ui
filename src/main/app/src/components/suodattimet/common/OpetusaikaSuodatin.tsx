import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import {
  EMPTY_RAJAIN,
  RajainUIItem,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

export const OpetusaikaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { rajainValue = EMPTY_RAJAIN, setFilters } = props;

  const handleCheck = (item: RajainUIItem) => {
    const changes = getStateChangesForCheckboxRajaimet(rajainValue, item);
    setFilters(changes);
  };
  return (
    <Filter
      {...props}
      name={t('haku.opetusaika')}
      rajainValue={rajainValue}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
