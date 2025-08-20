import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { isChecked, useRajainItems } from '#/src/tools/filters';
import { RajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

export const MuutSuodattimet = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues, rajainOptions, setRajainValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.PIENIOSAAMISKOKONAISUUS
  );

  const onItemChange = (item: RajainItem) =>
    match(item.rajainId)
      .with(RAJAIN_TYPES.PIENIOSAAMISKOKONAISUUS, () => {
        setRajainValues({ pieniosaamiskokonaisuus: !isChecked(item) });
      })
      .run();

  return (
    <Filter
      {...props}
      testId="muut-filter"
      name={t('haku.muut-rajaimet')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
