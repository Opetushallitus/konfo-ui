import { useTranslation } from 'react-i18next';

import { useSuosikitCount } from '#/src/hooks/useSuosikitSelection';

import { SuosikitIcon } from '../components/common/SuosikitIcon';

// Palauttaa suosikit-linkin propsit, tai null jos suosikkeja ei ole
export const useSuosikitLink = () => {
  const { t } = useTranslation();
  const suosikitCount = useSuosikitCount();

  return suosikitCount > 0
    ? {
        href: 'suosikit',
        startIcon: <SuosikitIcon />,
        children: t('suosikit.otsikko'),
      }
    : null;
};
