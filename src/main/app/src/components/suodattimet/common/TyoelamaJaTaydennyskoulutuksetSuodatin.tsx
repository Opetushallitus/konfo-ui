import React from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { isChecked, useRajainItems } from '#/src/tools/filters';
import { RajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

const TYOELAMA_JA_TAYDENNYSKOULUTUS_FILTER_TYPES = [
  RAJAIN_TYPES.JOTPA,
  RAJAIN_TYPES.TYOVOIMAKOULUTUS,
  RAJAIN_TYPES.TAYDENNYSKOULUTUS,
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
      .with(RAJAIN_TYPES.JOTPA, () => {
        setRajainValues({ jotpa: !isChecked(item) });
      })
      .with(RAJAIN_TYPES.TYOVOIMAKOULUTUS, () =>
        setRajainValues({ tyovoimakoulutus: !isChecked(item) })
      )
      .with(RAJAIN_TYPES.TAYDENNYSKOULUTUS, () => {
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
