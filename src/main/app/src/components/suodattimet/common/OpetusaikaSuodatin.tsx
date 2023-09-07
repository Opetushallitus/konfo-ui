import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getStateChangesForCheckboxRajaimet, useRajainItems } from '#/src/tools/filters';
import { RajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

export const OpetusaikaSuodatin = (
  props: Omit<SuodatinComponentProps, 'rajainValues'>
) => {
  const { t } = useTranslation();
  const { setFilters, rajainUIValues, rajainOptions } = props;

  const rajainItems =
    useRajainItems(rajainOptions, rajainUIValues!, FILTER_TYPES.OPETUSAIKA) ?? [];

  const handleCheck = (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(rajainItems)(item);
    setFilters(changes);
  };

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
