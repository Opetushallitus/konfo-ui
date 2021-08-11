import { format } from 'date-fns';
import _fp from 'lodash/fp';
import ReactHtmlParser from 'react-html-parser';
import stripTags from 'striptags';

import i18n from './i18n';
import { getTranslationForKey, localize } from './localization';

export const Common = {
  // Filters all untruthy values, we do not want false or 0 values sent
  cleanRequestParams: _fp.pickBy(_fp.identity),
};

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
      : getTranslationForKey('oppilaitos.ei-yhteystietoja');
  const sahkoposti = osoiteData.sahkoposti;
  const nimi = osoiteData.nimi;

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

export function formatDateString(dateString, dateFormat = 'd.M.y HH:mm') {
  if (!dateString) {
    return '';
  }

  const klo = i18n.t('lomake.klo');

  if (klo !== '') {
    dateFormat = "d.M.y 'klo' HH:mm";
  }

  return format(new Date(dateString), dateFormat);
}

export const formatDateRange = (start, end, dateFormat) =>
  `${formatDateString(start, dateFormat)} \u2013 ${
    end ? formatDateString(end, dateFormat) : ''
  }`;

const ALLOWED_HTML_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'sup',
  'sub',
  'strong',
  'strike',
  'ul',
];

export const sanitizeHTML = (html) => stripTags(html, ALLOWED_HTML_TAGS);

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

export function getLocalizedOpintojenLaajuus(koulutus) {
  const tutkinnonOsat = koulutus?.tutkinnonOsat || [];

  let opintojenLaajuusNumero =
    (koulutus?.opintojenLaajuus && localize(koulutus?.opintojenLaajuus)) ||
    koulutus?.opintojenLaajuusNumero ||
    (tutkinnonOsat && tutkinnonOsat.map((k) => k?.opintojenLaajuusNumero).join(' + '));

  if (_fp.isString(opintojenLaajuusNumero)) {
    opintojenLaajuusNumero = opintojenLaajuusNumero.split('+').map(_fp.trim).join(' + ');
  }

  const opintojenLaajuusYksikko =
    localize(
      koulutus?.opintojenLaajuusyksikko ||
        _fp.find('opintojenLaajuusyksikko', tutkinnonOsat)?.opintojenLaajuusyksikko
    ) || '';

  const opintojenLaajuus =
    opintojenLaajuusNumero &&
    opintojenLaajuusYksikko &&
    `${opintojenLaajuusNumero} ${opintojenLaajuusYksikko}`.trim();
  return opintojenLaajuus || getTranslationForKey('koulutus.ei-laajuutta');
}

export const condArray = (cond, item) => (cond ? [item] : []);

export const formatDouble = (number, fixed) =>
  (fixed !== undefined ? number?.toFixed(fixed) : number)?.toString().replace('.', ',');

export const isCypress = process.env.REACT_APP_CYPRESS;
