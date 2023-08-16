import DOMPurify from 'dompurify';
import parseHtmlToReact from 'html-react-parser';
import { pickBy, capitalize, trim, isEmpty, isString, find, kebabCase } from 'lodash';

import { NDASH } from '#/src/constants';

import { getLanguage, getTranslationForKey, localize } from './localization';

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener');
  }
});

export const sanitizeHTML = (html) => DOMPurify.sanitize(html);

// Filters all untruthy values, we do not want false or 0 values sent
export const cleanRequestParams = (params) => pickBy(params, Boolean);

export const koodiUriToPostinumero = (str = '') => {
  return str.match(/^posti_(\d+)/)?.[1] ?? '';
};

export const parseOsoiteData = (osoiteData) => {
  const postiosoite = osoiteData?.postiosoite ?? {};
  const osoite = localize(postiosoite.osoite);
  const postinumero = koodiUriToPostinumero(postiosoite.postinumero?.koodiUri);
  const postitoimipaikka = capitalize(localize(postiosoite.postinumero?.nimi));
  const yhteystiedot =
    osoite && postinumero && postitoimipaikka
      ? trim(`${osoite}, ${postinumero} ${postitoimipaikka}`, ', ')
      : '';
  const sahkoposti = osoiteData?.sahkoposti;
  const nimi = osoiteData?.nimi;

  return { nimi, osoite, postinumero, postitoimipaikka, sahkoposti, yhteystiedot };
};

export const getSearchAddress = (postitoimipaikka = '', osoite = '') => {
  // 'PL 123, osoite 123' <- we need to remove any PL (postilokero) parts for map searches
  const usedOsoite = osoite
    .split(',')
    .filter((s) => !s.includes('PL'))
    .map((s) => s.trim())
    .join(', ');
  const fullAddress = [postitoimipaikka, usedOsoite].filter(Boolean).join(' ');
  const withoutNumbers = fullAddress.split(' ').filter(isNaN).join(' ');

  // This cuts the string after any words + single number e.g. 'Paikkakunta Osoite 123 this is cut'
  // TODO: Is this really necessary
  const regexp = /^.+? \d+/;
  const coreAddress = fullAddress.match(regexp)?.[0];

  if (!coreAddress) {
    consoleWarning('Warning: returning null for core address, input: ' + fullAddress);
  }
  return {
    address: coreAddress || postitoimipaikka,
    addressNoNumbers: withoutNumbers, // NOTE: This is used when given street number is not found in Oskari map
  };
};

export function formatDateString(d) {
  if (!d) {
    return '';
  }

  return d[getLanguage()] || '';
}

export const formatDateRange = (start, end) =>
  `${formatDateString(start)} ${NDASH} ${end ? formatDateString(end) : ''}`;

export const sanitizedHTMLParser = (html, ...rest) =>
  parseHtmlToReact(sanitizeHTML(html), ...rest);

export const toId = kebabCase;

export const scrollIntoView = (
  element,
  options = {
    behavior: 'smooth',
  }
) => {
  element?.scrollIntoView(options);
};

export const scrollToId = (id, options) =>
  scrollIntoView(document.getElementById(id), options);

export const consoleWarning = (...props) => {
  if (!isPlaywright) {
    console.warn(...props);
  }
};

function getFormattedOpintojenLaajuus(
  opintojenLaajuusNumero,
  opintojenLaajuusYksikko,
  opintojenLaajuusMin,
  opintojenLaajuusMax
) {
  const usedOpintojenLaajuusNumero =
    !isEmpty(opintojenLaajuusMin) && opintojenLaajuusMin === opintojenLaajuusMax
      ? opintojenLaajuusMin
      : opintojenLaajuusNumero;

  let opintojenLaajuus;
  if (usedOpintojenLaajuusNumero) {
    const includesYksikko = /\D+$/.test(usedOpintojenLaajuusNumero);

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

function getLocalizedKoulutusOpintojenLaajuus(koulutus) {
  const tutkinnonOsat = koulutus?.tutkinnonOsat || [];

  let opintojenLaajuusNumero =
    (koulutus?.opintojenLaajuus && localize(koulutus?.opintojenLaajuus)) ||
    formatDouble(koulutus?.opintojenLaajuusNumero) ||
    (tutkinnonOsat && tutkinnonOsat.map((k) => k?.opintojenLaajuusNumero).join(' + '));

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

export function getLocalizedKoulutusLaajuus(koulutus) {
  return (
    getLocalizedKoulutusOpintojenLaajuus(koulutus) ||
    getTranslationForKey('koulutus.ei-laajuutta')
  );
}

export function getLocalizedOpintojenLaajuus(toteutus, koulutus) {
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

export function byLocaleCompare(prop) {
  return function (a, b) {
    return a[prop].toString().localeCompare(b[prop], getLanguage());
  };
}

export const condArray = (cond, item) => (cond ? [item] : []);

export const formatDouble = (number, fixed) =>
  (fixed === undefined ? number : number?.toFixed(fixed))?.toString().replace('.', ',');

export const isPlaywright = Boolean(localStorage.getItem('isPlaywright'));

export const isDev = import.meta.env.MODE === 'development';

export const isProd = import.meta.env.MODE === 'production';

export const getPaginationPage = ({ offset, size }) =>
  1 + (size ? Math.round(offset / size) : 0);

const tryCatch = (fn, defaultValue) => {
  try {
    return fn();
  } catch (e) {
    return defaultValue;
  }
};

export const parseUrl = (url) => tryCatch(() => new URL(url));
