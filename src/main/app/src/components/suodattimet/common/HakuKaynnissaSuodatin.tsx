import React from 'react';

import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

export const HakuKaynnissaSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues, rajainOptions, setRajainValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.HAKUKAYNNISSA
  );

  const onItemChange = (item: RajainItem) => {
    setRajainValues({
      hakukaynnissa: match(item)
        .with({ checked: true }, () => false)
        .otherwise(() => true),
    });
  };

  return (
    <Filter
      {...props}
      testId="hakukaynnissa-filter"
      name={t('haku.hakukaynnissa-otsikko')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
