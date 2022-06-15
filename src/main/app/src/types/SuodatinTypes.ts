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
  isHaku?: boolean;
  handleFilterChange?: (value: any) => void;
  values?: Array<FilterValue>;
  maakuntaValues?: Array<FilterValue>;
  kuntaValues?: Array<FilterValue>;
  loading?: boolean;
  setFilters: (value: any) => void;
};

export type FilterValue = {
  id: string;
  filterId: string;
  checked: boolean;
  count: number;
  nimi?: Translateable;
  alakoodit?: Array<Omit<FilterValue, 'alakoodit'>>;
  hidden?: boolean; // Jotkut rajaimet eivät näytä kaikkia arvoja kerralla (koulutustyyppi), mutta kaikki arvot tarvitaan
};

export type FilterValues = Array<FilterValue>;
