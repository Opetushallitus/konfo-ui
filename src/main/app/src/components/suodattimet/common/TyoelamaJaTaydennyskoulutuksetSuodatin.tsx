import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import {
  FilterValue,
  FilterValues,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

import { useFilterProps } from '../../haku/hakutulosHooks';

type Props = Omit<SuodatinComponentProps, 'values'> & {
  values: {
    jotpa: FilterValues;
    tyovoimakoulutus: FilterValues;
    taydennyskoulutus: FilterValues;
  };
};

export const useTyoelamaSuodatinValues = () => {
  const jotpa = useFilterProps(FILTER_TYPES.JOTPA);
  const tyovoimakoulutus = useFilterProps(FILTER_TYPES.TYOVOIMAKOULUTUS);
  const taydennyskoulutus = useFilterProps(FILTER_TYPES.TAYDENNYSKOULUTUS);

  return useMemo(
    () => ({
      jotpa,
      taydennyskoulutus,
      tyovoimakoulutus,
    }),
    [jotpa, tyovoimakoulutus, taydennyskoulutus]
  );
};

export const TyoelamaJaTaydennyskoulutuksetSuodatin = (props: Props) => {
  const { t } = useTranslation();

  const { values, setFilters } = props;

  const handleCheck = (item: FilterValue) =>
    match(item.filterId)
      .with(FILTER_TYPES.JOTPA, () => {
        setFilters({ jotpa: !item.checked });
      })
      .with(FILTER_TYPES.TYOVOIMAKOULUTUS, () =>
        setFilters({ tyovoimakoulutus: !item.checked })
      )
      .with(FILTER_TYPES.TAYDENNYSKOULUTUS, () => {
        setFilters({ taydennyskoulutus: !item.checked });
      })
      .run();

  return (
    <>
      <Filter
        {...props}
        testId="jotpa-filter"
        name={t('haku.jotpa')}
        values={values.jotpa}
        handleCheck={handleCheck}
        displaySelected
      />
      <Filter
        {...props}
        testId="tyovoimakoulutukset-filter"
        name={t('haku.tyovoimakoulutukset')}
        values={values.tyovoimakoulutus}
        handleCheck={handleCheck}
        displaySelected
      />
      <Filter
        {...props}
        testId="tyovoimakoulutukset-filter"
        name={t('haku.tyovoimakoulutukset')}
        values={values.taydennyskoulutus}
        handleCheck={handleCheck}
        displaySelected
      />
    </>
  );
};
