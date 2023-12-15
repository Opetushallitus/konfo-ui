import { useMemo } from 'react';

import { TFunction } from 'i18next';

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

export const getStyleByPistetyyppi = (pistetyyppi: string | undefined): string => {
  switch (pistetyyppi) {
    case 'valintatapajono_yp':
      return colors.yhteispisteetPink;
    case 'valintatapajono_kp':
      return colors.koepisteetBlue;
    case 'valintatapajono_tv':
      return colors.verminal;
    default:
      return colors.grey700; // valintatapajono_m tai tieto puuttuu
  }
};

export const getUniquePistetyypit = (hakukohde: Hakukohde) => {
  // huomioidaan vaan graafilla näkyvät vuodet
  const pistetyypit = hakukohde?.metadata?.pistehistoria
    ?.filter(
      (historia: PisteHistoria) => Number.parseInt(historia.vuosi) >= GRAAFI_MIN_YEAR
    )
    .sort((a, b) => Number.parseInt(b.vuosi) - Number.parseInt(a.vuosi))
    .slice(0, MAX_ITEMS)
    .map((pistehistoria) => pistehistoria?.valintatapajonoTyyppi?.koodiUri);
  const uniikitPistetyypit = new Set(pistetyypit);
  // jos on sekä 'muu' että tyhjä, ei listata niitä erikseen
  if (uniikitPistetyypit.has(undefined) && uniikitPistetyypit.has('valintatapajono_m')) {
    uniikitPistetyypit.delete(undefined);
  }
  return Array.from(uniikitPistetyypit);
};

export const containsOnlyTodistusvalinta = (hakukohde: Hakukohde) => {
  return (
    getUniquePistetyypit(hakukohde).length == 1 &&
    getUniquePistetyypit(hakukohde).includes('valintatapajono_tv')
  );
};

export const containsOnlyKoepisteet = (hakukohde: Hakukohde) => {
  return (
    getUniquePistetyypit(hakukohde).length == 1 &&
    getUniquePistetyypit(hakukohde).includes('valintatapajono_kp')
  );
};

export const containsOnlyYhteispisteet = (hakukohde: Hakukohde) => {
  return (
    getUniquePistetyypit(hakukohde).length == 1 &&
    getUniquePistetyypit(hakukohde).includes('valintatapajono_yp')
  );
};

export const getPistetyyppiText = (
  pistetyyppi: string | undefined,
  t: TFunction
): string => {
  switch (pistetyyppi) {
    case 'valintatapajono_yp':
      return ` (${t('pistelaskuri.graafi.yhteispisteet')})`;
    case 'valintatapajono_kp':
      return ` (${t('pistelaskuri.graafi.koepisteet')})`;
    case 'valintatapajono_tv':
      return ` (${t('pistelaskuri.graafi.todistusvalinta')})`;
    default:
      return ''; // valintatapajono_m tai tieto puuttuu
  }
};

export const getLukioPisteText = (
  pistetyyppi: string | undefined,
  t: TFunction
): string => {
  switch (pistetyyppi) {
    case 'valintatapajono_yp':
      return `${t('pistelaskuri.graafi.alin-pisteet')} (${t(
        'pistelaskuri.graafi.yhteispisteet-lukio'
      )})`;
    case 'valintatapajono_tv':
      return t('pistelaskuri.graafi.alin-keskiarvo');
    default:
      return t('pistelaskuri.graafi.alin-pisteet'); // lukiossa ei pitäisi olla muita valintajonotyyppejä
  }
};
