import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import {
  FilterType,
  SuodatinComponentProps,
} from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';

import { getShownStr } from './utils';

type Props = {
  handleFilterChange: (newFilters: object) => void;
  initialValues: Array<FilterType>;
  sortedValues: Array<FilterType>;
} & SuodatinComponentProps;

export const OpetuskieliSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const { handleFilterChange, initialValues = [], sortedValues = [], ...rest } = props;

  const [checkedValues, setCheckedValues] = useState(initialValues);
  useEffect(() => {
    setCheckedValues(initialValues);
  }, [initialValues]);
  const checkedStr = useMemo(() => getShownStr(checkedValues), [checkedValues]);

  const handleCheck = useCallback(
    (value: FilterType) => {
      const { id } = value;
      const wasChecked = checkedValues.some((v) => v.id === id);
      const newCheckedValues = wasChecked
        ? checkedValues.filter((v) => v.id !== id)
        : [...checkedValues, value];

      setCheckedValues(newCheckedValues);
      handleFilterChange({ opetuskieli: newCheckedValues });
    },
    [checkedValues, handleFilterChange]
  );

  return (
    <Filter
      name={t('haku.opetuskieli')}
      sortedFilterValues={sortedValues}
      handleCheck={handleCheck}
      checkedStr={checkedStr}
      checkedValues={checkedValues}
      displaySelected
      {...rest}
    />
  );
};
