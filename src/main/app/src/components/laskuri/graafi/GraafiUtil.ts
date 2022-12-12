import { useState, useMemo } from 'react';

import { Datum } from 'victory';

import { Hakukohde, PisteHistoria } from '#/src/types/HakukohdeTypes';

export const GRAAFI_MAX_YEAR = new Date().getUTCFullYear();
export const GRAAFI_MIN_YEAR = GRAAFI_MAX_YEAR - 5;

export type PisteData = {
  data: Array<Datum>;
  years: Array<number>;
  labels: Array<string>;
};

export const usePisteHistoria = (hakukohde: Hakukohde): PisteData => {
  const [data, setData] = useState<Array<Datum>>([]);
  const [years, setYears] = useState<Array<number>>([]);
  const [labels, setLabels] = useState<Array<string>>([]);

  useMemo(() => {
    const dataNew =
      hakukohde?.metadata?.pistehistoria
        ?.filter(
          (historia: PisteHistoria) => Number.parseInt(historia.vuosi) > GRAAFI_MIN_YEAR
        )
        .map((historia: PisteHistoria) => {
          return { x: Number.parseInt(historia.vuosi), y: historia.pisteet };
        }) || [];
    setData(dataNew);
    setYears(dataNew.map((datum: Datum) => datum.x));
    setLabels(dataNew.map((datum: Datum) => `${datum.y}`.replace('.', ',')));
  }, [hakukohde]);

  return { data, years, labels };
};
