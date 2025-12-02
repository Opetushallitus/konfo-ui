import { useTranslation } from 'react-i18next';

import { KoutaKoulutustyyppi } from '../types/common';

export const useVisibleKoulutustyyppi = ({
  koulutustyyppi,
  isAvoinKorkeakoulutus,
}: {
  koulutustyyppi?: KoutaKoulutustyyppi;
  isAvoinKorkeakoulutus?: boolean;
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
