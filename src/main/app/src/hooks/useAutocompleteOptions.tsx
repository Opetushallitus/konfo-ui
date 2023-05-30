import { useMemo } from 'react';

import { isEmpty, omit, concat } from 'lodash';
import { TFunction, useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { AutocompleteOption, AutocompleteResult } from '#/src/types/common';

import { useHakuUrl } from '../components/haku/hakutulosHooks';

export const useAutocompleteOptions = (
  keyword: string,
  type: 'koulutus' | 'oppilaitos',
  t: TFunction,
  response?: AutocompleteResult['koulutukset'] | AutocompleteResult['oppilaitokset']
) => {
  const hits = response?.hits;
  const total = response?.total;

  const { i18n } = useTranslation();
  const lng = i18n.language;

  const hakuUrl = useHakuUrl(keyword, type);
  return useMemo(
    () =>
      isEmpty(hits)
        ? []
        : concat(
            hits?.map?.((hit) => ({
              ...omit(hit, ['oid', 'nimi']),
              label: localize(hit.nimi),
              type,
              link: `/${lng}/${type}/${hit.oid}`,
            })) as Array<AutocompleteOption>,
            [
              {
                label: t(`haku.nayta-kaikki-${type}-hakutulokset`, { count: total }),
                type,
                link: hakuUrl,
              },
            ]
          ),
    [hits, total, t, hakuUrl, lng, type]
  );
};
