import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from '../common/useCheckboxRajainOnChange';
export const VaativanErityisenTuenSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  const { rajainValues, rajainOptions, setRajainValues } = props;

  const allKoulutustyyppiRajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.KOULUTUSTYYPPI
  );

  const vaativanTuenKoulutuksetRajainItems = allKoulutustyyppiRajainItems.filter(
    (item: RajainItem) => item?.id === 'vaativan-tuen-koulutukset'
  );

  const onItemChange = useCheckboxRajainOnChange(
    vaativanTuenKoulutuksetRajainItems,
    setRajainValues
  );

  return (
    <Filter
      {...props}
      testId="vaativan-tuen-koulutukset"
      name={t('haku.vaativan-tuen-koulutukset')}
      rajainItems={vaativanTuenKoulutuksetRajainItems}
      onItemChange={onItemChange}
      displaySelected
    />
  );
};
