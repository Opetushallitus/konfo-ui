import { Hakukohde, PisteHistoria } from '#/src/types/HakukohdeTypes';

import {
  GraafiBoundary,
  containsOnlyTodistusvalinta,
  getUniquePistetyypit,
  graafiYearModifier,
} from './GraafiUtil';

describe('GraafiUtil', () => {
  const currentYear = new Date().getUTCFullYear();

  describe('graafiYearModifier', () => {
    it('modifier is 0 for max boundary if latest year given is last year', () => {
      expect(graafiYearModifier([currentYear - 1, 2018], GraafiBoundary.MAX)).toEqual(0);
    });

    it('modifier is -1 for min boundary if latest year given is last year', () => {
      expect(
        graafiYearModifier([2020, currentYear - 1, 2018], GraafiBoundary.MIN)
      ).toEqual(-1);
    });

    it('modifier is 1 for max boundary if latest year given is current year', () => {
      expect(graafiYearModifier([2019, currentYear, 2018], GraafiBoundary.MAX)).toEqual(
        1
      );
    });

    it('modifier is 0 for min boundary if latest year given is current year', () => {
      expect(graafiYearModifier([2020, currentYear, 2018], GraafiBoundary.MIN)).toEqual(
        0
      );
    });
  });

  const blankHakukohde: Hakukohde = {
    metadata: {
      pistehistoria: undefined,
    },
    aloituspaikat: {
      lukumaara: undefined,
      ensikertalaisille: undefined,
      kuvaus: undefined,
    },
    hakuajat: [],
    hakukohdeOid: '',
    hakuOid: '',
    hakulomakeAtaruId: '',
    hakulomakeKuvaus: {
      fi: undefined,
      sv: undefined,
      en: undefined,
    },
    hakulomakeLinkki: {
      fi: undefined,
      sv: undefined,
      en: undefined,
    },
    hakulomaketyyppi: '',
    isHakuAuki: false,
    jarjestyspaikka: {
      nimi: {
        fi: undefined,
        sv: undefined,
        en: undefined,
      },
      oid: '',
      paikkakunta: {
        koodiUri: '',
        nimi: {
          fi: undefined,
          sv: undefined,
          en: undefined,
        },
      },
      jarjestaaUrheilijanAmmKoulutusta: false,
    },
    koulutuksenAlkamiskausi: {
      alkamiskausityyppi: undefined,
      henkilokohtaisenSuunnitelmanLisatiedot: {
        fi: undefined,
        sv: undefined,
        en: undefined,
      },
      koulutuksenAlkamiskausi: {
        koodiUri: '',
        nimi: {
          fi: undefined,
          sv: undefined,
          en: undefined,
        },
      },
      koulutuksenAlkamisvuosi: '',
      formatoituKoulutuksenalkamispaivamaara: {
        fi: '',
        sv: '',
        en: '',
      },
      formatoituKoulutuksenpaattymispaivamaara: {
        fi: '',
        sv: '',
        en: '',
      },
    },
    nimi: {
      fi: undefined,
      sv: undefined,
      en: undefined,
    },
    pohjakoulutusvaatimus: [],
    pohjakoulutusvaatimusTarkenne: {
      fi: undefined,
      sv: undefined,
      en: undefined,
    },
    liitteet: [],
    liitteetOnkoSamaToimitusaika: false,
    liitteetOnkoSamaToimitusosoite: false,
    liitteidenToimitusaika: '',
    formatoituLiitteidentoimitusaika: {
      fi: '',
      sv: '',
      en: '',
    },
    liitteidenToimitustapa: '',
    liitteidenToimitusosoite: {
      osoite: {
        osoite: {
          fi: undefined,
          sv: undefined,
          en: undefined,
        },
        postinumero: {
          fi: {
            koodiUri: '',
            nimi: undefined,
          },
          sv: {
            koodiUri: '',
            nimi: undefined,
          },
          en: {
            koodiUri: '',
            nimi: undefined,
          },
        },
      },
      sahkoposti: '',
      puhelinnumero: '',
      verkkosivu: '',
    },
    hasValintaperustekuvausData: false,
  };

  const pistehistoriaTodistusvalinta = {
    pisteet: 6.17,
    vuosi: '2018',
    valintatapajonoTyyppi: {
      koodiUri: 'valintatapajono_tv',
      nimi: {
        sv: 'Provpoäng',
        en: 'Exam score',
        fi: 'Koepisteet',
      },
    },
  };
  const pistehistoriaWithTodistusvalinta2 = {
    pisteet: 7.2,
    vuosi: '2022',
    valintatapajonoTyyppi: {
      koodiUri: 'valintatapajono_tv',
      nimi: {
        sv: 'Provpoäng',
        en: 'Exam score',
        fi: 'Koepisteet',
      },
    },
  };

  const pistehistoriaYhteispisteet = {
    pisteet: 16.0,
    vuosi: '2023',
    valintatapajonoTyyppi: {
      koodiUri: 'valintatapajono_yp',
      nimi: {
        sv: 'Total poäng',
        en: 'Total score',
        fi: 'Yhteispisteet',
      },
    },
  };

  const pistehistoriaKoepisteet = {
    pisteet: 16.0,
    vuosi: '2019',
    valintatapajonoTyyppi: {
      koodiUri: 'valintatapajono_kp',
      nimi: {
        fi: 'Koepisteet',
        sv: 'Provpoäng',
        en: 'Exam score',
      },
    },
  };

  const pistehistoriaMuu = {
    pisteet: 16.0,
    vuosi: '2020',
    valintatapajonoTyyppi: {
      koodiUri: 'valintatapajono_m',
      nimi: {
        fi: 'Muu',
        sv: 'Annat',
        en: 'Other',
      },
    },
  };

  const pistehistoriaTuntematon: PisteHistoria = {
    pisteet: 15.0,
    vuosi: '2021',
    valintatapajonoTyyppi: null,
  };

  describe('containsOnlyTodistusvalinta', () => {
    it('returns true if there is only valintatapajono_tv', () => {
      expect(
        containsOnlyTodistusvalinta({
          ...blankHakukohde,
          metadata: {
            ...blankHakukohde.metadata,
            pistehistoria: [
              pistehistoriaTodistusvalinta,
              pistehistoriaWithTodistusvalinta2,
            ],
          },
        })
      ).toBeTruthy;
    });

    it('returns false if there is valintatapajono_tv and some other valintatapa', () => {
      const hakukohdeWithTodistusvalintaAndYhteispisteet = {
        ...blankHakukohde,
        metadata: {
          ...blankHakukohde.metadata,
          pistehistoria: [
            pistehistoriaTodistusvalinta,
            pistehistoriaWithTodistusvalinta2,
            pistehistoriaYhteispisteet,
          ],
        },
      };
      expect(containsOnlyTodistusvalinta(hakukohdeWithTodistusvalintaAndYhteispisteet))
        .toBeFalsy;
    });

    it('returns false if there is no valintatapajono_tv', () => {
      const hakukohdeWithKoepisteet = {
        ...blankHakukohde,
        metadata: {
          ...blankHakukohde.metadata,
          pistehistoria: [pistehistoriaKoepisteet],
        },
      };
      expect(containsOnlyTodistusvalinta(hakukohdeWithKoepisteet)).toBeFalsy;
    });
  });

  describe('getUniquePistetyypit', () => {
    it('returns only one of each type', () => {
      const pistehistoriaWithAllTypes: Array<PisteHistoria> = [
        pistehistoriaTodistusvalinta,
        pistehistoriaWithTodistusvalinta2,
        pistehistoriaKoepisteet,
        pistehistoriaYhteispisteet,
        pistehistoriaMuu,
      ];
      const pistetyypit = getUniquePistetyypit({
        ...blankHakukohde,
        metadata: {
          ...blankHakukohde.metadata,
          pistehistoria: pistehistoriaWithAllTypes,
        },
      });
      expect(pistehistoriaWithAllTypes.length).toEqual(5);
      expect(pistetyypit.length).toEqual(4);
    });
    it('counts null and "muu" as one unique unknown type', () => {
      const pistehistoriaAllTypesWithNull = [
        pistehistoriaTuntematon,
        pistehistoriaTodistusvalinta,
        pistehistoriaWithTodistusvalinta2,
        pistehistoriaKoepisteet,
        pistehistoriaYhteispisteet,
        pistehistoriaMuu,
      ];
      const pistetyypit = getUniquePistetyypit({
        ...blankHakukohde,
        metadata: {
          ...blankHakukohde.metadata,
          pistehistoria: pistehistoriaAllTypesWithNull,
        },
      });
      expect(pistehistoriaAllTypesWithNull.length).toEqual(6);
      expect(pistetyypit.length).toEqual(4);
    });
    it('counts only shown years', () => {
      const pistehistoriaSameTypesWithOlderDifferentType = [
        pistehistoriaYhteispisteet,
        { ...pistehistoriaYhteispisteet, vuosi: '2022' },
        { ...pistehistoriaYhteispisteet, vuosi: '2021' },
        { ...pistehistoriaYhteispisteet, vuosi: '2020' },
        { ...pistehistoriaYhteispisteet, vuosi: '2019' },
        pistehistoriaTodistusvalinta,
      ];
      const pistetyypit = getUniquePistetyypit({
        ...blankHakukohde,
        metadata: {
          ...blankHakukohde.metadata,
          pistehistoria: pistehistoriaSameTypesWithOlderDifferentType,
        },
      });
      expect(pistehistoriaSameTypesWithOlderDifferentType.length).toEqual(6);
      expect(pistetyypit.length).toEqual(1);
      expect(pistetyypit[0]).toEqual('valintatapajono_yp');
    });
  });
});
