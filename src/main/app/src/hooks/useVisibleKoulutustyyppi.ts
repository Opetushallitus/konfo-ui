import { useTranslation } from 'react-i18next';

import { Koulutustyyppi } from '../constants';

export const useVisibleKoulutustyyppi = ({
  koulutustyyppi,
  isAvoinKorkeakoulutus,
}: {
  koulutustyyppi?: Koulutustyyppi;
  isAvoinKorkeakoulutus: boolean;
}) => {
  const { t } = useTranslation();
  if (!koulutustyyppi) {
    return '';
  }
  return (
    t(`koulutus.tyyppi-${koulutustyyppi}`) +
    (isAvoinKorkeakoulutus ? ' ' + t('avoin-kk-suffix') : '')
  );
};
