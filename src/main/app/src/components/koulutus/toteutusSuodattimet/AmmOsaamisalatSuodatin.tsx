import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

type Props = {
  handleFilterChange: (value: FilterValue) => void;
  values: Array<FilterValue>;
} & SuodatinComponentProps;

export const AmmOsaamisalatSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const { handleFilterChange, values = [], ...rest } = props;

  return (
    <Filter
      name={t('haku.amm-osaamisalat')}
      values={values}
      handleCheck={handleFilterChange}
      displaySelected
      {...rest}
    />
  );
};
