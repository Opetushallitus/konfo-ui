import DOMPurify from 'dompurify';
import parseHtmlToReact, { HTMLReactParserOptions } from 'html-react-parser';
import { TFunction } from 'i18next';
import {
  pickBy,
  capitalize,
  trim,
  isEmpty,
  isString,
  find,
  kebabCase,
  merge,
} from 'lodash';

import { NDASH } from '#/src/constants';
import {
  TranslateableKoodi,
  TODOType,
  Translateable,
  Osaamismerkkikuvaus,
} from '#/src/types/common';

import { getLanguage, getTranslationForKey, localize } from './localization';
import { Pagination } from '../store/reducers/koulutusSlice';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener');
  }
});

export const sanitizeHTML = (html: string) => DOMPurify.sanitize(html);

export const stripTags = (html: string) => DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });

// Filters all untruthy values, we do not want false or 0 values sent
export const cleanRequestParams = (params?: Record<string, any>) =>
  params ? pickBy(params, Boolean) : {};

export const koodiUriToPostinumero = (str?: string | null) => {
  return str?.match(/^posti_(\d+)/)?.[1] ?? '';
};

export const parseOsoiteData = (osoiteData: {
  postiosoite: {
    osoite: Translateable;
    postinumero: TranslateableKoodi;
  };
  sahkoposti?: string;
  nimi?: string;
}) => {
  const postiosoite = osoiteData?.postiosoite ?? {};
  const osoite = localize(postiosoite.osoite);
  const localizedPostinumerokoodi = localize(postiosoite?.postinumero);
  const postinumero = koodiUriToPostinumero(localizedPostinumerokoodi?.koodiUri);
  const postitoimipaikka = capitalize(localizedPostinumerokoodi?.nimi);
  const yhteystiedot =
    osoite && postinumero && postitoimipaikka
      ? trim(`${osoite}, ${postinumero} ${postitoimipaikka}`, ', ')
      : '';
  const sahkoposti = osoiteData?.sahkoposti;
  const nimi = osoiteData?.nimi;

  return { nimi, osoite, postinumero, postitoimipaikka, sahkoposti, yhteystiedot };
};

export const getSearchAddress = (postitoimipaikka: string = '', osoite: string = '') => {
  // 'PL 123, osoite 123' <- we need to remove any PL (postilokero) parts for map searches
  const usedOsoite = osoite
    .split(',')
    .filter((s) => !s.includes('PL'))
    .map((s) => s.trim())
    .join(', ');
  const fullAddress = [postitoimipaikka, usedOsoite].filter(Boolean).join(' ');
  const withoutNumbers = fullAddress
    .split(' ')
    .filter((_) => isNaN(Number(_)))
    .join(' ');

  // This cuts the string after any words + single number e.g. 'Paikkakunta Osoite 123 this is cut'
  // TODO: Is this really necessary
  const regexp = /^.+? \d+/;
  const coreAddress = fullAddress.match(regexp)?.[0];

  if (!coreAddress) {
    console.warn('Warning: returning null for core address, input: ' + fullAddress);
  }
  return {
    address: coreAddress || postitoimipaikka,
    addressNoNumbers: withoutNumbers, // NOTE: This is used when given street number is not found in Oskari map
  };
};

export const formatDateRange = (start: Translateable, end?: Translateable) =>
  `${localize(start)} ${NDASH} ${end ? localize(end) : ''}`;

export const sanitizedHTMLParser = (html: string, options?: HTMLReactParserOptions) =>
  parseHtmlToReact(sanitizeHTML(html), options);

export const toId = kebabCase;

export const scrollIntoView = (
  element?: Element | null,
  options?: ScrollIntoViewOptions
) => {
  element?.scrollIntoView(merge({ behavior: 'smooth' }, options));
};

export const scrollToId = (id?: string, options?: ScrollIntoViewOptions) =>
  scrollIntoView(id ? document.getElementById(id) : null, options);

function getFormattedOpintojenLaajuus(
  opintojenLaajuusNumero: string,
  opintojenLaajuusYksikko: string,
  opintojenLaajuusMin?: string,
  opintojenLaajuusMax?: string
) {
  const usedOpintojenLaajuusNumero =
    !isEmpty(opintojenLaajuusMin) && opintojenLaajuusMin === opintojenLaajuusMax
      ? opintojenLaajuusMin
      : opintojenLaajuusNumero;

  let opintojenLaajuus;
  if (usedOpintojenLaajuusNumero) {
    const includesYksikko = /\D$/.test(usedOpintojenLaajuusNumero);

    if (includesYksikko) {
      opintojenLaajuus = usedOpintojenLaajuusNumero;
    } else if (opintojenLaajuusYksikko) {
      opintojenLaajuus =
        `${usedOpintojenLaajuusNumero} ${opintojenLaajuusYksikko}`.trim();
    }
  } else if (opintojenLaajuusMin || opintojenLaajuusMax) {
    if (opintojenLaajuusMin && opintojenLaajuusMax) {
      opintojenLaajuus =
        `${opintojenLaajuusMin}${NDASH}${opintojenLaajuusMax} ${opintojenLaajuusYksikko}`.trim();
    } else if (opintojenLaajuusMin) {
      opintojenLaajuus = `${getTranslationForKey(
        'vähintään'
      )} ${opintojenLaajuusMin} ${opintojenLaajuusYksikko}`.trim();
    } else if (opintojenLaajuusMax) {
      opintojenLaajuus = `${getTranslationForKey(
        'enintään'
      )} ${opintojenLaajuusMax} ${opintojenLaajuusYksikko}`.trim();
    }
  }

  return opintojenLaajuus;
}

function getLocalizedKoulutusOpintojenLaajuus(koulutus: TODOType) {
  const tutkinnonOsat = koulutus?.tutkinnonOsat || [];

  let opintojenLaajuusNumero =
    (koulutus?.opintojenLaajuus && localize(koulutus?.opintojenLaajuus)) ||
    formatDouble(koulutus?.opintojenLaajuusNumero) ||
    (tutkinnonOsat &&
      tutkinnonOsat.map((k: TODOType) => k?.opintojenLaajuusNumero).join(' + '));

  if (isString(opintojenLaajuusNumero)) {
    opintojenLaajuusNumero = opintojenLaajuusNumero.split('+').map(trim).join(' + ');
  }

  const opintojenLaajuusYksikko =
    localize(
      koulutus?.opintojenLaajuusyksikko ||
        find(tutkinnonOsat, 'opintojenLaajuusyksikko')?.opintojenLaajuusyksikko
    ) || '';

  const opintojenLaajuusMin = formatDouble(koulutus?.opintojenLaajuusNumeroMin);
  const opintojenLaajuusMax = formatDouble(koulutus?.opintojenLaajuusNumeroMax);

  return getFormattedOpintojenLaajuus(
    opintojenLaajuusNumero,
    opintojenLaajuusYksikko,
    opintojenLaajuusMin,
    opintojenLaajuusMax
  );
}

export function getLocalizedKoulutusLaajuus(koulutus: TODOType) {
  return (
    getLocalizedKoulutusOpintojenLaajuus(koulutus) ||
    getTranslationForKey('koulutus.ei-laajuutta')
  );
}

export function getLocalizedOpintojenLaajuus(toteutus: TODOType, koulutus?: TODOType) {
  const laajuusNumero = formatDouble(
    toteutus?.metadata?.opintojenLaajuusNumero || toteutus?.opintojenLaajuusNumero
  );
  const laajuusNumeroMin = formatDouble(
    toteutus?.metadata?.opintojenLaajuusNumeroMin || toteutus?.opintojenLaajuusNumeroMin
  );
  const laajuusNumeroMax = formatDouble(
    toteutus?.metadata?.opintojenLaajuusNumeroMax || toteutus?.opintojenLaajuusNumeroMax
  );
  const laajuusyksikko = localize(
    toteutus?.metadata?.opintojenLaajuusyksikko || toteutus?.opintojenLaajuusyksikko
  );
  const laajuus = getFormattedOpintojenLaajuus(
    laajuusNumero,
    laajuusyksikko,
    laajuusNumeroMin,
    laajuusNumeroMax
  );
  return (
    laajuus ||
    getLocalizedKoulutusOpintojenLaajuus(koulutus) ||
    getTranslationForKey('koulutus.ei-laajuutta')
  );
}

export function byLocaleCompare<T extends string>(prop: T) {
  return function <X extends { [P in T]: number | string }>(a: X, b: X) {
    return a[prop].toString().localeCompare(b[prop].toString(), getLanguage());
  };
}

export const condArray = <T>(cond: boolean, item: T) => (cond ? [item] : []);

export const formatDouble = (number: number, fixed?: number) =>
  (fixed === undefined ? number : number?.toFixed(fixed))?.toString().replace('.', ',');

export const isPlaywright = Boolean(localStorage.getItem('isPlaywright'));

export const isDev = import.meta.env.MODE === 'development';

export const isProd = import.meta.env.MODE === 'production';

export const getPaginationPage = ({ offset, size }: Pagination) =>
  1 + (size ? Math.round((offset ?? 0) / size) : 0);

const tryCatch = <T>(fn: () => T, defaultValue?: T) => {
  try {
    return fn();
  } catch (e) {
    return defaultValue;
  }
};

export const safeParseNumber = (num?: string | number) => {
  const n = Number(num);
  return isNaN(n) ? undefined : n;
};

export const parseUrl = (url: string) => tryCatch(() => new URL(url));

const defaultCompareFn = <T>(a: T, b: T) => (a < b ? -1 : 1);

export const sortArray = <T>(
  arr: Array<T>,
  compareFn: (a: T, b: T) => number = defaultCompareFn<T>
) => arr.sort(compareFn);

export const isNonNil = <TValue>(
  value: TValue | null | undefined | false
): value is TValue => value != null;

export const isTruthy = <TValue>(
  value: TValue | null | undefined | false
): value is TValue => Boolean(value);

export const getLocalizedOsaamismerkkikuvaus = (
  kuvaus: Osaamismerkkikuvaus,
  t: TFunction
) => {
  const { osaamistavoitteet, arviointikriteerit } = kuvaus;

  const osaamistavoitteetTitle = isEmpty(osaamistavoitteet)
    ? ''
    : `${t('haku.osaamistavoitteet')}: `;
  const arviointikriteeritTitle = isEmpty(arviointikriteerit)
    ? ''
    : `${t('haku.arviointikriteerit')}: `;
  return (
    osaamistavoitteetTitle +
    localize(osaamistavoitteet) +
    (isEmpty(osaamistavoitteet) ? '' : ' ') +
    arviointikriteeritTitle +
    localize(arviointikriteerit)
  );
};
