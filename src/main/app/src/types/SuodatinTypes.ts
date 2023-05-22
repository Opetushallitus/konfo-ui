import { Translateable } from '#/src/types/common';

export type SuodatinComponentProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  defaultExpandAlakoodit?: boolean;
  shadow?: boolean;
  onFocus?: () => void;
  onHide?: () => void;
  values?: Array<FilterValue>;
  maakuntaValues?: Array<FilterValue>;
  kuntaValues?: Array<FilterValue>;
  hakukaynnissaValues?: Array<FilterValue>;
  hakutapaValues?: Array<FilterValue>;
  muuValues?: Array<FilterValue>;
  loading?: boolean;
  setFilters: (value: any) => void;
  name?: string;
};

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

export type FilterValues = Array<FilterValue>;
