import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

// NOTE: Hakutapa sisältää hakukaynnissa ja yhteishaku suodattimet -> tämä komponentti hoitaa yhdistelylogiikan
export const HakutapaSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  const { setRajainValues, rajainOptions, rajainValues } = props;

  const rajainItems = useRajainItems(rajainOptions, rajainValues, RAJAIN_TYPES.HAKUTAPA);

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

  return (
    <Filter
      {...props}
      testId="hakutapa-filter"
      name={t('haku.hakutapa')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
