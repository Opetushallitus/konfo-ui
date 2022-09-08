import DOMPurify from 'dompurify';
import _fp from 'lodash/fp';
import ReactHtmlParser from 'react-html-parser';

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
export const cleanRequestParams = _fp.pickBy(_fp.identity);

export const koodiUriToPostinumero = (str = '') => {
  return str.match(/^posti_(\d+)/)?.[1] ?? '';
};

export const parseOsoiteData = (osoiteData) => {
  const postiosoite = osoiteData?.postiosoite ?? {};
  const osoite = localize(postiosoite.osoite);
  const postinumero = koodiUriToPostinumero(postiosoite.postinumero?.koodiUri);
  const postitoimipaikka = _fp.capitalize(localize(postiosoite.postinumero?.nimi));
  const yhteystiedot =
    osoite && postinumero && postitoimipaikka
      ? _fp.trim(`${osoite}, ${postinumero} ${postitoimipaikka}`, ', ')
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
  ReactHtmlParser(sanitizeHTML(html), ...rest);

export const toId = _fp.kebabCase;

export const scrollIntoView = (element) => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

const { NODE_ENV } = process.env || {};

export const consoleWarning = (...props) => {
  if (NODE_ENV !== 'test') {
    console.warn(...props);
  }
};

function getLocalizedKoulutusOpintojenLaajuus(koulutus) {
  const tutkinnonOsat = koulutus?.tutkinnonOsat || [];

  let opintojenLaajuusNumero =
    (koulutus?.opintojenLaajuus && localize(koulutus?.opintojenLaajuus)) ||
    formatDouble(koulutus?.opintojenLaajuusNumero) ||
    (tutkinnonOsat && tutkinnonOsat.map((k) => k?.opintojenLaajuusNumero).join(' + '));

  if (_fp.isString(opintojenLaajuusNumero)) {
    opintojenLaajuusNumero = opintojenLaajuusNumero.split('+').map(_fp.trim).join(' + ');
  }

  const opintojenLaajuusYksikko =
    localize(
      koulutus?.opintojenLaajuusyksikko ||
        _fp.find('opintojenLaajuusyksikko', tutkinnonOsat)?.opintojenLaajuusyksikko
    ) || '';

  const opintojenLaajuusMin = formatDouble(koulutus?.opintojenLaajuusNumeroMin);
  const opintojenLaajuusMax = formatDouble(koulutus?.opintojenLaajuusNumeroMax);

  if (!_fp.isEmpty(opintojenLaajuusMin) && opintojenLaajuusMin === opintojenLaajuusMax) {
    opintojenLaajuusNumero = opintojenLaajuusMin;
  }

  let opintojenLaajuus;
  if (opintojenLaajuusNumero) {
    const includesYksikko = /\D+$/.test(opintojenLaajuusNumero);

    if (includesYksikko) {
      opintojenLaajuus = opintojenLaajuusNumero;
    } else if (opintojenLaajuusYksikko) {
      opintojenLaajuus = `${opintojenLaajuusNumero} ${opintojenLaajuusYksikko}`.trim();
    }
  } else if (opintojenLaajuusMin) {
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

export function getLocalizedKoulutusLaajuus(koulutus) {
  return (
    getLocalizedKoulutusOpintojenLaajuus(koulutus) ||
    getTranslationForKey('koulutus.ei-laajuutta')
  );
}

export function getLocalizedToteutusLaajuus(toteutus, koulutus) {
  const toteutusLaajuusNumero = toteutus?.metadata?.opintojenLaajuusNumero;
  const toteutusLaajuusyksikko = localize(toteutus?.metadata?.opintojenLaajuusyksikko);
  if (toteutusLaajuusNumero && toteutusLaajuusyksikko) {
    return `${toteutusLaajuusNumero} ${toteutusLaajuusyksikko}`;
  } else {
    return (
      getLocalizedKoulutusOpintojenLaajuus(koulutus) ||
      getTranslationForKey('koulutus.ei-laajuutta')
    );
  }
}

export function byLocaleCompare(prop) {
  return function (a, b) {
    return a[prop].toString().localeCompare(b[prop], getLanguage());
  };
}

export const condArray = (cond, item) => (cond ? [item] : []);

export const formatDouble = (number, fixed) =>
  (fixed === undefined ? number : number?.toFixed(fixed))?.toString().replace('.', ',');

export const isCypress = process.env.REACT_APP_CYPRESS;

export const getPaginationPage = ({ offset, size }) =>
  1 + (size ? Math.round(offset / size) : 0);
