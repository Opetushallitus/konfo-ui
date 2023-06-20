import { isNumber, sum } from 'lodash';

import { Kouluaineet, Kouluaine } from './aine/Kouluaine';
import { LocalStorable } from './LocalStorageUtil';

const MAXIMUM_SCORE_KAIKKI = 16;
const MAXIMUM_SCORE_TAITO = 8;
const ARVOSANAN_MINIMI = 4;
const ARVOSANAN_MAKSIMI = 10;
const PAINOKERROIN_MINIMI = 1;
const PAINOKERROIN_MAKSIMI = 5;
const AMOUNT_OF_TAITOAINE_TO_USE = 3;
export const COMPLETED_STUDIES_SCORE = 6;

export const ENSISIJAINEN_SCORE_BONUS = 2;
export interface Keskiarvot extends LocalStorable {
  lukuaineet: string;
  taideTaitoAineet: string;
  kaikki: string;
  suorittanut: boolean;
}

export interface Osalasku extends LocalStorable {
  kaikki: number;
  taideTaitoAineet: number;
  suorittanutBonus: number;
}

export enum LaskelmaTapa {
  KESKIARVOT,
  LUKUAINEET,
}

export interface HakupisteLaskelma extends LocalStorable {
  keskiarvo: number;
  pisteet: number;
  osalasku?: Osalasku;
  tapa: LaskelmaTapa;
}

const isEligibleArvosana = (arvosana: number | null): boolean => {
  return (
    arvosana !== null &&
    Number.isInteger(arvosana) &&
    arvosana >= ARVOSANAN_MINIMI &&
    arvosana <= ARVOSANAN_MAKSIMI
  );
};

const painokerroinToNumber = (painokerroin: string): number =>
  Number.parseFloat(painokerroin.replace(',', '.'));

export const isEligiblePainokerroin = (painokerroin: string): boolean => {
  const painokerroinAsNumber = painokerroinToNumber(painokerroin);
  return (
    isNumber(painokerroinAsNumber) &&
    Number(painokerroinAsNumber) >= PAINOKERROIN_MINIMI &&
    Number(painokerroinAsNumber) <= PAINOKERROIN_MAKSIMI
  );
};

const kouluAineToAverage = (aine: Kouluaine): number => {
  const eligibleValinnaiset = aine.valinnaisetArvosanat.filter(isEligibleArvosana);
  return eligibleValinnaiset.length < 1
    ? Number(aine.arvosana)
    : (Number(aine.arvosana) + sum(eligibleValinnaiset) / eligibleValinnaiset.length) / 2;
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

export const kouluaineetToHakupisteWithPainokertoimet = (
  kouluaineet: Kouluaineet
): HakupisteLaskelma => {
  console.log(kouluaineet);
  const lukuaineet: Array<Kouluaine> = kouluaineet.kielet
    .concat(kouluaineet.lisakielet)
    .concat(kouluaineet.muutLukuaineet)
    .concat(
      kouluaineet.taitoaineet.filter((aine: Kouluaine) =>
        isEligiblePainokerroin(aine.painokerroin)
      )
    )
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana));
  const lukuaineetOsoittaja: number = sum(
    lukuaineet.map(
      (aine: Kouluaine) =>
        Number(aine.arvosana) *
        (isEligiblePainokerroin(aine.painokerroin)
          ? painokerroinToNumber(aine.painokerroin)
          : 1)
    )
  );
  const lukuaineetNimittaja: number = sum(
    lukuaineet.map((a: Kouluaine) =>
      isEligiblePainokerroin(a.painokerroin) ? painokerroinToNumber(a.painokerroin) : 1
    )
  );
  const lukuKa = roundKa(lukuaineetOsoittaja / lukuaineetNimittaja);
  const kaikki = kouluaineet.kielet
    .concat(kouluaineet.lisakielet)
    .concat(kouluaineet.muutLukuaineet)
    .concat(kouluaineet.taitoaineet)
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage);
  const kaikkiKa = roundKa(sum(kaikki) / kaikki.length);
  const taitoaineet = kouluaineet.taitoaineet
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage)
    .sort((a: number, b: number) => b - a)
    .slice(0, AMOUNT_OF_TAITOAINE_TO_USE);
  const taitoKa = roundKa(sum(taitoaineet) / taitoaineet.length);
  return keskiArvotToHakupiste(
    {
      lukuaineet: String(lukuKa),
      taideTaitoAineet: String(taitoKa),
      kaikki: String(kaikkiKa),
      suorittanut: kouluaineet.suorittanut,
    },
    LaskelmaTapa.LUKUAINEET
  );
};

export const kouluaineetToHakupiste = (kouluaineet: Kouluaineet): HakupisteLaskelma => {
  console.log(kouluaineet);
  const lukuaineet: Array<Kouluaine> = kouluaineet.kielet
    .concat(kouluaineet.lisakielet)
    .concat(kouluaineet.muutLukuaineet)
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana));
  const lukuaineetOsoittaja: number = sum(
    lukuaineet.map((aine: Kouluaine) => Number(aine.arvosana))
  );
  const lukuKa = roundKa(lukuaineetOsoittaja / lukuaineet.length);
  const kaikki = kouluaineet.kielet
    .concat(kouluaineet.lisakielet)
    .concat(kouluaineet.muutLukuaineet)
    .concat(kouluaineet.taitoaineet)
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage);
  const kaikkiKa = roundKa(sum(kaikki) / kaikki.length);
  const taitoaineet = kouluaineet.taitoaineet
    .filter((aine: Kouluaine) => isEligibleArvosana(aine.arvosana))
    .map(kouluAineToAverage)
    .sort((a: number, b: number) => b - a)
    .slice(0, AMOUNT_OF_TAITOAINE_TO_USE);
  const taitoKa = roundKa(sum(taitoaineet) / taitoaineet.length);
  return keskiArvotToHakupiste(
    {
      lukuaineet: String(lukuKa),
      taideTaitoAineet: String(taitoKa),
      kaikki: String(kaikkiKa),
      suorittanut: kouluaineet.suorittanut,
    },
    LaskelmaTapa.LUKUAINEET
  );
};

export const keskiArvotToHakupiste = (
  keskiarvot: Keskiarvot,
  tapa: LaskelmaTapa = LaskelmaTapa.KESKIARVOT
): HakupisteLaskelma => {
  const pisteetKaikki = getMatchingScore(
    Number(keskiarvot.kaikki.replace(',', '.')),
    PISTEET_KAIKKI_MAP
  );
  const pisteetTaitoaineet = getMatchingScore(
    Number(keskiarvot.taideTaitoAineet.replace(',', '.')),
    PISTEET_TAITO_MAP
  );
  const suorittanutBonus = keskiarvot.suorittanut ? COMPLETED_STUDIES_SCORE : 0;
  return {
    keskiarvo: Number(keskiarvot.lukuaineet.replace(',', '.')),
    pisteet: pisteetKaikki + pisteetTaitoaineet + suorittanutBonus,
    osalasku: {
      kaikki: pisteetKaikki,
      taideTaitoAineet: pisteetTaitoaineet,
      suorittanutBonus,
    },
    tapa,
  };
};

export const isValidKeskiarvo = (ka: string) => {
  const withDot = ka.replace(',', '.');
  return (
    '' === ka ||
    (isNumber(Number(withDot)) && Number(withDot) >= 4 && Number(withDot) <= 10)
  );
};
