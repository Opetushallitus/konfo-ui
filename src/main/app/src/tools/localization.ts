import _fp from 'lodash/fp';

import { Koodi, Translateable } from '#/src/types/common';
import { Maksullisuustyyppi } from '#/src/types/ToteutusTypes';

import i18n from './i18n';
import { koodiUriToPostinumero } from './utils';

const lng = (nimi: any, lang: 'fi' | 'en' | 'sv') =>
  nimi?.['kieli_' + lang] || nimi?.[lang] || false;

export const getLanguage = () => i18n.language;
export const hostUrlWithLangCode = `/konfo/${getLanguage()}}`;
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
  obj ? (_fp.isString(obj.nimi) ? obj.nimi : translate(obj.nimi || obj)) : '';

export const localizeArrayToCommaSeparated = (
  arr: Array<Koodi | Translateable>,
  { sorted }: { sorted?: boolean } = { sorted: false }
) =>
  _fp.flow(
    _fp.map(_fp.flow(localize, _fp.trim)),
    _fp.filter(_fp.negate(_fp.isEmpty)),
    (v) => (sorted ? _fp.sortBy(_fp.identity)(v) : v),
    _fp.uniq,
    _fp.join(', '),
    (v) => (_fp.isEmpty(v) ? '' : v)
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
  ['maksullinen', 'lukuvuosimaksu'].includes(maksullisuustyyppi)
    ? `${
        maksullisuustyyppi === 'lukuvuosimaksu'
          ? getTranslationForKey('toteutus.lukuvuosimaksu') + ' '
          : ''
      }${maksuAmount} € 
      `
    : getTranslationForKey('toteutus.maksuton');

export const localizeLukiolinja = (koodi: Koodi) =>
  localize(koodi)?.match(/^(.+?)(\s+\(.+\))?\s*$/)?.[1];
