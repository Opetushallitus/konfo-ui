import { PainotettuArvosana } from '#/src/types/HakukohdeTypes';

import {
  Kieliaine,
  kopioiKouluaineetPainokertoimilla,
  hasInitialValues,
  createKouluaine,
  isKieliaine,
  Kouluaineet,
  createKieliaine,
} from './Kouluaine';

describe('Kouluaine', () => {
  it('Kouluaineet structure', () => {
    const aineet = new Kouluaineet();
    expect(aineet.kielet.length).toEqual(3);
    expect(aineet.lisakielet.length).toEqual(0);
    expect(aineet.muutLukuaineet.length).toEqual(9);
    expect(aineet.taitoaineet.length).toEqual(5);
  });

  it('has initial values', () => {
    const aine = createKouluaine('Matematiikka', 'koodiuri');
    expect(hasInitialValues(aine)).toBeTruthy();
  });

  it('modified aine does not have initial values', () => {
    const aine = createKouluaine('Biologia', 'koodiuri');
    expect(hasInitialValues(aine)).toBeTruthy();
    aine.arvosana = 8;
    expect(hasInitialValues(aine)).toBeFalsy();
  });

  describe('Kieliaine', () => {
    const createPainotettuArvosana = (
      uri: string,
      painokerroin: number = 2
    ): PainotettuArvosana => {
      return {
        painokerroin,
        koodit: {
          oppiaine: { koodiUri: uri, nimi: {} },
          kieli: { koodiUri: '', nimi: {} },
        },
      };
    };

    it('Kouluaineet has two languages besides mother language', () => {
      const kielet = new Kouluaineet().kielet;
      expect(kielet[0].nimi).toEqual('kouluaineet.aidinkieli');
      expect(kielet[1].nimi).toEqual('kouluaineet.a1-kieli');
      expect(kielet[2].nimi).toEqual('kouluaineet.b1-kieli');
      expect(isKieliaine(kielet[0])).toBeFalsy();
      expect(isKieliaine(kielet[1])).toBeTruthy();
      expect(isKieliaine(kielet[2])).toBeTruthy();
    });

    it('Correctly sets painoarvo to copied kouluaineet', () => {
      const painoarvot: Array<PainotettuArvosana> = [
        createPainotettuArvosana('painotettavatoppiaineetlukiossa_mu'),
        createPainotettuArvosana('painotettavatoppiaineetlukiossa_ma', 4),
        createPainotettuArvosana('painotettavatoppiaineetlukiossa_ke', 3),
      ];
      let aineet = new Kouluaineet();
      aineet = kopioiKouluaineetPainokertoimilla(aineet, painoarvot);
      expect(aineet.taitoaineet[0].painokerroin).toEqual('2');
      expect(aineet.muutLukuaineet[0].painokerroin).toEqual('4');
      expect(aineet.muutLukuaineet[4].painokerroin).toEqual('3');
      expect(aineet.muutLukuaineet[3].painokerroin).toEqual('');
      expect(aineet.kielet[0].painokerroin).toEqual('');
    });

    it('Correctly sets painoarvo to kielet on copied kouluaineet', () => {
      const painoarvot: Array<PainotettuArvosana> = [
        createPainotettuArvosana('painotettavatoppiaineetlukiossa_a1en'),
        createPainotettuArvosana('painotettavatoppiaineetlukiossa_b2de', 4),
      ];
      let aineet = new Kouluaineet();
      aineet.lisakielet.push(
        createKieliaine('kouluaineet.a1-kieli', 'painotettavatoppiaineetlukiossa_a1', '')
      );
      aineet.lisakielet.push(
        createKieliaine('kouluaineet.a2-kieli', 'painotettavatoppiaineetlukiossa_a2', '')
      );
      aineet.lisakielet.push(
        createKieliaine('kouluaineet.b2-kieli', 'painotettavatoppiaineetlukiossa_b2', '')
      );
      (aineet.lisakielet[0] as Kieliaine).kieliKoodi = 'kielivalikoima_en';
      (aineet.lisakielet[1] as Kieliaine).kieliKoodi = 'kielivalikoima_en';
      (aineet.lisakielet[2] as Kieliaine).kieliKoodi = 'kielivalikoima_de';
      aineet = kopioiKouluaineetPainokertoimilla(aineet, painoarvot);
      expect(aineet.lisakielet[0].painokerroin).toEqual('2');
      expect(aineet.lisakielet[1].painokerroin).toEqual('');
      expect(aineet.lisakielet[2].painokerroin).toEqual('4');
    });
  });
});
