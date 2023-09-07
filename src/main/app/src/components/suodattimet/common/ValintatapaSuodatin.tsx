import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const ValintatapaSuodatin = (
  props: Omit<SuodatinComponentProps, 'rajainValues'>
) => {
  const { t } = useTranslation();
  const { rajainOptions, rajainUIValues, setFilters } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainUIValues,
    FILTER_TYPES.VALINTATAPA
  );

  const handleCheck = useCheckboxRajainOnChange(rajainItems, setFilters);

  return (
    <Filter
      {...props}
      testId="valintatapa-filter"
      name={t('haku.valintatapa')}
      rajainValues={rajainItems}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
