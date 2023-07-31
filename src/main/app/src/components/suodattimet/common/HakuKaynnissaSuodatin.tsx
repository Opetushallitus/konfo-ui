import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { RajainUIItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const HakuKaynnissaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues = [], setFilters } = props;

  const handleCheck = (item: RajainUIItem) => {
    setFilters({ hakukaynnissa: !item.checked });
  };

  return (
    <Filter
      {...props}
      testId="hakukaynnissa-filter"
      name={t('haku.hakukaynnissa-otsikko')}
      rajainValues={rajainValues}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
