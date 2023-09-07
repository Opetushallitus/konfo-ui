import React from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const HakuKaynnissaSuodatin = (
  props: Omit<SuodatinComponentProps, 'rajainValues'>
) => {
  const { t } = useTranslation();

  const { rajainUIValues, rajainOptions, setFilters } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainUIValues,
    FILTER_TYPES.HAKUKAYNNISSA
  );

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
      rajainValues={rajainItems}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
