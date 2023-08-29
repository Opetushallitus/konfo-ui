import { useMemo } from 'react';

import { colors } from '#/src/colors';
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
  pisteet: number;
  pisteetLabel: any;
  vuosi: number;
  pistetyyppi: string;
};

export const usePisteHistoria = (hakukohde: Hakukohde): Array<PisteData> => {
  return useMemo(() => {
    const data =
      hakukohde?.metadata?.pistehistoria
        ?.filter(
          (historia: PisteHistoria) => Number.parseInt(historia.vuosi) >= GRAAFI_MIN_YEAR
        )
        .map((historia: PisteHistoria) => {
          return {
            pisteet: historia.pisteet,
            pisteetLabel: formatDouble(historia.pisteet),
            vuosi: Number.parseInt(historia.vuosi),
            pistetyyppi: historia.valintatapajonoTyyppi?.koodiUri,
          } as PisteData;
        })
        .sort((a, b) => b.vuosi - a.vuosi)
        .slice(0, MAX_ITEMS) || [];
    return data;
  }, [hakukohde]);
};

export const getStyleByPistetyyppi = (pistetyyppi: string): string => {
  switch (pistetyyppi) {
    case 'valintatapajono_yp':
      return colors.yhteispisteetPink;
    case 'valintatapajono_kp':
      return colors.koepisteetBlue;
    case 'valintatapajono_tv':
      return colors.verminal;
    default:
      return colors.darkGrey; // valintatapajono_m tai tieto puuttuu
  }
};
