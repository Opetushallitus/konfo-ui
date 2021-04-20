import { useCallback, useEffect, useMemo, useRef } from 'react';

import _ from 'lodash';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { getContentfulData, getContentfulManifest } from '#/src/api/konfoApi';
import { getAPIRequestParams } from '#/src/store/reducers/hakutulosSliceSelector';

export const useLanguageState = () => {
  const location = useLocation();
  const history = useHistory();
  const lng = location.pathname.match(/^\/(.*?)(\/|$)/)?.[1];

  const setLanguage = useCallback(
    (newLang) => {
      if (lng && newLang !== lng) {
        const newPath = location.pathname.replace(new RegExp(`^/${lng}`), `/${newLang}`);
        history.push({
          pathname: newPath,
        });
      }
    },
    [history, location, lng]
  );
  return [lng, setLanguage];
};

// Load asynchronous data once and then cache it forever
export const useQueryOnce = (key, fn, options = {}) => {
  return useQuery(key, fn, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    retry: 1,
    ...options,
  });
};

export const useQueryParams = () => {
  const apiRequestParams = useSelector(getAPIRequestParams);
  const { i18n } = useTranslation();
  const lng = useMemo(() => i18n.language, [i18n.language]);

  return { ...apiRequestParams, lng };
};

const initialContentfulData = {
  kortit: {},
  sivu: {},
  info: {},
  asset: {},
  footer: {},
  sivuKooste: {},
  content: {},
  palvelut: {},
  valikot: {},
  ohjeetJaTuki: {},
  uutiset: {},
  cookieModalText: {},
};

function usePreviousNonEmpty(value) {
  const ref = useRef();

  useEffect(() => {
    if (!_.isEmpty(value)) {
      ref.current = value;
    }
  }, [value]); // Only re-run if value changes

  return ref.current;
}

const assetUrl = (url) => url && `${urls.url('konfo-backend.content', '')}${url}`;

export const useContentful = () => {
  const [lng] = useLanguageState();

  const { data: manifest } = useQueryOnce('getManifest', getContentfulManifest);

  const { data = {}, isLoading: isLoadingContent } = useQueryOnce(
    ['getContentfulData', manifest, lng],
    () => getContentfulData(manifest, lng),
    { enabled: Boolean(manifest) }
  );

  const { contentfulData, slugsToIds: newSlugsToIds } = data;

  const forwardTo = useCallback(
    (id, nullIfUnvailable) => {
      const sivu = contentfulData.sivu[id] || contentfulData.sivuKooste[id];
      return sivu
        ? `/sivu/${sivu.slug || id}`
        : nullIfUnvailable
        ? null
        : `/sivu/poistettu`;
    },
    [contentfulData]
  );

  const murupolku = useCallback(
    (pageId) => {
      const { valikko, sivu, sivuKooste } = contentfulData;
      const all = Object.entries(valikko)
        .concat(Object.entries(sivu))
        .concat(Object.entries(sivuKooste));
      const page = sivu[pageId] || sivuKooste[pageId];
      const findParent = (id) => {
        const childId = (sivu[id] || sivuKooste[id] || {}).id || id;
        const parent = all.find((entry) => {
          const [, item] = entry;
          return (item.linkki || []).find((i) => i.id === childId);
        });
        if (parent) {
          const [parentId, parentItem] = parent;
          return findParent(parentId).concat([parentItem]);
        } else {
          return [];
        }
      };
      const breadcrumb = page ? findParent(pageId).concat([page]) : [];
      return breadcrumb.map((b) => ({
        name: b.name,
        link: forwardTo(b.id, true),
      }));
    },
    [contentfulData, forwardTo]
  );

  const oldSlugsToIds = usePreviousNonEmpty(newSlugsToIds);

  const slugsToIds = useMemo(
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
      isLoading: isLoadingContent || _.isEmpty(slugsToIds),
    }),
    [forwardTo, murupolku, slugsToIds, contentfulData, isLoadingContent]
  );
};
