import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

export const HakuaikaRajain = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues, rajainOptions, setRajainValues } = props;

  const rajainItems = useRajainItems(rajainOptions, rajainValues, [
    RAJAIN_TYPES.HAKUKAYNNISSA,
    'hakualkaapaivissa',
  ]);

  const onItemChange = (item: RajainItem) => {
    const newValues = match(item)
      .with({ id: 'hakukaynnissa' }, () => ({
        hakukaynnissa: !rajainValues.hakukaynnissa,
      }))
      .with({ rajainId: 'hakualkaapaivissa' }, () => ({
        hakualkaapaivissa: isEmpty(rajainValues.hakualkaapaivissa) ? [item.id] : [],
      }))
      .otherwise(() => null);
    if (newValues) {
      setRajainValues(newValues);
    }
  };

  return (
    <Filter
      {...props}
      testId="hakukaynnissa-filter"
      name={t('haku.hakuaika')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
