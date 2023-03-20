import { useCallback, useEffect, useRef } from 'react';

import { useMediaQuery } from '@mui/material';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { SIDEMENU_WIDTH } from '#/src/constants';
import { setMenuState, useMenuOpen } from '#/src/store/reducers/appSlice';
import { theme } from '#/src/theme';
import i18n from '#/src/tools/i18n';

export const useLanguageState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lng = location.pathname.match(/^\/(.*?)(\/|$)/)?.[1];
  if (Boolean(lng)) {
    document.documentElement.setAttribute('lang', lng);
  }
  const setLanguage = useCallback(
    (newLang) => {
      document.documentElement.setAttribute('lang', newLang || 'fi');
      if (lng && newLang !== lng) {
        i18n.changeLanguage(newLang);
        const newPath = location.pathname.replace(new RegExp(`^/${lng}`), `/${newLang}`);
        navigate({
          ...location,
          pathname: newPath,
        });
      }
    },
    [navigate, location, lng]
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

export function usePreviousNonEmpty(value) {
  const ref = useRef();

  useEffect(() => {
    if (!_.isEmpty(value)) {
      ref.current = value;
    }
  }, [value]); // Only re-run if value changes

  return ref.current;
}

export const useSideMenu = () => {
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
