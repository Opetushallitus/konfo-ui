import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { isCypress, isDev } from './utils';

export const supportedLanguages = ['fi', 'sv', 'en'];
export const defaultLanguage = 'fi';

// TODO: Promise returned by i18n.init should reject when translations cannot be loaded!
export const configureI18n = () =>
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      nsSeparator: '|',
      fallbackLng: defaultLanguage,
      lng: defaultLanguage,
      supportedLngs: supportedLanguages,
      debug: isDev,
      load: 'languageOnly',
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath:
          isDev || isCypress
            ? '/konfo/locales/{{lng}}/{{ns}}.json'
            : '/konfo-backend/translation/{{lng}}',
        customHeaders: {
          'Caller-Id': '1.2.246.562.10.00000000001.konfoui',
        },
      },
      react: {
        useSuspense: false,
      },
      compatibilityJSON: 'v3',
      returnNull: false,
    });

export default i18n;
