import _ from 'lodash';

import { Kouluaineet, Kouluaine } from './aine/Kouluaine';
import { LocalStorable } from './LocalStorageUtil';

const MAXIMUM_SCORE_KAIKKI = 16;
const MAXIMUM_SCORE_TAITO = 8;
const ARVOSANAN_MINIMI = 4;
const ARVOSANAN_MAKSIMI = 10;
const PAINOKERROIN_MINIMI = 1;
const PAINOKERROIN_MAKSIMI = 5;
const AMOUNT_OF_TAITOAINE_TO_USE = 3;
const COMPLETED_STUDIES_SCORE = 6;

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

const isInRangePredFn = (min: number, max: number): ((keskiarvo: number) => boolean) => {
  return (keskiarvo: number) => keskiarvo >= min && keskiarvo <= max;
};

type RangeToScore = {
  rangeFn: (keskiarvo: number) => boolean;
  score: number;
};

const PISTEET_KAIKKI_MAP: Array<RangeToScore> = [
  { rangeFn: isInRangePredFn(0.0, 5.49), score: 0 },
  { rangeFn: isInRangePredFn(5.5, 5.74), score: 1 },
  { rangeFn: isInRangePredFn(5.75, 5.99), score: 2 },
  { rangeFn: isInRangePredFn(6.0, 6.24), score: 3 },
  { rangeFn: isInRangePredFn(6.25, 6.49), score: 4 },
  { rangeFn: isInRangePredFn(6.5, 6.74), score: 5 },
  { rangeFn: isInRangePredFn(6.75, 6.99), score: 6 },
  { rangeFn: isInRangePredFn(7.0, 7.24), score: 7 },
  { rangeFn: isInRangePredFn(7.25, 7.49), score: 8 },
  { rangeFn: isInRangePredFn(7.5, 7.74), score: 9 },
  { rangeFn: isInRangePredFn(7.75, 7.99), score: 10 },
  { rangeFn: isInRangePredFn(8.0, 8.24), score: 11 },
  { rangeFn: isInRangePredFn(8.25, 8.49), score: 12 },
  { rangeFn: isInRangePredFn(8.5, 8.74), score: 13 },
  { rangeFn: isInRangePredFn(8.75, 8.99), score: 14 },
  { rangeFn: isInRangePredFn(9.0, 9.24), score: 15 },
  { rangeFn: isInRangePredFn(9.25, 10.0), score: MAXIMUM_SCORE_KAIKKI },
];

const PISTEET_TAITO_MAP: Array<RangeToScore> = [
  { rangeFn: isInRangePredFn(0.0, 5.99), score: 0 },
  { rangeFn: isInRangePredFn(6.0, 6.49), score: 1 },
  { rangeFn: isInRangePredFn(6.5, 6.99), score: 2 },
  { rangeFn: isInRangePredFn(7.0, 7.49), score: 3 },
  { rangeFn: isInRangePredFn(7.5, 7.99), score: 4 },
  { rangeFn: isInRangePredFn(8.0, 8.49), score: 5 },
  { rangeFn: isInRangePredFn(8.5, 8.99), score: 6 },
  { rangeFn: isInRangePredFn(9.0, 9.49), score: 7 },
  { rangeFn: isInRangePredFn(9.5, 10.0), score: MAXIMUM_SCORE_TAITO },
];

const getMatchingScore = (keskiarvo: number, scoreMap: Array<RangeToScore>): number => {
  return (
    scoreMap.find((rangeToScore: RangeToScore) => rangeToScore.rangeFn(keskiarvo))
      ?.score || 0
  );
};

const roundKa = (ka: number) => Math.round(ka * 100) / 100;

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
  const lukuKa = roundKa(_.sum(lukuaineet) / lukuaineet.length);
  const kaikki = kouluaineet.kielet
    .concat(kouluaineet.lisakielet)
    .concat(kouluaineet.muutLukuaineet)
    .concat(kouluaineet.taitoaineet)
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage);
  const kaikkiKa = roundKa(_.sum(kaikki) / kaikki.length);
  const taitoaineet = kouluaineet.taitoaineet
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage)
    .sort((a: number, b: number) => b - a)
    .slice(0, AMOUNT_OF_TAITOAINE_TO_USE);
  const taitoKa = roundKa(_.sum(taitoaineet) / taitoaineet.length);
  return keskiArvotToHakupiste({
    lukuaineet: String(lukuKa),
    taideTaitoAineet: String(taitoKa),
    kaikki: String(kaikkiKa),
  });
};

export const keskiArvotToHakupiste = (keskiarvot: Keskiarvot): HakupisteLaskelma => {
  const pisteetKaikki = getMatchingScore(
    Number(keskiarvot.kaikki.replace(',', '.')),
    PISTEET_KAIKKI_MAP
  );
  const pisteetLukuaineet = getMatchingScore(
    Number(keskiarvot.taideTaitoAineet.replace(',', '.')),
    PISTEET_TAITO_MAP
  );
  return {
    keskiarvo: Number(keskiarvot.lukuaineet.replace(',', '.')),
    pisteet: pisteetKaikki + pisteetLukuaineet + COMPLETED_STUDIES_SCORE,
  };
};
