import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const HakuKaynnissaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { values = [], setFilters } = props;

  const handleCheck = (item: FilterValue) => {
    setFilters({ hakukaynnissa: !item.checked });
  };

  return (
    <Filter
      {...props}
      testId="hakukaynnissa-filter"
      name={t('haku.hakukaynnissa-otsikko')}
      values={values}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
