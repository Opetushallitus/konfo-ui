import { useCallback, useEffect, useRef } from 'react';

import { isEmpty } from 'lodash-es';
import { useLocation, useNavigate } from 'react-router-dom';

import { i18n } from '#/src/tools/i18n';

export const useLanguageState = (): [string | undefined, (newLang: string) => void] => {
  const location = useLocation();
  const navigate = useNavigate();
  const lng = location.pathname.match(/^\/(.*?)(\/|$)/)?.[1];
  if (lng) {
    document.documentElement.setAttribute('lang', lng);
  }
  const setLanguage = useCallback(
    (newLang: string) => {
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

export function usePreviousNonEmpty<T>(value?: T) {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (!isEmpty(value)) {
      ref.current = value;
    }
  }, [value]); // Only re-run if value changes

  return ref.current;
}
