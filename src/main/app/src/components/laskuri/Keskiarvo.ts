import { LocalStorable } from './LocalStorageUtil';

const MAXIMUM_SCORE_KAIKKI = 16;
const MAXIMUM_SCORE_TAITO = 8;
const ARVOSANAN_MINIMI = 4;
const ARVOSANA_PISTE_MAKSIMI = 6;
export interface Keskiarvot extends LocalStorable {
  lukuaineet: string;
  taideTaitoAineet: string;
  kaikki: string;
}

export interface HakupisteLaskelma extends LocalStorable {
  keskiarvo: number;
  pisteet: number;
}

export const keskiArvotToHakupiste = (keskiarvot: Keskiarvot): HakupisteLaskelma => {
  const laskePiste = (keskiarvo: number, kerroin: number): number => {
    const lasketutPisteet = Math.round(
      ((keskiarvo - ARVOSANAN_MINIMI) / ARVOSANA_PISTE_MAKSIMI) * kerroin
    );
    return Math.max(1, lasketutPisteet);
  };
  const pisteetKaikki = laskePiste(
    Number.parseFloat(keskiarvot.kaikki),
    MAXIMUM_SCORE_KAIKKI
  );
  const pisteetLukuaineet = laskePiste(
    Number.parseFloat(keskiarvot.taideTaitoAineet),
    MAXIMUM_SCORE_TAITO
  );
  return {
    keskiarvo: Number.parseFloat(keskiarvot.lukuaineet),
    pisteet: pisteetKaikki + pisteetLukuaineet,
  };
};
