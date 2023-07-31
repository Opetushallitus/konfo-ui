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

export interface CheckboxRajainItem extends RajainBase {
  checked: boolean;
  alakoodit?: Array<Omit<CheckboxRajainItem, 'alakoodit'>>;
}

export interface NumberRangeRajainItem extends RajainBase {
  min?: number;
  max?: number;
}

export interface BooleanRajainItem extends RajainBase {
  checked: boolean;
}

export interface CompositeRajainValue extends RajainBase {
  rajainValues: Array<RajainBase>;
}

export const BOOLEAN_FILTER_IDS: Array<string> = [
  FILTER_TYPES.HAKUKAYNNISSA,
  FILTER_TYPES.JOTPA,
  FILTER_TYPES.TYOVOIMAKOULUTUS,
  FILTER_TYPES.TAYDENNYSKOULUTUS,
];

export const NUMBER_RANGE_FILTER_IDS: Array<string> = [
  FILTER_TYPES.KOULUTUKSENKESTOKUUKAUSINA,
];

export const COMPOSITE_FILTER_IDS: Array<string> = [];

export const REPLACED_FILTER_IDS = {
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

export type FilterValue = {
  id: string;
  filterId: string;
  checked: boolean;
  count: number;
  nimi?: Translateable;
  alakoodit?: Array<Omit<FilterValue, 'alakoodit'>>;
  hidden?: boolean; // Jotkut rajaimet eivät näytä kaikkia arvoja kerralla (koulutustyyppi), mutta kaikki arvot tarvitaan
  anyValue?: any;
};
