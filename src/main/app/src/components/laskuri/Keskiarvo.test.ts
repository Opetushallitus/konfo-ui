import { Keskiarvot, keskiArvotToHakupiste } from './Keskiarvo';

describe('keskiArvotToHakupiste', () => {
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
    convertAndVerify(ka(4, 4, 4), 2, 4);
  });

  it('correctly converts keskiarvot maximum to hakupistelaskelma', async () => {
    convertAndVerify(ka(10, 10, 10), 24, 10);
    convertAndVerify(ka(8.44, 10, 10), 24, 8.44);
  });

  it('lukuaineet keskiarvo is not used for point calculations', async () => {
    convertAndVerify(ka(8.59, 4, 4), 2, 8.59);
    convertAndVerify(ka(8.44, 10, 10), 24, 8.44);
  });

  it('calculates score correctly when having minimum kaikki and various taito', async () => {
    convertAndVerifyPisteet(ka(8.44, 4, 10), 9);
    convertAndVerifyPisteet(ka(8.44, 4, 9.5), 8);
    convertAndVerifyPisteet(ka(8.44, 4, 9), 8);
    convertAndVerifyPisteet(ka(8.44, 4, 8.5), 7);
    convertAndVerifyPisteet(ka(8.44, 4, 8), 6);
    convertAndVerifyPisteet(ka(8.44, 4, 7.5), 6);
    convertAndVerifyPisteet(ka(8.44, 4, 7), 5);
    convertAndVerifyPisteet(ka(8.44, 4, 6.5), 4);
    convertAndVerifyPisteet(ka(8.44, 4, 6), 4);
    convertAndVerifyPisteet(ka(8.44, 4, 5.5), 3);
    convertAndVerifyPisteet(ka(8.44, 4, 5), 2);
    convertAndVerifyPisteet(ka(8.44, 4, 4.5), 2);
    convertAndVerifyPisteet(ka(8.44, 4, 4), 2);
  });

  it('calculates score correctly when having maximum kaikki and various taito', async () => {
    convertAndVerifyPisteet(ka(8.44, 10, 10), 24);
    convertAndVerifyPisteet(ka(8.44, 10, 9.5), 23);
    convertAndVerifyPisteet(ka(8.44, 10, 9), 23);
    convertAndVerifyPisteet(ka(8.44, 10, 8.5), 22);
    convertAndVerifyPisteet(ka(8.44, 10, 8), 21);
    convertAndVerifyPisteet(ka(8.44, 10, 7.5), 21);
    convertAndVerifyPisteet(ka(8.44, 10, 7), 20);
    convertAndVerifyPisteet(ka(8.44, 10, 6.5), 19);
    convertAndVerifyPisteet(ka(8.44, 10, 6), 19);
    convertAndVerifyPisteet(ka(8.44, 10, 5.5), 18);
    convertAndVerifyPisteet(ka(8.44, 10, 5), 17);
    convertAndVerifyPisteet(ka(8.44, 10, 4.5), 17);
    convertAndVerifyPisteet(ka(8.44, 10, 4), 17);
  });

  it('calculates score correctly when having minimum taito and various kaikki', async () => {
    convertAndVerifyPisteet(ka(8.44, 10, 4), 17);
    convertAndVerifyPisteet(ka(8.44, 9.5, 4), 16);
    convertAndVerifyPisteet(ka(8.44, 9, 4), 14);
    convertAndVerifyPisteet(ka(8.44, 8.5, 4), 13);
    convertAndVerifyPisteet(ka(8.44, 8, 4), 12);
    convertAndVerifyPisteet(ka(8.44, 7.5, 4), 10);
    convertAndVerifyPisteet(ka(8.44, 7, 4), 9);
    convertAndVerifyPisteet(ka(8.44, 6.5, 4), 8);
    convertAndVerifyPisteet(ka(8.44, 6, 4), 6);
    convertAndVerifyPisteet(ka(8.44, 5.5, 4), 5);
    convertAndVerifyPisteet(ka(8.44, 5, 4), 4);
    convertAndVerifyPisteet(ka(8.44, 4.5, 4), 2);
    convertAndVerifyPisteet(ka(8.44, 4, 4), 2);
  });

  it('calculates score correctly when having maximum taito and various kaikki', async () => {
    convertAndVerifyPisteet(ka(8.44, 10, 10), 24);
    convertAndVerifyPisteet(ka(8.44, 9.5, 10), 23);
    convertAndVerifyPisteet(ka(8.44, 9, 10), 21);
    convertAndVerifyPisteet(ka(8.44, 8.5, 10), 20);
    convertAndVerifyPisteet(ka(8.44, 8, 10), 19);
    convertAndVerifyPisteet(ka(8.44, 7.5, 10), 17);
    convertAndVerifyPisteet(ka(8.44, 7, 10), 16);
    convertAndVerifyPisteet(ka(8.44, 6.5, 10), 15);
    convertAndVerifyPisteet(ka(8.44, 6, 10), 13);
    convertAndVerifyPisteet(ka(8.44, 5.5, 10), 12);
    convertAndVerifyPisteet(ka(8.44, 5, 10), 11);
    convertAndVerifyPisteet(ka(8.44, 4.5, 10), 9);
    convertAndVerifyPisteet(ka(8.44, 4, 10), 9);
  });

  it('calculates score correctly various', async () => {
    convertAndVerifyPisteet(ka(10, 8.24, 7.95), 16);
    convertAndVerifyPisteet(ka(10, 4.24, 4.95), 2);
    convertAndVerifyPisteet(ka(10, 4.95, 4.24), 4);
    convertAndVerifyPisteet(ka(10, 5.24, 5.82), 5);
    convertAndVerifyPisteet(ka(10, 7.11, 8.99), 15);
    convertAndVerifyPisteet(ka(10, 8.99, 7.05), 17);
  });
});
