export interface Keskiarvot {
  lukuaineet: string;
  taideTaitoAineet: string;
  kaikki: string;
}

export interface HakupisteLaskelma {
  keskiarvo: number;
  pisteet: number;
}

export const keskiArvotToHakupiste = (keskiarvot: Keskiarvot): HakupisteLaskelma => {
  const pisteetKaikki = Math.max(
    1,
    Math.round(((Number.parseFloat(keskiarvot.kaikki) - 4) / 6) * 16)
  );
  const pisteetLukuaineet = Math.max(
    1,
    Math.round(((Number.parseFloat(keskiarvot.taideTaitoAineet) - 4) / 6) * 8)
  );
  return {
    keskiarvo: Number.parseFloat(keskiarvot.lukuaineet),
    pisteet: pisteetKaikki + pisteetLukuaineet,
  };
};
