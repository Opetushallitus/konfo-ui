import React from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { RajainUIItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const TyoelamaJaTaydennyskoulutuksetSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues = [], setFilters } = props;

  const handleCheck = (item: RajainUIItem) =>
    match(item.rajainId)
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
        testId="tyoelama-ja-taydennyskoulutukset-filter"
        name={t('haku.tyoelama-ja-taydennyskoulutukset')}
        rajainValues={rajainValues}
        handleCheck={handleCheck}
        displaySelected
      />
    </>
  );
};
