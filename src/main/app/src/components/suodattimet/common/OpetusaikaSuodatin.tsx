import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

export const OpetusaikaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { setFilters, rajainValues, rajainOptions } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    FILTER_TYPES.OPETUSAIKA
  );

  const handleCheck = useCheckboxRajainOnChange(rajainItems, setFilters);

  return (
    <Filter
      {...props}
      name={t('haku.opetusaika')}
      rajainValues={rajainItems}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
