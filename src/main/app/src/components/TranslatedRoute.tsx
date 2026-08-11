import { useEffect } from 'react';

import Cookies from 'js-cookie';
import { includes } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

import { supportedLanguages } from '#/src/tools/i18n';

export const TranslatedRoute = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const selectedLanguage = params?.lng;
  const isSupportedLanguageSelected = includes(supportedLanguages, selectedLanguage);

  useEffect(() => {
    if (selectedLanguage && isSupportedLanguageSelected) {
      i18n.changeLanguage(selectedLanguage);
      Cookies.set('lang', selectedLanguage, {
        expires: 1800,
        path: '/',
      });
    }
  }, [i18n, selectedLanguage, isSupportedLanguageSelected]);

  if (!isSupportedLanguageSelected) {
    const langCookie = Cookies.get('lang');
    const newLocation = {
      ...location,
      pathname: '/' + (langCookie ?? 'fi') + location.pathname,
    };

    return <Navigate to={newLocation} replace />;
  }

  return <Outlet />;
};
