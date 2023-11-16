export const YHTEISHAKU_KOODI_URI = 'hakutapa_01';

export const TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO = 'haunkohdejoukko_11';

// Sisäisesti tallennetut rajainten nimet. Eroavat joiltain osin konfo-backendille lähetettävistä rajaimista.
export const RAJAIN_TYPES = {
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
  OPPILAITOS: 'oppilaitos',
  HAKUALKAAPAIVISSA: 'hakualkaapaivissa',
} as const;

export const RAJAIN_TYPES_ARR = Object.values(RAJAIN_TYPES);

export const SIDEMENU_WIDTH = 330;
export const KEEP_VALIKKO_OPEN_WIDTH = 1366;

export const LANG_NAME_BY_CODE = {
  fi: 'suomi',
  sv: 'ruotsi',
  en: 'englanti',
} as const;

export const LANG_OPTIONS = [
  {
    name: 'suomi',
    code: 'fi',
    ISOCode: 'fi',
  },
  {
    name: 'ruotsi',
    code: 'sv',
    ISOCode: 'sv-FI',
  },
  {
    name: 'englanti',
    code: 'en',
    ISOCode: 'en-US',
  },
];

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
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50];
export const PAGE_SORT_OPTIONS = ['score_desc', 'name_asc', 'name_desc'];

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

export const PAINOTETUT_OPPIAINEET_LUKIO_KAIKKI_OPTIONS = [
  'painotettavatoppiaineetlukiossa_a1',
  'painotettavatoppiaineetlukiossa_a2',
  'painotettavatoppiaineetlukiossa_b1',
  'painotettavatoppiaineetlukiossa_b2',
  'painotettavatoppiaineetlukiossa_b3',
];
