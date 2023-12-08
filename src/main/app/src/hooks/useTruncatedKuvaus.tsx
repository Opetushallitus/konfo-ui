import { useMemo } from 'react';

import { truncate } from 'lodash';
import { useTranslation } from 'react-i18next';

import { stripTags } from '#/src/tools/utils';

export const stripKuvausHTML = (kuvaus: string, limit?: number) => {
  const slicedKuvaus = limit ? kuvaus.slice(0, limit) : kuvaus;
  return stripTags(
    slicedKuvaus
      .replace(/<\/strong><\/p>|<\/h\d>/g, ': ')
      .replace(/\.<\/p>/g, '. ')
      .replace(/<ul>|<ol>|(<\/?[a-zA-Z]{0,10}$)/gm, ' ')
      .replace(/([^.])<\/li>/gm, '$1, ')
      .trim()
  );
};

const TRUNCATED_KUVAUS_LENGTH = 255;

export const useTruncatedKuvaus = (kuvaus?: string) => {
  const { t } = useTranslation();
  return useMemo(
    () =>
      kuvaus
        ? truncate(stripKuvausHTML(kuvaus, TRUNCATED_KUVAUS_LENGTH * 3), {
            length: TRUNCATED_KUVAUS_LENGTH,
          }) || t('haku.ei_kuvausta')
        : undefined,
    [kuvaus, t]
  );
};
