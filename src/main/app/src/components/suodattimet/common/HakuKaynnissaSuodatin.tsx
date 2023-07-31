import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import {
  EMPTY_RAJAIN,
  RajainUIItem,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

export const HakuKaynnissaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { rajainValue = EMPTY_RAJAIN, setFilters } = props;

  const handleCheck = (item: RajainUIItem) => {
    setFilters({ hakukaynnissa: !item.checked });
  };

  return (
    <Filter
      {...props}
      testId="hakukaynnissa-filter"
      name={t('haku.hakukaynnissa-otsikko')}
      rajainValue={rajainValue}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
