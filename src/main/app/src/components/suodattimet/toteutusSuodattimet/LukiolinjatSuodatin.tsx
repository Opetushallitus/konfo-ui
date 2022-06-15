import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

type Props = {
  name: string;
  handleFilterChange: (value: FilterValue) => void;
  values: Array<FilterValue>;
} & SuodatinComponentProps;

export const LukiolinjatSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const { name, handleFilterChange, values = [], ...rest } = props;

  return (
    <Filter
      name={t(`haku.${name}`)}
      values={values}
      handleCheck={handleFilterChange}
      displaySelected
      {...rest}
    />
  );
};
