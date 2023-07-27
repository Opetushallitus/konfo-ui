import { useCallback, useMemo } from 'react';

import { findKey, find, isEmpty } from 'lodash';
import { urls } from 'oph-urls-js';

import { getContentfulData, getContentfulManifest } from '#/src/api/konfoApi';
import { LanguageCode } from '#/src/types/common';
import { CommonContentfulFields, ContentfulData } from '#/src/types/ContentfulTypes';

import { useLanguageState, usePreviousNonEmpty } from './index';
import { useQueryOnce } from './useQueryOnce';

const initialContentfulData: ContentfulData = {
  asset: {},
  content: {},
  cookieModalText: {},
  esittely: {},
  footer: {},
  info: {},
  infoGrid: {},
  infoYhteishaku: {},
  kortit: {},
  kortti: {},
  lehti: {},
  ohjeetJaTuki: {},
  palvelu: {},
  palvelut: {},
  puu: {},
  sivu: {},
  sivuKooste: {},
  uutinen: {},
  uutiset: {},
  valikko: {},
  valikot: {},
};

const assetUrl = (url?: string) =>
  url && `${urls.url('konfo-backend.content', '')}${url}`;

const findParent = (id: string, cData: ContentfulData): Array<CommonContentfulFields> => {
  const { valikko, sivu, sivuKooste } = cData;
  const childId = (sivu[id] || sivuKooste[id] || {}).id || id;
  const parentId = findKey(valikko, (item) => {
    return find(item.linkki, (i) => i?.id === childId);
  });
  if (parentId) {
    const parentItem = valikko[parentId];
    return findParent(parentId, cData).concat([parentItem]);
  } else {
    return [];
  }
};

export const useContentful = () => {
  const [lng] = useLanguageState();

  const { data: manifest } = useQueryOnce('getManifest', getContentfulManifest);

  const { data, isLoading: isLoadingContent } = useQueryOnce(
    ['getContentfulData', manifest, lng],
    () => getContentfulData(manifest!, lng as LanguageCode),
    { enabled: Boolean(manifest) }
  );

  const { contentfulData, slugsToIds: newSlugsToIds } = data ?? {};

  const forwardTo = useCallback(
    (id: string, nullIfUnvailable: boolean = false) => {
      const sivu = contentfulData?.sivu[id] || contentfulData?.sivuKooste[id];
      const link = sivu ? `/sivu/${sivu?.slug ?? id}` : undefined;
      if (nullIfUnvailable) {
        return link ?? null;
      } else {
        return link ?? '/sivu/poistettu';
      }
    },
    [contentfulData]
  );

  const murupolku = useCallback(
    (pageId: string) => {
      if (contentfulData) {
        const { sivu, sivuKooste } = contentfulData;
        const page = sivu[pageId] || sivuKooste[pageId];

        const breadcrumb = page ? findParent(pageId, contentfulData).concat([page]) : [];
        return breadcrumb.map((b) => ({
          name: b.name,
          link: forwardTo(b.id, true),
        }));
      }
      return [];
    },
    [contentfulData, forwardTo]
  );

  const oldSlugsToIds = usePreviousNonEmpty(newSlugsToIds);

  const slugsToIds: Record<string, { language: LanguageCode; id: string }> = useMemo(
    () => ({ ...(oldSlugsToIds ?? {}), ...(newSlugsToIds ?? {}) }),
    [oldSlugsToIds, newSlugsToIds]
  );

  return useMemo(
    () => ({
      forwardTo,
      murupolku,
      assetUrl,
      slugsToIds,
      data: contentfulData ?? initialContentfulData,
      isLoading: isLoadingContent || isEmpty(slugsToIds),
    }),
    [forwardTo, murupolku, slugsToIds, contentfulData, isLoadingContent]
  );
};
