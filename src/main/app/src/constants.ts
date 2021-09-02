export const YHTEISHAKU_KOODI_URI = 'hakutapa_01';

export const FILTER_TYPES = {
  KOULUTUSALA: 'koulutusala',
  KOULUTUSTYYPPI: 'koulutustyyppi',
  KOULUTUSTYYPPI_MUU: 'koulutustyyppi-muu',
  OPETUSKIELI: 'opetuskieli',
  KUNTA: 'kunta',
  MAAKUNTA: 'maakunta',
  OPETUSTAPA: 'opetustapa',
  VALINTATAPA: 'valintatapa',
  HAKUKAYNNISSA: 'hakukaynnissa',
  HAKUTAPA: 'hakutapa',
  YHTEISHAKU: 'yhteishaku',
  POHJAKOULUTUSVAATIMUS: 'pohjakoulutusvaatimus',

  SIJAINTI: 'sijainti', // TODO: Poista tämä kun konfo-backend ei enää käytä sijaintirajainta vaan kunta + maakunta
} as const;

export const FILTER_TYPES_ARR = Object.values(FILTER_TYPES);

// TODO: konfo-backend haluaa turhaan kunta + maakunta rajaimet yhtenä könttinä (sijainti), se pitäisi purkaa sieltä
// Tämän voi poistaa sitten kun konfo-backend ottaa vastaan maakunta + kunta rajaimet
export const FILTER_TYPES_ARR_FOR_KONFO_BACKEND = [
  'opetuskieli',
  'koulutusala',
  'koulutustyyppi',
  'sijainti',
  'opetustapa',
  'valintatapa',
  'hakukaynnissa',
  'hakutapa',
  'yhteishaku',
  'pohjakoulutusvaatimus',
] as const;

export const DRAWER_WIDTH = 330;
export const KEEP_VALIKKO_OPEN_WIDTH = 1280;

export const LANG_NAME_BY_CODE = {
  fi: 'suomi',
  sv: 'ruotsi',
  en: 'englanti',
} as const;

// TODO: loput tyypit
export const KOULUTUS_TYYPPI = {
  AMM: 'amm',
  AMM_TUTKINNON_OSA: 'amm-tutkinnon-osa',
  AMM_OSAAMISALA: 'amm-osaamisala',
  TUVA: 'tuva',
} as const;

export const KOULUTUS_TYYPPI_MUU = {
  AMM_MUU: 'amm-muu',
  AMM_OSAAMISALA: 'amm-osaamisala',
  AMM_TUTKINNON_OSA: 'amm-tutkinnon-osa',
} as const;

export const KOULUTUS_TYYPPI_MUU_ARR = Object.values(KOULUTUS_TYYPPI_MUU);

export const HAKULOMAKE_TYYPPI = {
  EI_SAHKOISTA: 'ei sähköistä',
  MUU: 'muu',
} as const;

// Search related
export const pageSizeArray = [5, 10, 20, 30, 50];
export const pageSortArray = ['score_desc', 'name_asc', 'name_desc'];

export enum Alkamiskausityyppi {
  TARKKA_ALKAMISAJANKOHTA = 'tarkka alkamisajankohta',
  ALKAMISKAUSI_JA_VUOSI = 'alkamiskausi ja -vuosi',
  HENKILOKOHTAINEN_SUUNNITELMA = 'henkilokohtainen suunnitelma',
}
