import React from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { isChecked, useRajainItems } from '#/src/tools/filters';
import { RajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

const TYOELAMA_JA_TAYDENNYSKOULUTUS_FILTER_TYPES = [
  FILTER_TYPES.JOTPA,
  FILTER_TYPES.TYOVOIMAKOULUTUS,
  FILTER_TYPES.TAYDENNYSKOULUTUS,
];

export const TyoelamaJaTaydennyskoulutuksetSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues, rajainOptions, setRajainValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    TYOELAMA_JA_TAYDENNYSKOULUTUS_FILTER_TYPES
  );

  const onItemChange = (item: RajainItem) =>
    match(item.rajainId)
      .with(FILTER_TYPES.JOTPA, () => {
        setRajainValues({ jotpa: !isChecked(item) });
      })
      .with(FILTER_TYPES.TYOVOIMAKOULUTUS, () =>
        setRajainValues({ tyovoimakoulutus: !isChecked(item) })
      )
      .with(FILTER_TYPES.TAYDENNYSKOULUTUS, () => {
        setRajainValues({ taydennyskoulutus: !isChecked(item) });
      })
      .run();

  return (
    <Filter
      {...props}
      testId="tyoelama-ja-taydennyskoulutukset"
      name={t('haku.tyoelama-ja-taydennyskoulutukset')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
