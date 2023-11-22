import { RAJAIN_TYPES } from '#/src/constants';
import { RajainName, Translateable } from '#/src/types/common';

import { RajainValues } from '../store/reducers/hakutulosSlice';

export type SetRajainValues = (value: Partial<RajainValues>) => void;

export type RajainComponentProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  defaultExpandAlakoodit?: boolean;
  shadow?: boolean;
  onFocus?: () => void;
  onHide?: () => void;
  loading?: boolean;
  setRajainValues: SetRajainValues;
  name?: string;
  rajainOptions: Record<RajainName, any>; // backendin palauttama "filters", eli valittavissa olevat rajaimet ja niiden lukumäärät
  rajainValues: Partial<RajainValues>; // kaikkien rajainten valitut arvot
};

export type RajainItem = CheckboxRajainItem | BooleanRajainItem | NumberRangeRajainItem;

export interface RajainBase {
  id: string;
  count: number;
  hidden?: boolean;
  nimi?: Translateable;
  linkedIds?: Array<string>;
  linkedRajainItems?: Array<RajainItem>;
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

const COMPOSITE_RAJAIN_IDS = [RAJAIN_TYPES.MAKSULLISUUS] as const;
export type CompositeRajainId = (typeof COMPOSITE_RAJAIN_IDS)[number];
export const isCompositeRajainId = (rajainId: any): rajainId is CompositeRajainId =>
  COMPOSITE_RAJAIN_IDS.includes(rajainId);

const BOOLEAN_RAJAIN_IDS = [
  RAJAIN_TYPES.HAKUKAYNNISSA,
  RAJAIN_TYPES.JOTPA,
  RAJAIN_TYPES.TYOVOIMAKOULUTUS,
  RAJAIN_TYPES.TAYDENNYSKOULUTUS,
  RAJAIN_TYPES.APURAHA,
] as const;

export type BooleanRajainId = (typeof BOOLEAN_RAJAIN_IDS)[number];
export const isBooleanRajainId = (rajainId: any): rajainId is BooleanRajainId =>
  BOOLEAN_RAJAIN_IDS.includes(rajainId);

const NUMBER_RANGE_RAJAIN_IDS = [
  RAJAIN_TYPES.KOULUTUKSENKESTOKUUKAUSINA,
  RAJAIN_TYPES.MAKSUNMAARA,
  RAJAIN_TYPES.LUKUVUOSIMAKSUNMAARA,
] as const;

export type NumberRangeRajainId = (typeof NUMBER_RANGE_RAJAIN_IDS)[number];
export const isNumberRangeRajainId = (rajainId: any): rajainId is NumberRangeRajainId =>
  NUMBER_RANGE_RAJAIN_IDS.includes(rajainId);

const CHECKBOX_RAJAIN_IDS = [
  RAJAIN_TYPES.KOULUTUSTYYPPI,
  RAJAIN_TYPES.KOULUTUSALA,
  RAJAIN_TYPES.OPETUSKIELI,
  RAJAIN_TYPES.OPETUSAIKA,
  RAJAIN_TYPES.OPETUSTAPA,
  RAJAIN_TYPES.KUNTA,
  RAJAIN_TYPES.MAAKUNTA,
  RAJAIN_TYPES.SIJAINTI,
  RAJAIN_TYPES.VALINTATAPA,
  RAJAIN_TYPES.HAKUTAPA,
  RAJAIN_TYPES.YHTEISHAKU,
  RAJAIN_TYPES.POHJAKOULUTUSVAATIMUS,
  RAJAIN_TYPES.LUKIOPAINOTUKSET,
  RAJAIN_TYPES.LUKIOLINJATERITYINENKOULUTUSTEHTAVA,
  RAJAIN_TYPES.OSAAMISALA,
  RAJAIN_TYPES.MAKSULLISUUSTYYPPI,
  RAJAIN_TYPES.ALKAMISKAUSI,
  RAJAIN_TYPES.OPPILAITOS,
  RAJAIN_TYPES.HAKUALKAAPAIVISSA,
] as const;

export type CheckboxRajainId = (typeof CHECKBOX_RAJAIN_IDS)[number];

export const isCheckboxRajainId = (rajainId: any): rajainId is CheckboxRajainId =>
  CHECKBOX_RAJAIN_IDS.includes(rajainId);

export const REPLACED_RAJAIN_IDS: any = {
  [RAJAIN_TYPES.YHTEISHAKU]: RAJAIN_TYPES.HAKUTAPA,
};

export const LINKED_IDS: Record<string, Array<string>> = {
  maksullinen: [RAJAIN_TYPES.MAKSUNMAARA],
  lukuvuosimaksu: [RAJAIN_TYPES.LUKUVUOSIMAKSUNMAARA, RAJAIN_TYPES.APURAHA],
};

export const ORDER_TO_BE_RETAINED_RAJAINIDS: Array<CheckboxRajainId> = [
  RAJAIN_TYPES.KOULUTUSTYYPPI,
];

export type RajainBackendItem = {
  id: string;
  filterId: string;
  count: number;
  nimi?: Translateable;
  hidden?: boolean; // Jotkut rajaimet eivät näytä kaikkia arvoja kerralla (koulutustyyppi), mutta kaikki arvot tarvitaan
};
