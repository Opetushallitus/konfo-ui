import React from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { isChecked, useRajainItems } from '#/src/tools/filters';
import { RajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

const TYOELAMA_JA_TAYDENNYSKOULUTUS_FILTER_TYPES = [
  FILTER_TYPES.JOTPA,
  FILTER_TYPES.TYOVOIMAKOULUTUS,
  FILTER_TYPES.TAYDENNYSKOULUTUS,
];

export const TyoelamaJaTaydennyskoulutuksetSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues, rajainOptions, setFilters } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    TYOELAMA_JA_TAYDENNYSKOULUTUS_FILTER_TYPES
  );

  const handleCheck = (item: RajainItem) =>
    match(item.rajainId)
      .with(FILTER_TYPES.JOTPA, () => {
        setFilters({ jotpa: !isChecked(item) });
      })
      .with(FILTER_TYPES.TYOVOIMAKOULUTUS, () =>
        setFilters({ tyovoimakoulutus: !isChecked(item) })
      )
      .with(FILTER_TYPES.TAYDENNYSKOULUTUS, () => {
        setFilters({ taydennyskoulutus: !isChecked(item) });
      })
      .run();

  return (
    <Filter
      {...props}
      testId="tyoelama-ja-taydennyskoulutukset-filter"
      name={t('haku.tyoelama-ja-taydennyskoulutukset')}
      rajainValues={rajainItems}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
