import { Translateable } from '#/src/types/common';

import { FILTER_TYPES } from '../constants';

export type SuodatinComponentProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  defaultExpandAlakoodit?: boolean;
  shadow?: boolean;
  onFocus?: () => void;
  onHide?: () => void;
  rajainValues?: Array<RajainItem>;
  maakuntaRajainValues?: Array<CheckboxRajainItem>;
  kuntaRajainValues?: Array<CheckboxRajainItem>;
  hakutapaRajainValues?: Array<CheckboxRajainItem>;
  muuRajainValues?: Array<CheckboxRajainItem>;
  loading?: boolean;
  setFilters: (value: any) => void;
  name?: string;
};

export enum RajainType {
  CHECKBOX,
  BOOLEAN,
  NUMBER_RANGE,
  COMPOSITE,
  UNKNOWN,
}

export type RajainItem = CheckboxRajainItem | BooleanRajainItem | NumberRangeRajainItem;

export interface RajainBase {
  id: string;
  rajainId: string;
  count: number;
  hidden?: boolean;
  nimi?: Translateable;
}

export interface CheckboxRajainBase extends RajainBase {
  checked: boolean;
}

export interface CheckboxRajainItem extends CheckboxRajainBase {
  alakoodit?: Array<CheckboxRajainBase>;
}

export interface NumberRangeRajainItem extends RajainBase {
  min?: number;
  max?: number;
  upperLimit?: number;
}

export interface BooleanRajainItem extends RajainBase {
  checked: boolean;
}

export const BOOLEAN_RAJAIN_IDS: Array<string> = [
  FILTER_TYPES.HAKUKAYNNISSA,
  FILTER_TYPES.JOTPA,
  FILTER_TYPES.TYOVOIMAKOULUTUS,
  FILTER_TYPES.TAYDENNYSKOULUTUS,
  FILTER_TYPES.APURAHA,
];

export const NUMBER_RANGE_RAJAIN_IDS: Array<string> = [
  FILTER_TYPES.KOULUTUKSENKESTOKUUKAUSINA,
  FILTER_TYPES.MAKSUNMAARA,
  FILTER_TYPES.LUKUVUOSIMAKSUNMAARA,
];

export const COMPOSITE_RAJAIN_IDS: Array<string> = [FILTER_TYPES.MAKSULLISUUS];

export const REPLACED_RAJAIN_IDS = {
  [FILTER_TYPES.YHTEISHAKU]: FILTER_TYPES.HAKUTAPA,
};

export interface RajainUIBaseItem {
  id: string;
  rajainId: string;
  count: number;
  checked: boolean;
  nimi?: Translateable;
  hidden?: boolean;
}

export interface RajainUIItem extends RajainUIBaseItem {
  alakoodit?: Array<RajainUIBaseItem>;
}

export type RajainBackendItem = {
  id: string;
  filterId: string;
  count: number;
  nimi?: Translateable;
  hidden?: boolean; // Jotkut rajaimet eivät näytä kaikkia arvoja kerralla (koulutustyyppi), mutta kaikki arvot tarvitaan
};
