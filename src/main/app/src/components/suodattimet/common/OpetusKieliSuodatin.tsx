import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const OpetuskieliSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();
  const { setRajainValues, rajainOptions, rajainValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    FILTER_TYPES.OPETUSKIELI
  );

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
