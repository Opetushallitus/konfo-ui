import { Kouluaine, Kouluaineet } from './aine/Kouluaine';
import { Keskiarvot, keskiArvotToHakupiste, kouluaineetToHakupiste } from './Keskiarvo';

describe('Keskiarvo & Hakupisteet', () => {
  describe('calculates hakupisteet from keskiarvot', () => {
    const ka = (luku: number, kaikki: number, taito: number): Keskiarvot => {
      return {
        lukuaineet: String(luku),
        kaikki: String(kaikki),
        taideTaitoAineet: String(taito),
      };
    };

    const convertAndVerify = (
      keskiarvot: Keskiarvot,
      expectedPisteet: number,
      expectedKeskiarvo: number
    ) => {
      const laskelma = keskiArvotToHakupiste(keskiarvot);
      expect(laskelma.keskiarvo).toEqual(expectedKeskiarvo);
      expect(laskelma.pisteet).toEqual(expectedPisteet);
    };

    const convertAndVerifyPisteet = (keskiarvot: Keskiarvot, expectedPisteet: number) => {
      convertAndVerify(keskiarvot, expectedPisteet, Number(keskiarvot.lukuaineet));
    };

    it('correctly converts keskiarvot minimum to hakupistelaskelma', async () => {
      convertAndVerify(ka(4, 4, 4), 6, 4);
    });

    it('correctly converts keskiarvot maximum to hakupistelaskelma', async () => {
      convertAndVerify(ka(10, 10, 10), 30, 10);
      convertAndVerify(ka(8.44, 10, 10), 30, 8.44);
    });

    it('lukuaineet keskiarvo is not used for point calculations', async () => {
      convertAndVerify(ka(8.59, 4, 4), 6, 8.59);
      convertAndVerify(ka(8.44, 10, 10), 30, 8.44);
    });

    it('calculates score correctly when having minimum kaikki and various taito', async () => {
      convertAndVerifyPisteet(ka(8.44, 4, 10), 14);
      convertAndVerifyPisteet(ka(8.44, 4, 9.5), 14);
      convertAndVerifyPisteet(ka(8.44, 4, 9), 13);
      convertAndVerifyPisteet(ka(8.44, 4, 8.5), 12);
      convertAndVerifyPisteet(ka(8.44, 4, 8), 11);
      convertAndVerifyPisteet(ka(8.44, 4, 7.5), 10);
      convertAndVerifyPisteet(ka(8.44, 4, 7), 9);
      convertAndVerifyPisteet(ka(8.44, 4, 6.5), 8);
      convertAndVerifyPisteet(ka(8.44, 4, 6), 7);
      convertAndVerifyPisteet(ka(8.44, 4, 5.5), 6);
      convertAndVerifyPisteet(ka(8.44, 4, 5), 6);
      convertAndVerifyPisteet(ka(8.44, 4, 4.5), 6);
      convertAndVerifyPisteet(ka(8.44, 4, 4), 6);
    });

    it('calculates score correctly when having maximum kaikki and various taito', async () => {
      convertAndVerifyPisteet(ka(8.44, 10, 10), 30);
      convertAndVerifyPisteet(ka(8.44, 10, 9.5), 30);
      convertAndVerifyPisteet(ka(8.44, 10, 9), 29);
      convertAndVerifyPisteet(ka(8.44, 10, 8.5), 28);
      convertAndVerifyPisteet(ka(8.44, 10, 8), 27);
      convertAndVerifyPisteet(ka(8.44, 10, 7.5), 26);
      convertAndVerifyPisteet(ka(8.44, 10, 7), 25);
      convertAndVerifyPisteet(ka(8.44, 10, 6.5), 24);
      convertAndVerifyPisteet(ka(8.44, 10, 6), 23);
      convertAndVerifyPisteet(ka(8.44, 10, 5.5), 22);
      convertAndVerifyPisteet(ka(8.44, 10, 5), 22);
      convertAndVerifyPisteet(ka(8.44, 10, 4.5), 22);
      convertAndVerifyPisteet(ka(8.44, 10, 4), 22);
    });

    it('calculates score correctly when having minimum taito and various kaikki', async () => {
      convertAndVerifyPisteet(ka(8.44, 10, 4), 22);
      convertAndVerifyPisteet(ka(8.44, 9.5, 4), 22);
      convertAndVerifyPisteet(ka(8.44, 9, 4), 21);
      convertAndVerifyPisteet(ka(8.44, 8.5, 4), 19);
      convertAndVerifyPisteet(ka(8.44, 8, 4), 17);
      convertAndVerifyPisteet(ka(8.44, 7.5, 4), 15);
      convertAndVerifyPisteet(ka(8.44, 7, 4), 13);
      convertAndVerifyPisteet(ka(8.44, 6.5, 4), 11);
      convertAndVerifyPisteet(ka(8.44, 6, 4), 9);
      convertAndVerifyPisteet(ka(8.44, 5.5, 4), 7);
      convertAndVerifyPisteet(ka(8.44, 5, 4), 6);
      convertAndVerifyPisteet(ka(8.44, 4.5, 4), 6);
      convertAndVerifyPisteet(ka(8.44, 4, 4), 6);
    });

    it('calculates score correctly when having maximum taito and various kaikki', async () => {
      convertAndVerifyPisteet(ka(8.44, 10, 10), 30);
      convertAndVerifyPisteet(ka(8.44, 9.5, 10), 30);
      convertAndVerifyPisteet(ka(8.44, 9, 10), 29);
      convertAndVerifyPisteet(ka(8.44, 8.5, 10), 27);
      convertAndVerifyPisteet(ka(8.44, 8, 10), 25);
      convertAndVerifyPisteet(ka(8.44, 7.5, 10), 23);
      convertAndVerifyPisteet(ka(8.44, 7, 10), 21);
      convertAndVerifyPisteet(ka(8.44, 6.5, 10), 19);
      convertAndVerifyPisteet(ka(8.44, 6, 10), 17);
      convertAndVerifyPisteet(ka(8.44, 5.5, 10), 15);
      convertAndVerifyPisteet(ka(8.44, 5, 10), 14);
      convertAndVerifyPisteet(ka(8.44, 4.5, 10), 14);
      convertAndVerifyPisteet(ka(8.44, 4, 10), 14);
    });

    it('calculates score correctly various', async () => {
      convertAndVerifyPisteet(ka(10, 8.24, 7.95), 21);
      convertAndVerifyPisteet(ka(10, 4.24, 4.95), 6);
      convertAndVerifyPisteet(ka(10, 4.95, 4.24), 6);
      convertAndVerifyPisteet(ka(10, 5.24, 5.82), 6);
      convertAndVerifyPisteet(ka(10, 7.26, 8.49), 19);
      convertAndVerifyPisteet(ka(10, 7.11, 8.99), 19);
      convertAndVerifyPisteet(ka(10, 8.99, 7.05), 23);
    });
  });

  describe('calculates hakupisteet from kouluaineet', () => {
    const aineet = (
      aine: Kouluaine,
      avain: string,
      id: number,
      kouluaineet: Kouluaineet = new Kouluaineet()
    ): Kouluaineet => {
      kouluaineet[avain as keyof Kouluaineet][id] = aine;
      return kouluaineet;
    };

    const aine = (
      arvosana: number,
      valinnaiset: Array<number>,
      painokerroin: string
    ): Kouluaine => {
      return {
        nimi: '',
        arvosana,
        valinnaisetArvosanat: valinnaiset,
        painokerroin,
        description: '',
      };
    };

    const convertAndVerify = (
      kouluaineet: Kouluaineet,
      expectedPisteet: number,
      expectedKeskiarvo: number
    ) => {
      const laskelma = kouluaineetToHakupiste(kouluaineet);
      expect(laskelma.keskiarvo).toEqual(expectedKeskiarvo);
      expect(laskelma.pisteet).toEqual(expectedPisteet);
    };

    it('calculates pisteet using single kouluaine', () => {
      convertAndVerify(aineet(aine(10, [], ''), 'kielet', 0), 22, 10);
      convertAndVerify(aineet(aine(4, [], ''), 'muutLukuaineet', 0), 6, 4);
      convertAndVerify(aineet(aine(8, [], ''), 'muutLukuaineet', 2), 17, 8);
      convertAndVerify(aineet(aine(7, [], ''), 'taitoaineet', 0), 16, NaN);
    });

    it('calculates pisteet using single kouluaine with valinnaiset', () => {
      convertAndVerify(aineet(aine(10, [10, 10], ''), 'kielet', 0), 22, 10);
      convertAndVerify(aineet(aine(4, [4, 4], ''), 'kielet', 0), 6, 4);
      convertAndVerify(aineet(aine(10, [5], ''), 'kielet', 0), 15, 10);
      convertAndVerify(aineet(aine(10, [6, 4], ''), 'kielet', 0), 15, 10);
      convertAndVerify(aineet(aine(6, [10, 10], ''), 'kielet', 0), 17, 6);
      convertAndVerify(aineet(aine(6, [4, 4], ''), 'kielet', 0), 6, 6);
      convertAndVerify(aineet(aine(9, [5, 10], ''), 'kielet', 0), 18, 9);
      convertAndVerify(aineet(aine(9, [9, 6], ''), 'kielet', 0), 18, 9);
      convertAndVerify(aineet(aine(8, [9, 6], ''), 'kielet', 0), 16, 8);
    });

    it('calculates pisteet using single kouluaine with painokerroin', () => {
      convertAndVerify(aineet(aine(10, [], '2'), 'kielet', 0), 22, 10);
      convertAndVerify(aineet(aine(10, [], '5'), 'kielet', 0), 22, 10);
      convertAndVerify(aineet(aine(6, [], '2.5'), 'kielet', 0), 9, 6);
    });
  });
});
