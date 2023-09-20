import { useCallback, useMemo } from 'react';

import { findKey, find, isEmpty } from 'lodash';
import { urls } from 'oph-urls-js';

import { getContentfulData, getContentfulManifest } from '#/src/api/konfoApi';
import { LanguageCode, SlugsToIds } from '#/src/types/common';
import { CommonContentfulFields, ContentfulData } from '#/src/types/ContentfulTypes';

import { useLanguageState, usePreviousNonEmpty } from './index';
import { useQueryOnce } from './useQueryOnce';

const initialContentfulData: ContentfulData = {
  asset: {},
  content: {},
  cookieModalText: {},
  footer: {},
  info: {},
  infoYhteishaku: {},
  kortit: {},
  kortti: {},
  ohjeetJaTuki: {},
  palvelu: {},
  palvelut: {},
  pikalinkit: {},
  sivu: {},
  uutinen: {},
  uutiset: {},
  valikko: {},
  valikot: {},
  hairiotiedote: {},
  hairiotiedotteet: {},
};

const assetUrl = (url?: string) =>
  url && `${urls.url('konfo-backend.content', '')}${url}`;

const findParent = (id: string, cData: ContentfulData): Array<CommonContentfulFields> => {
  const { valikko, sivu } = cData;
  const childId = sivu[id]?.id || id;
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

const useForwardTo = (contentfulData?: ContentfulData) => {
  function forwardTo(id: string, defaultValue?: string): string;
  function forwardTo(id: string, defaultValue: null): string | null;
  function forwardTo(id: string, defaultValue: string | null = '/sivu/poistettu') {
    const sivu = contentfulData?.sivu[id];
    return sivu ? `/sivu/${sivu?.slug ?? id}` : defaultValue;
  }
  return useCallback(forwardTo, [forwardTo]);
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

  const forwardTo = useForwardTo(contentfulData);

  const murupolku = useCallback(
    (pageId: string) => {
      if (contentfulData) {
        const { sivu } = contentfulData;
        const page = sivu[pageId];

        const breadcrumb = page ? findParent(pageId, contentfulData).concat([page]) : [];
        return breadcrumb.map((b) => ({
          name: b.name,
          link: forwardTo(b.id, null),
        }));
      }
      return [];
    },
    [contentfulData, forwardTo]
  );

  const oldSlugsToIds = usePreviousNonEmpty(newSlugsToIds);

  const slugsToIds: SlugsToIds = useMemo(
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
