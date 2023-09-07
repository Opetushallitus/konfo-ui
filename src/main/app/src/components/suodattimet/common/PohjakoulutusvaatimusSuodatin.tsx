import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const PohjakoulutusvaatimusSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();
  const { rajainOptions, rajainValues, setRajainValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.POHJAKOULUTUSVAATIMUS
  );

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

  return (
    <Filter
      {...props}
      testId="pohjakoulutusvaatimus-filter"
      name={t('haku.pohjakoulutusvaatimus')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
