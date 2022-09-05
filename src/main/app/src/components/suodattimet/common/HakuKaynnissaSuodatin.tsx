import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

// NOTE: Hakutapa sisältää hakukaynnissa ja yhteishaku suodattimet -> tämä komponentti hoitaa yhdistelylogiikan
export const HakuKaynnissaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { values = [], setFilters } = props;

  const handleCheck = (item: FilterValue) => {
    if (item.filterId === FILTER_TYPES.HAKUKAYNNISSA) {
      setFilters({ hakukaynnissa: !item.checked });
    }
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
