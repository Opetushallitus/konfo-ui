import { useMemo } from 'react';

import { Datum } from 'victory';

import { formatDouble } from '#/src/tools/utils';
import { Hakukohde, PisteHistoria } from '#/src/types/HakukohdeTypes';

export const GRAAFI_MAX_YEAR = new Date().getUTCFullYear();
export const GRAAFI_MIN_YEAR = GRAAFI_MAX_YEAR - 5;
export const MAX_ITEMS = 5;

export enum GraafiBoundary {
  MIN,
  MAX,
}

export const graafiYearModifier = (
  years: Array<number>,
  boundary: GraafiBoundary
): number => {
  if (years.length < 1) {
    return 0;
  }
  const latestYear = years.sort((a, b) => b - a)[0];
  if (GraafiBoundary.MAX === boundary) {
    return latestYear < GRAAFI_MAX_YEAR ? 0 : 1;
  } else {
    return latestYear < GRAAFI_MAX_YEAR ? -1 : 0;
  }
};

export type PisteData = {
  data: Array<Datum>;
  years: Array<number>;
  labels: Array<string>;
};

export const usePisteHistoria = (hakukohde: Hakukohde): PisteData => {
  return useMemo(() => {
    const data =
      hakukohde?.metadata?.pistehistoria
        ?.filter(
          (historia: PisteHistoria) => Number.parseInt(historia.vuosi) >= GRAAFI_MIN_YEAR
        )
        .map((historia: PisteHistoria) => {
          return { x: Number.parseInt(historia.vuosi), y: historia.pisteet };
        })
        .sort((a, b) => b.x - a.x)
        .slice(0, MAX_ITEMS) || [];
    const years = data.map((datum: Datum) => datum.x);
    const labels = data.map((datum: Datum) => formatDouble(datum.y));
    return { data, years, labels };
  }, [hakukohde]);
};
