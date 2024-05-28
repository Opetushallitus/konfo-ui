import { TFunction } from 'i18next';
import { capitalize } from 'lodash';

import {
  getSearchAddress,
  getLocalizedOpintojenLaajuus,
  createKuvausListElement,
  createOsaamismerkinKuvausHtml,
} from './utils';
import { NDASH, OSAAMISMERKKI_JULKAISUTILA } from '../constants';
import { OsaamismerkkikuvausEntity } from '../types/common';

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

const mockedT = (key: string) => {
  const match = key.match(/\w+$/i);
  return capitalize(match ? match[0] : '');
};

describe('createKuvausListElement', () => {
  test('should create Osaamistavoitteet list with two list items and a heading', () => {
    const osaamistavoitteet = [
      {
        id: 9203079,
        osaamistavoite: {
          _id: '9204272',
          _tunniste: 'e70ddbae-f062-43c8-86c1-f0b2e9a63334',
          fi: 'osaa tuottaa yksinkertaista digitaalista materiaalia vastuullisesti',
          sv: 'kan producera enkelt digitalt material på ett ansvarsfullt sätt',
        },
      },
      {
        id: 9203210,
        osaamistavoite: {
          _id: '9204273',
          _tunniste: 'c1606492-79a7-44c5-9358-e3890345ce57',
          fi: 'osaa jakaa digitaalista sisältöä',
          sv: 'kan dela digitalt innehåll',
        },
      },
    ];

    expect(
      createKuvausListElement(
        osaamistavoitteet,
        'osaamistavoitteet',
        'osaamistavoite',
        mockedT as TFunction
      )
    ).toEqual(
      '<h3>Osaamistavoitteet</h3><ul><li>osaa tuottaa yksinkertaista digitaalista materiaalia vastuullisesti</li><li>osaa jakaa digitaalista sisältöä</li></ul>'
    );
  });

  test('should create Arviointikriteerit list with one list item and a heading', () => {
    const arviointikriteerit = [
      {
        id: 9203207,
        arviointikriteeri: {
          _id: '9204292',
          _tunniste: '5f3884a4-353a-4d5b-95cf-163ba318f8e5',
          fi: 'luettelee yleisimpiä tietoturvariskejä',
          sv: 'räknar upp de vanligaste datasäkerhetsriskerna',
        },
      },
      {
        id: 9203208,
        arviointikriteeri: {
          _id: '9204293',
          _tunniste: '6f8934cf-a0c1-468d-ab1b-64333c1e7d91',
          fi: 'nimeää eri tunnistautumistapojen eroja ja niiden tietoturvatasoja',
          sv: 'ger exempel på skillnaderna mellan olika autentiseringsmetoder och deras datasäkerhetsnivå',
        },
      },
    ];

    expect(
      createKuvausListElement(
        arviointikriteerit,
        'arviointikriteerit',
        'arviointikriteeri',
        mockedT as TFunction
      )
    ).toEqual(
      '<h3>Arviointikriteerit</h3><ul><li>luettelee yleisimpiä tietoturvariskejä</li><li>nimeää eri tunnistautumistapojen eroja ja niiden tietoturvatasoja</li></ul>'
    );
  });

  test('should return empty string as arviontikriteerit list is empty', () => {
    const arviointikriteerit: Array<OsaamismerkkikuvausEntity> = [];

    expect(
      createKuvausListElement(
        arviointikriteerit,
        'arviointikriteerit',
        'arviointikriteeri',
        mockedT as TFunction
      )
    ).toEqual('');
  });
});

describe('createOsaamismerkinKuvausHtml', () => {
  test('should return osaamistavoitteet with heading and a list of one tavoite', () => {
    const osaamismerkki = {
      id: 9203133,
      nimi: {
        _id: '9204271',
        _tunniste: '482bc079-3c3b-4a90-b492-1a03429bfdb5',
        fi: 'Digitaalinen sisältö',
        sv: 'Digitalt innehåll',
      },
      tila: OSAAMISMERKKI_JULKAISUTILA.JULKAISTU,
      kategoria: {
        id: 9202623,
        nimi: {
          _id: '9202528',
          _tunniste: '6d20f392-f411-4e85-9d00-559411a6e4d7',
          fi: 'Digitaidot',
          sv: 'Digital kompetens',
        },
        kuvaus: null,
        muokattu: 1707992127262,
        liite: {
          id: 'ff78de54-0090-484f-87ce-802ea6c70156',
          nimi: 'digitaidot_eitekstia.png',
          mime: 'image/png',
          binarydata: 'iVBORw0KGg',
        },
      },
      koodiUri: 'osaamismerkit_1024',
      osaamistavoitteet: [
        {
          id: 9203079,
          osaamistavoite: {
            _id: '9204272',
            _tunniste: 'e70ddbae-f062-43c8-86c1-f0b2e9a63334',
            fi: 'osaa tuottaa yksinkertaista digitaalista materiaalia vastuullisesti',
            sv: 'kan producera enkelt digitalt material på ett ansvarsfullt sätt',
          },
        },
      ],
      arviointikriteerit: [],
      voimassaoloAlkaa: 1704060000000,
      voimassaoloLoppuu: null,
      muokattu: 1706787411330,
      muokkaaja: '1.2.246.562.24.16945731101',
    };

    expect(createOsaamismerkinKuvausHtml(mockedT as TFunction, osaamismerkki)).toEqual(
      '<h3>Osaamistavoitteet</h3><ul><li>osaa tuottaa yksinkertaista digitaalista materiaalia vastuullisesti</li></ul>'
    );
  });

  test('should return arviointikriteerit with heading and a list of two kriteerit', () => {
    const osaamismerkki = {
      id: 9203135,
      nimi: {
        _id: '9204297',
        _tunniste: '5596ec44-7305-44a4-a10e-f2cb2f04182e',
        fi: 'Digitaalinen turvallisuus',
        sv: 'Digital säkerhet',
      },
      kuvaus: null,
      tila: OSAAMISMERKKI_JULKAISUTILA.JULKAISTU,
      kategoria: {
        id: 9202623,
        nimi: {
          _id: '9202528',
          _tunniste: '6d20f392-f411-4e85-9d00-559411a6e4d7',
          fi: 'Digitaidot',
          sv: 'Digital kompetens',
        },
        kuvaus: null,
        liite: {
          id: 'ff78de54-0090-484f-87ce-802ea6c70156',
          nimi: 'digitaidot_eitekstia.png',
          mime: 'image/png',
          binarydata: 'iVBORw0KGgoAAA',
        },
        muokattu: 1707992127262,
      },
      koodiUri: 'osaamismerkit_1026',
      osaamistavoitteet: [],
      arviointikriteerit: [
        {
          id: 9203207,
          arviointikriteeri: {
            _id: '9204292',
            _tunniste: '5f3884a4-353a-4d5b-95cf-163ba318f8e5',
            fi: 'luettelee yleisimpiä tietoturvariskejä',
            sv: 'räknar upp de vanligaste datasäkerhetsriskerna',
          },
        },
        {
          id: 9203208,
          arviointikriteeri: {
            _id: '9204293',
            _tunniste: '6f8934cf-a0c1-468d-ab1b-64333c1e7d91',
            fi: 'nimeää eri tunnistautumistapojen eroja ja niiden tietoturvatasoja',
            sv: 'ger exempel på skillnaderna mellan olika autentiseringsmetoder och deras datasäkerhetsnivå',
          },
        },
      ],
      voimassaoloAlkaa: 1704060000000,
      voimassaoloLoppuu: null,
      muokattu: 1707992127262,
      muokkaaja: '1.2.246.562.24.16945731101',
    };

    expect(createOsaamismerkinKuvausHtml(mockedT as TFunction, osaamismerkki)).toEqual(
      '<h3>Arviointikriteerit</h3><ul><li>luettelee yleisimpiä tietoturvariskejä</li><li>nimeää eri tunnistautumistapojen eroja ja niiden tietoturvatasoja</li></ul>'
    );
  });

  test('should return empty string when osaamismerkki is not defined', () => {
    expect(createOsaamismerkinKuvausHtml(mockedT as TFunction, undefined)).toEqual('');
  });
});
