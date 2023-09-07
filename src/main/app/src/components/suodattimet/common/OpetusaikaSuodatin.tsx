import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const OpetusaikaSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();
  const { setRajainValues, rajainValues, rajainOptions } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    FILTER_TYPES.OPETUSAIKA
  );

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

  return (
    <Filter
      {...props}
      name={t('haku.opetusaika')}
      rajainItems={rajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
