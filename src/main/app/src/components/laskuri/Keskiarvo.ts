import _ from 'lodash';

import { Kouluaineet, Kouluaine } from './aine/Kouluaine';
import { LocalStorable } from './LocalStorageUtil';

const MAXIMUM_SCORE_KAIKKI = 16;
const MAXIMUM_SCORE_TAITO = 8;
const ARVOSANAN_MINIMI = 4;
const ARVOSANA_PISTE_MAKSIMI = 6;
const ARVOSANAN_MAKSIMI = 10;
const PAINOKERROIN_MINIMI = 1;
const PAINOKERROIN_MAKSIMI = 5;
const AMOUNT_OF_TAITOAINE_TO_USE = 3;
export interface Keskiarvot extends LocalStorable {
  lukuaineet: string;
  taideTaitoAineet: string;
  kaikki: string;
}

export interface HakupisteLaskelma extends LocalStorable {
  keskiarvo: number;
  pisteet: number;
}

const isEligibleArvosana = (arvosana: number | null): boolean => {
  return (
    arvosana !== null &&
    Number.isInteger(arvosana) &&
    arvosana >= ARVOSANAN_MINIMI &&
    arvosana <= ARVOSANAN_MAKSIMI
  );
};

const isEligiblePainokerroin = (painokerroin: string): boolean => {
  return (
    _.isNumber(painokerroin) &&
    Number(painokerroin) >= PAINOKERROIN_MINIMI &&
    Number(painokerroin) <= PAINOKERROIN_MAKSIMI
  );
};

const kouluAineToAverage = (aine: Kouluaine): number => {
  const eligibleValinnaiset = aine.valinnaisetArvosanat.filter(isEligibleArvosana);
  return eligibleValinnaiset.length < 1
    ? Number(aine.arvosana)
    : (Number(aine.arvosana) + _.sum(eligibleValinnaiset) / eligibleValinnaiset.length) /
        2;
};

export const kouluaineetToHakupiste = (kouluaineet: Kouluaineet): HakupisteLaskelma => {
  const lukuaineet: Array<number> = kouluaineet.kielet
    .concat(kouluaineet.lisakielet)
    .concat(kouluaineet.muutLukuaineet)
    .concat(
      kouluaineet.taitoaineet.filter((aine: Kouluaine) =>
        isEligiblePainokerroin(aine.painokerroin)
      )
    )
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(
      (aine: Kouluaine) =>
        Number(aine.arvosana) *
        (isEligiblePainokerroin(aine.painokerroin) ? Number(aine.painokerroin) : 1)
    );
  const lukuKa = _.sum(lukuaineet) / lukuaineet.length;
  const kaikki = kouluaineet.kielet
    .concat(kouluaineet.lisakielet)
    .concat(kouluaineet.muutLukuaineet)
    .concat(kouluaineet.taitoaineet)
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage);
  const kaikkiKa = _.sum(kaikki) / kaikki.length;
  const taitoaineet = kouluaineet.taitoaineet
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage)
    .sort((a: number, b: number) => b - a)
    .slice(0, AMOUNT_OF_TAITOAINE_TO_USE);
  const taitoKa = _.sum(taitoaineet) / taitoaineet.length;
  return keskiArvotToHakupiste({
    lukuaineet: String(lukuKa),
    taideTaitoAineet: String(taitoKa),
    kaikki: String(kaikkiKa),
  });
};

export const keskiArvotToHakupiste = (keskiarvot: Keskiarvot): HakupisteLaskelma => {
  const laskePiste = (keskiarvo: number, kerroin: number): number => {
    const lasketutPisteet = Math.round(
      ((keskiarvo - ARVOSANAN_MINIMI) / ARVOSANA_PISTE_MAKSIMI) * kerroin
    );
    return Math.max(1, lasketutPisteet);
  };
  const pisteetKaikki = laskePiste(
    Number(keskiarvot.kaikki.replace(',', '.')),
    MAXIMUM_SCORE_KAIKKI
  );
  const pisteetLukuaineet = laskePiste(
    Number(keskiarvot.taideTaitoAineet.replace(',', '.')),
    MAXIMUM_SCORE_TAITO
  );
  return {
    keskiarvo: Number(keskiarvot.lukuaineet.replace(',', '.')),
    pisteet: pisteetKaikki + pisteetLukuaineet,
  };
};
