import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from '../common/useCheckboxRajainOnChange';

export const KoulutusalaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { rajainOptions, rajainValues, setFilters } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    FILTER_TYPES.KOULUTUSALA
  );

  const handleCheck = useCheckboxRajainOnChange(rajainItems, setFilters);

  return (
    <Filter
      {...props}
      testId="koulutusalat-filter"
      name={t('haku.koulutusalat')}
      rajainValues={rajainItems}
      handleCheck={handleCheck}
    />
  );
};
