import { isString, flow, map, filter, isEmpty, trim, uniq } from 'lodash';

import { MAKSULLISUUSTYYPPI } from '#/src/constants';
import { Koodi, Translateable } from '#/src/types/common';
import { Maksullisuustyyppi } from '#/src/types/ToteutusTypes';

import { i18n } from './i18n';
import { koodiUriToPostinumero } from './utils';

const lng = (nimi: any, lang: 'fi' | 'en' | 'sv') =>
  nimi?.['kieli_' + lang] || nimi?.[lang] || false;

export const getLanguage = () => i18n.language;
export const translate = (nimi: any) => {
  const language = getLanguage();
  if ('en' === language) {
    return lng(nimi, 'en') || lng(nimi, 'fi') || lng(nimi, 'sv') || '';
  } else if ('sv' === language) {
    return lng(nimi, 'sv') || lng(nimi, 'fi') || lng(nimi, 'en') || '';
  } else {
    return lng(nimi, 'fi') || lng(nimi, 'sv') || lng(nimi, 'en') || '';
  }
};

export const localize = (obj: any) => (obj ? translate(obj.nimi || obj) : '');

export const localizeIfNimiObject = (obj: any) =>
  obj ? (isString(obj.nimi) ? obj.nimi : translate(obj.nimi || obj)) : '';

export const localizeArrayToCommaSeparated = (
  arr: Array<Koodi | Translateable>,
  { sorted }: { sorted?: boolean } = { sorted: false }
) =>
  flow(
    (x) => map(x, flow(localize, trim)),
    (x) => filter(x, (item) => !isEmpty(item)),
    (x) => (sorted ? x.sort() : x),
    uniq,
    (x) => x?.join(', '),
    (v) => (isEmpty(v) ? '' : v)
  )(arr);

export const getTranslationForKey = (key = '') => i18n.t(key);

export const localizeOsoite = (
  katuosoite: unknown,
  postinumeroKoodi?: Koodi,
  erotin: string = ', '
) => {
  if (!katuosoite || !postinumeroKoodi) {
    return '';
  }
  const postitoimialue = `${erotin}${koodiUriToPostinumero(
    postinumeroKoodi?.koodiUri
  )} ${localize(postinumeroKoodi?.nimi)}`;
  return `${localize(katuosoite)}${postitoimialue}`;
};

export const getLocalizedMaksullisuus = (
  maksullisuustyyppi: Maksullisuustyyppi,
  maksuAmount: number
) =>
  [MAKSULLISUUSTYYPPI.MAKSULLINEN, MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU].includes(
    maksullisuustyyppi
  )
    ? `${
        maksullisuustyyppi === MAKSULLISUUSTYYPPI.LUKUVUOSIMAKSU
          ? getTranslationForKey('toteutus.lukuvuosimaksu') + ' '
          : ''
      }${maksuAmount} € 
      `
    : getTranslationForKey('toteutus.maksuton');

export const localizeLukiolinja = (koodi: Koodi) =>
  localize(koodi)?.match(/^(.+?)(\s+\(.+\))?\s*$/)?.[1];
