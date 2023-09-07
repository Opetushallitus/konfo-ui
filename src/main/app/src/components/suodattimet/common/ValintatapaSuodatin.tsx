import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const ValintatapaSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();
  const { rajainOptions, rajainValues, setRajainValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.VALINTATAPA
  );

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

  return (
    <Filter
      {...props}
      testId="valintatapa-filter"
      name={t('haku.valintatapa')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
