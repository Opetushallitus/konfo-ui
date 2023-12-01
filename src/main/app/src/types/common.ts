import { Alkamiskausityyppi, RAJAIN_TYPES } from '#/src/constants';
import { FormatoituAikaleima } from '#/src/types/HakukohdeTypes';

import { components, paths } from './konfo-backend';

export const LANGUAGES = ['fi', 'sv', 'en'] as const;

export type LanguageCode = (typeof LANGUAGES)[number];

export type Translateable = { fi?: string; sv?: string; en?: string };
export type Koodi = { koodiUri: string | null; nimi: Translateable };

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

export type ToteutustenTarjoajat = {
  count: number;
  nimi?: Translateable;
};

export type AutocompleteOption =
  | {
      label: string;
      type: 'oppilaitos';
      link: string;
    }
  | {
      label: string;
      type: 'koulutus';
      toteutustenTarjoajat?: ToteutustenTarjoajat;
      link: string;
    };

export type AutocompleteHit = { oid: string; nimi: Translateable };

export type AutocompleteResult = {
  koulutukset: {
    total: number;
    hits: Array<AutocompleteHit & { toteutustenTarjoajat?: ToteutustenTarjoajat }>;
  };
  oppilaitokset: {
    total: number;
    hits: Array<AutocompleteHit>;
  };
};

export type RequestParams = Record<string, any>;

export type ReduxTodo = any;

export type SlugIdData = {
  language: LanguageCode;
  id: string;
  englishPageVersionId?: string;
};
export type SlugsToIds = Record<string, SlugIdData>;

export type RajainName = ValueOf<typeof RAJAIN_TYPES>;

export type SearchParams = paths['/search/koulutukset']['get']['parameters']['query'];
export type KonfoKoulutustyyppi = components['schemas']['KonfoKoulutustyyppi'];

export type Suosikki = components['schemas']['SuosikitItem'];
export type VertailuSuosikki = components['schemas']['SuosikitVertailuItem'];
