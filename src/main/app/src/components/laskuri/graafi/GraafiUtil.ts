import { useMemo } from 'react';

import { Datum } from 'victory';

import { formatDouble } from '#/src/tools/utils';
import { Hakukohde, PisteHistoria } from '#/src/types/HakukohdeTypes';

export const GRAAFI_MAX_YEAR = new Date().getUTCFullYear();
export const GRAAFI_MIN_YEAR = GRAAFI_MAX_YEAR - 5;

export type PisteData = {
  data: Array<Datum>;
  years: Array<number>;
  labels: Array<string>;
};

export const usePisteHistoria = (hakukohde: Hakukohde): PisteData => {
  return useMemo(() => {
    const dataNew =
      hakukohde?.metadata?.pistehistoria
        ?.filter(
          (historia: PisteHistoria) => Number.parseInt(historia.vuosi) > GRAAFI_MIN_YEAR
        )
        .map((historia: PisteHistoria) => {
          return { x: Number.parseInt(historia.vuosi), y: historia.pisteet };
        }) || [];
    const data = dataNew;
    const years = dataNew.map((datum: Datum) => datum.x);
    const labels = dataNew.map((datum: Datum) => formatDouble(datum.y));
    return { data, years, labels };
  }, [hakukohde]);
};
