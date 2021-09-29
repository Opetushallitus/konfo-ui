import { localizeLukiolinja, localizeOsoite } from './localization';

describe('localization', () => {
  test.each([
    [
      { fi: 'Opintopolku 1' },
      { koodiUri: 'posti_00000#1', nimi: { fi: 'Helsinki' } },
      'Opintopolku 1, 00000 Helsinki',
    ],
    [undefined, undefined, ''],
    [{ fi: 'Opintopolku 1' }, undefined, ''],
    [undefined, { koodiUri: 'posti_00000#1', nimi: { fi: 'Helsinki' } }, ''],
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
    expect(localizeLukiolinja(koodi)).toEqual(lukiolinjaTitle);
  });
});
