import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const OpetuskieliSuodatin = (
  props: Omit<SuodatinComponentProps, 'rajainValues'>
) => {
  const { t } = useTranslation();
  const { setFilters, rajainOptions, rajainUIValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainUIValues,
    FILTER_TYPES.OPETUSKIELI
  );

  const handleCheck = useCheckboxRajainOnChange(rajainItems, setFilters);

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      rajainValues={rajainItems}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
