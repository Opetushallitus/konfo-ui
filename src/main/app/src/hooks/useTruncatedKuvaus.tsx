import { truncate } from 'lodash';
import { useTranslation } from 'react-i18next';

export const useTruncatedKuvaus = (kuvaus?: string) => {
  const { t } = useTranslation();
  return kuvaus
    ? truncate(
        kuvaus
          .replace(/<\/li>/gm, ',</li>')
          .replace(/\.,<\/li>/gm, '.</li>')
          .replace(/<[^>]*>/gm, ' '),
        {
          length: 255,
        }
      ) || t('haku.ei_kuvausta')
    : undefined;
};
