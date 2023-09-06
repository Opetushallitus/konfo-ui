export const YHTEISHAKU_KOODI_URI = 'hakutapa_01';

export const TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO = 'haunkohdejoukko_11';

export const FILTER_TYPES = {
  KOULUTUSALA: 'koulutusala',
  KOULUTUSTYYPPI: 'koulutustyyppi',
  OPETUSKIELI: 'opetuskieli',
  OPETUSAIKA: 'opetusaika',
  KUNTA: 'kunta',
  MAAKUNTA: 'maakunta',
  OPETUSTAPA: 'opetustapa',
  VALINTATAPA: 'valintatapa',
  HAKUKAYNNISSA: 'hakukaynnissa',
  JOTPA: 'jotpa',
  TYOVOIMAKOULUTUS: 'tyovoimakoulutus',
  TAYDENNYSKOULUTUS: 'taydennyskoulutus',
  HAKUTAPA: 'hakutapa',
  YHTEISHAKU: 'yhteishaku',
  POHJAKOULUTUSVAATIMUS: 'pohjakoulutusvaatimus',
  LUKIOPAINOTUKSET: 'lukiopainotukset',
  LUKIOLINJATERITYINENKOULUTUSTEHTAVA: 'lukiolinjaterityinenkoulutustehtava',
  OSAAMISALA: 'osaamisala',
  KOULUTUKSENKESTOKUUKAUSINA: 'koulutuksenkestokuukausina',
  MAKSULLISUUS: 'maksullisuus',
  MAKSULLISUUSTYYPPI: 'maksullisuustyyppi',
  MAKSUNMAARA: 'maksunmaara',
  LUKUVUOSIMAKSUNMAARA: 'lukuvuosimaksunmaara',
  APURAHA: 'apuraha',
  SIJAINTI: 'sijainti', // TODO: Poista tämä kun konfo-backend ei enää käytä sijaintirajainta vaan kunta + maakunta
  ALKAMISKAUSI: 'alkamiskausi',
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
  'opetusaika',
  'valintatapa',
  'hakukaynnissa',
  'jotpa',
  'tyovoimakoulutus',
  'taydennyskoulutus',
  'hakutapa',
  'yhteishaku',
  'pohjakoulutusvaatimus',
  'lukiopainotukset',
  'lukiolinjaterityinenkoulutustehtava',
  'osaamisala',
  'alkamiskausi',
  'maksullisuustyyppi',
] as const;

export const SIDEMENU_WIDTH = 330;
export const KEEP_VALIKKO_OPEN_WIDTH = 1366;

export const LANG_NAME_BY_CODE = {
  fi: 'suomi',
  sv: 'ruotsi',
  en: 'englanti',
} as const;

export enum KOULUTUS_TYYPPI {
  AMM = 'amm',
  AMM_TUTKINNON_OSA = 'amm-tutkinnon-osa',
  AMM_OSAAMISALA = 'amm-osaamisala',
  MUU_AMMATILLINEN_KOULUTUS = 'amm-muu',
  TUVA = 'tuva',
  VAPAA_SIVISTYSTYO_OPISTOVUOSI = 'vapaa-sivistystyo-opistovuosi',
  VAPAA_SIVISTYSTYO_MUU = 'vapaa-sivistystyo-muu',
  TELMA = 'telma',
  LUKIOKOULUTUS = 'lk',
  YLIOPISTOKOULUTUS = 'yo',
  AMKKOULUTUS = 'amk',
  AVOIN_YO = 'avoin_yo',
  AVOIN_AMK = 'avoin_amk',
  TAYDENNYS_KOULUTUS = 'taydennyskoulutus',
  ERIKOISTUMISKOULUTUS = 'erikoistumiskoulutus',
  VALMENTAVA_KOULUTUS = 'valmentava_koulutus',
  AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS = 'amm-ope-erityisope-ja-opo',
  OPETTAJIEN_PEDAGOGISET_OPINNOT = 'ope-pedag-opinnot',
  AIKUISTEN_PERUSOPETUS = 'aikuisten-perusopetus',
  TAITEEN_PERUSOPETUS = 'taiteen-perusopetus',
  KK_OPINTOJAKSO = 'kk-opintojakso',
  KK_OPINTOKOKONAISUUS = 'kk-opintokokonaisuus',
  ERIKOISLAAKARI = 'erikoislaakari',
  MUU = 'muu',
}

export type Koulutustyyppi = (typeof KOULUTUS_TYYPPI)[keyof typeof KOULUTUS_TYYPPI];

export const TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT = [
  KOULUTUS_TYYPPI.AMKKOULUTUS,
  KOULUTUS_TYYPPI.YLIOPISTOKOULUTUS,
];

export const TUTKINTOON_JOHTAMATTOMAT_KORKEAKOULU_KOULUTUSTYYPIT = [
  KOULUTUS_TYYPPI.AVOIN_YO,
  KOULUTUS_TYYPPI.AVOIN_AMK,
  KOULUTUS_TYYPPI.TAYDENNYS_KOULUTUS,
  KOULUTUS_TYYPPI.ERIKOISTUMISKOULUTUS,
  KOULUTUS_TYYPPI.VALMENTAVA_KOULUTUS,
  KOULUTUS_TYYPPI.AMMATILLINEN_OPETTAJA_ERITYISOPETTAJA_JA_OPOKOULUTUS,
  KOULUTUS_TYYPPI.KK_OPINTOJAKSO,
  KOULUTUS_TYYPPI.KK_OPINTOKOKONAISUUS,
];

export const KORKEAKOULU_KOULUTUSTYYPIT = [
  ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  ...TUTKINTOON_JOHTAMATTOMAT_KORKEAKOULU_KOULUTUSTYYPIT,
];

export enum Hakulomaketyyppi {
  ATARU = 'ataru',
  EI_SAHKOISTA = 'ei sähköistä',
  MUU = 'muu',
}

// Search related
export const pageSizeArray = [5, 10, 20, 30, 50];
export const pageSortArray = ['score_desc', 'name_asc', 'name_desc'];

export enum Alkamiskausityyppi {
  TARKKA_ALKAMISAJANKOHTA = 'tarkka alkamisajankohta',
  ALKAMISKAUSI_JA_VUOSI = 'alkamiskausi ja -vuosi',
  HENKILOKOHTAINEN_SUUNNITELMA = 'henkilokohtainen suunnitelma',
}

export const NDASH = '\u2013';

export enum MAKSULLISUUSTYYPPI {
  MAKSULLINEN = 'maksullinen',
  MAKSUTON = 'maksuton',
  LUKUVUOSIMAKSU = 'lukuvuosimaksu',
}
