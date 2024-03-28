import { Koodi } from '#/src/types/common';

import { localizeLukiolinja, localizeOsoite } from './localization';

describe('localization', () => {
  test.each([
    [
      { fi: 'Opintopolku 1' },
      { fi: { koodiUri: 'posti_00000#1', nimi: 'Helsinki' } },
      'Opintopolku 1, 00000 Helsinki',
    ],
    [undefined, undefined, ''],
    [{ fi: 'Opintopolku 1' }, undefined, ''],
    [undefined, { fi: { koodiUri: 'posti_00000#1', nimi: 'Helsinki' } }, ''],
  ])('localizeOsoite', (osoite, postinumero, fullAddress) => {
    expect(localizeOsoite(osoite, postinumero)).toEqual(fullAddress);
  });

  test.each([
    [{ nimi: { fi: 'Lukion kuvataidelinja' } }, 'Lukion kuvataidelinja'],
    [
      { nimi: { fi: 'Lukion kuvataidelinja (erityinen koulutustehtävä)' } },
      'Lukion kuvataidelinja',
    ],
    [{}, undefined],
  ])('localizeLukiolinja', (koodi, lukiolinjaTitle) => {
    expect(localizeLukiolinja(koodi as Koodi)).toEqual(lukiolinjaTitle);
  });
});
