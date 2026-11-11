import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { isPlaywright, isDev } from './utils';

export const supportedLanguages = ['fi', 'sv', 'en'];
export const defaultLanguage = 'fi';

const V3_PLURAL_SUFFIX = '_plural';

// Käännökset ovat i18next:n vanhassa v3-JSON-muodossa (avain + avain_plural), jota i18next >= 24 ei enää tue.
// Muunnetaan "_plural"-päätteiset avaimet v4-muotoon ("_other"). Yksikkömuotona toimii päätteetön avain.
const convertV3PluralsToV4 = (value) => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [
      key.endsWith(V3_PLURAL_SUFFIX)
        ? `${key.slice(0, -V3_PLURAL_SUFFIX.length)}_other`
        : key,
      convertV3PluralsToV4(val),
    ])
  );
};

// TODO: Promise returned by i18n.init should reject when translations cannot be loaded!
export const configureI18n = () =>
  i18next
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
          isDev || isPlaywright
            ? '/konfo/locales/{{lng}}/{{ns}}.json'
            : '/konfo-backend/translation/{{lng}}',
        customHeaders: {
          'Caller-Id': '1.2.246.562.10.00000000001.konfoui',
        },
        parse: (data) => convertV3PluralsToV4(JSON.parse(data)),
      },
      react: {
        useSuspense: false,
      },
      returnNull: false,
    });

export const i18n = i18next;
