import { NDASH } from '../constants';
import { getSearchAddress, getLocalizedOpintojenLaajuus } from './utils';

describe('Utils/OsoiteParser', () => {
  test.each([
    ['PL 123', 'Pömpele', 'Pömpele'],
    ['PL 123, Tie 123', 'Pömpele', 'Pömpele Tie 123'],
    ['Tie 123, Loppuosa', 'Pömpele', 'Pömpele Tie 123'],
    ['PL 123, Tie 123, Loppuosa', 'Pömpele', 'Pömpele Tie 123'],
  ])('getSearchAddress.address', (osoite, postinumeroJaPaikka, expected) => {
    expect(getSearchAddress(postinumeroJaPaikka, osoite).address).toEqual(expected);
  });

  test.each([
    ['Tie 123', 'Pömpele', 'Pömpele Tie'],
    ['Tie', 'Pömpele', 'Pömpele Tie'],
  ])('getSearchAddress.addressNoNumbers', (osoite, postinumeroJaPaikka, expected) => {
    expect(getSearchAddress(postinumeroJaPaikka, osoite).addressNoNumbers).toEqual(
      expected
    );
  });
});

describe('Utils/getLocalizedOpintojenLaajuus', () => {
  test.each([
    [
      {
        metadata: {
          opintojenLaajuusNumero: 10,
          opintojenLaajuusyksikko: { nimi: { fi: 'opintopistettä' } },
        },
      },
      {},
      '10 opintopistettä',
    ],
    [
      {
        metadata: {
          opintojenLaajuusNumeroMin: 10,
          opintojenLaajuusNumeroMax: 20,
          opintojenLaajuusyksikko: { nimi: { fi: 'tuntia' } },
        },
      },
      {},
      `10${NDASH}20 tuntia`,
    ],
    [
      {
        metadata: {
          opintojenLaajuusNumeroMin: 10,
          opintojenLaajuusNumeroMax: 10,
          opintojenLaajuusyksikko: { nimi: { fi: 'vuotta' } },
        },
      },
      {},
      `10 vuotta`,
    ],
    [
      {
        metadata: {
          opintojenLaajuusNumeroMin: 10,
          opintojenLaajuusyksikko: { nimi: { fi: 'viikkoa' } },
        },
      },
      {},
      'undefined 10 viikkoa',
    ],
    [
      {
        metadata: {
          opintojenLaajuusNumeroMax: 10,
          opintojenLaajuusyksikko: { nimi: { fi: 'viikkoa' } },
        },
      },
      {},
      'undefined 10 viikkoa',
    ],
    [
      {
        metadata: {},
      },
      { opintojenLaajuusNumero: '20 osaamispistettä' },
      '20 osaamispistettä',
    ],
  ])('localized laajuus description', (toteutus, koulutus, expected) => {
    expect(getLocalizedOpintojenLaajuus(toteutus, koulutus)).toEqual(expected);
  });
});
