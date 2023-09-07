import { RajainName, Translateable } from '#/src/types/common';

import { FILTER_TYPES } from '../constants';
import { RajainValues } from '../store/reducers/hakutulosSlice';

export type SuodatinComponentProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  defaultExpandAlakoodit?: boolean;
  shadow?: boolean;
  onFocus?: () => void;
  onHide?: () => void;
  loading?: boolean;
  setFilters: (value: any) => void;
  name?: string;
  // uudet kentät, jotta rajain-komponentti voi itse muodostaa arvonsa
  rajainOptions?: Record<RajainName, any>; // backendin palauttama "filters", eli valittavissa olevat rajaimet ja niiden lukumäärät
  rajainValues?: Partial<RajainValues>; // kaikkien rajainten valitut arvot
};

export type RajainItem = CheckboxRajainItem | BooleanRajainItem | NumberRangeRajainItem;

export interface RajainBase {
  id: string;
  count: number;
  hidden?: boolean;
  nimi?: Translateable;
  linkedIds?: Array<string>;
}

export interface CheckboxRajainBase extends RajainBase {
  rajainId: CheckboxRajainId;
  checked: boolean;
}

export interface CheckboxRajainItem extends CheckboxRajainBase {
  alakoodit?: Array<CheckboxRajainBase>;
}

export interface NumberRangeRajainItem extends RajainBase {
  rajainId: NumberRangeRajainId;
  min?: number;
  max?: number;
  upperLimit?: number;
}

export interface BooleanRajainItem extends RajainBase {
  rajainId: BooleanRajainId;
  checked: boolean;
}

const COMPOSITE_RAJAIN_IDS = [FILTER_TYPES.MAKSULLISUUS] as const;
export type CompositeRajainId = (typeof COMPOSITE_RAJAIN_IDS)[number];
export const isCompositeRajainId = (rajainId: any): rajainId is CompositeRajainId =>
  COMPOSITE_RAJAIN_IDS.includes(rajainId);

const BOOLEAN_RAJAIN_IDS = [
  FILTER_TYPES.HAKUKAYNNISSA,
  FILTER_TYPES.JOTPA,
  FILTER_TYPES.TYOVOIMAKOULUTUS,
  FILTER_TYPES.TAYDENNYSKOULUTUS,
  FILTER_TYPES.APURAHA,
] as const;

export type BooleanRajainId = (typeof BOOLEAN_RAJAIN_IDS)[number];
export const isBooleanRajainId = (rajainId: any): rajainId is BooleanRajainId =>
  BOOLEAN_RAJAIN_IDS.includes(rajainId);

const NUMBER_RANGE_RAJAIN_IDS = [
  FILTER_TYPES.KOULUTUKSENKESTOKUUKAUSINA,
  FILTER_TYPES.MAKSUNMAARA,
  FILTER_TYPES.LUKUVUOSIMAKSUNMAARA,
] as const;

export type NumberRangeRajainId = (typeof NUMBER_RANGE_RAJAIN_IDS)[number];
export const isNumberRangeRajainId = (rajainId: any): rajainId is NumberRangeRajainId =>
  NUMBER_RANGE_RAJAIN_IDS.includes(rajainId);

const CHECKBOX_RAJAIN_IDS = [
  FILTER_TYPES.KOULUTUSTYYPPI,
  FILTER_TYPES.KOULUTUSALA,
  FILTER_TYPES.OPETUSKIELI,
  FILTER_TYPES.OPETUSAIKA,
  FILTER_TYPES.OPETUSTAPA,
  FILTER_TYPES.KUNTA,
  FILTER_TYPES.MAAKUNTA,
  FILTER_TYPES.SIJAINTI,
  FILTER_TYPES.VALINTATAPA,
  FILTER_TYPES.HAKUTAPA,
  FILTER_TYPES.YHTEISHAKU,
  FILTER_TYPES.POHJAKOULUTUSVAATIMUS,
  FILTER_TYPES.LUKIOPAINOTUKSET,
  FILTER_TYPES.LUKIOLINJATERITYINENKOULUTUSTEHTAVA,
  FILTER_TYPES.OSAAMISALA,
  FILTER_TYPES.MAKSULLISUUSTYYPPI,
  FILTER_TYPES.ALKAMISKAUSI,
  'oppilaitos',
] as const;

export type CheckboxRajainId = (typeof CHECKBOX_RAJAIN_IDS)[number];

export const isCheckboxRajainId = (rajainId: any): rajainId is CheckboxRajainId =>
  CHECKBOX_RAJAIN_IDS.includes(rajainId);

export const REPLACED_RAJAIN_IDS: any = {
  [FILTER_TYPES.YHTEISHAKU]: FILTER_TYPES.HAKUTAPA,
};

export const LINKED_IDS: Record<string, Array<string>> = {
  maksullinen: [FILTER_TYPES.MAKSUNMAARA],
  lukuvuosimaksu: [FILTER_TYPES.LUKUVUOSIMAKSUNMAARA, FILTER_TYPES.APURAHA],
};

export const ORDER_TO_BE_RETAINED_RAJAINIDS: Array<CheckboxRajainId> = [
  FILTER_TYPES.KOULUTUSTYYPPI,
];
export type RajainBackendItem = {
  id: string;
  filterId: string;
  count: number;
  nimi?: Translateable;
  hidden?: boolean; // Jotkut rajaimet eivät näytä kaikkia arvoja kerralla (koulutustyyppi), mutta kaikki arvot tarvitaan
};
