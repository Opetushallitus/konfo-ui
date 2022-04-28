import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useMediaQuery } from '@material-ui/core';
import _ from 'lodash';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { getContentfulData, getContentfulManifest } from '#/src/api/konfoApi';
import { setMenuState, useMenuOpen } from '#/src/store/reducers/appSlice';
import { getAPIRequestParams } from '#/src/store/reducers/hakutulosSliceSelector';

import { SIDEMENU_WIDTH } from './constants';
import { theme } from './theme';

export const useLanguageState = () => {
  const location = useLocation();
  const history = useHistory();
  const lng = location.pathname.match(/^\/(.*?)(\/|$)/)?.[1];
  document.documentElement.setAttribute('lang', lng || 'fi');
  const setLanguage = useCallback(
    (newLang) => {
      document.documentElement.setAttribute('lang', newLang || 'fi');
      if (lng && newLang !== lng) {
        const newPath = location.pathname.replace(new RegExp(`^/${lng}`), `/${newLang}`);
        history.push({
          ...location,
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

export function usePreviousNonEmpty(value) {
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

export const useSideMenu = (callback, deps) => {
  const dispatch = useDispatch();

  const menuOpen = useMenuOpen();

  const toggle = useCallback(() => {
    dispatch(setMenuState(!menuOpen));
  }, [menuOpen, dispatch]);

  const close = useCallback(() => {
    dispatch(setMenuState(false));
  }, [dispatch]);

  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return {
    keepMenuVisible: !isSmall && menuOpen,
    state: menuOpen,
    toggleMenu: toggle,
    closeMenu: close,
    width: menuOpen ? SIDEMENU_WIDTH : 0,
  };
};
