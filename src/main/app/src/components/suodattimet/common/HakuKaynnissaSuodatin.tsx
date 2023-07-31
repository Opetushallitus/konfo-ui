import React from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { RajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const HakuKaynnissaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues = [], setFilters } = props;

  const handleCheck = (item: RajainItem) => {
    setFilters({
      hakukaynnissa: match(item)
        .with({ checked: true }, () => false)
        .otherwise(() => true),
    });
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
