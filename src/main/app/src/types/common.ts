import { Alkamiskausityyppi } from '#/src/constants';
import { FormatoituAikaleima } from '#/src/types/HakukohdeTypes';

export type Translateable = { fi?: string; sv?: string; en?: string };
export type Koodi = { koodiUri: string; nimi: Translateable };

export type Osoite = {
  osoite: Translateable;
  postinumero: Koodi;
};

export type Yhteystiedot = {
  nimi: Translateable;
  postiosoite?: Osoite;
  kayntiosoite?: Osoite;
  postiosoiteStr?: Translateable;
  kayntiosoiteStr?: Translateable;
  sahkoposti?: Translateable;
  puhelinnumero?: Translateable;
  oid?: string;
};

export type Alkamiskausi = {
  alkamiskausityyppi?: Alkamiskausityyppi;
  henkilokohtaisenSuunnitelmanLisatiedot: Translateable;
  koulutuksenAlkamiskausi: Koodi;
  koulutuksenAlkamisvuosi: string;
  formatoituKoulutuksenalkamispaivamaara: FormatoituAikaleima;
  formatoituKoulutuksenpaattymispaivamaara: FormatoituAikaleima;
};

// Utils
export type TODOType = any; // NOTE: Just a temporary type for documenting not-yet-typed stuff until everything is typed
export type ValueOf<T> = T[keyof T];

declare module '@mui/system/createTheme/createBreakpoints' {
  interface BreakpointOverrides {
    xxl: true;
  }
}
