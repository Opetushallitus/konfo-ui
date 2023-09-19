import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  forEach,
  isMatch,
  split,
  mapValues,
  pick,
  omit,
  includes,
  join,
  sortBy,
  groupBy,
  reduce,
} from 'lodash';

import {
  RAJAIN_TYPES,
  RAJAIN_TYPES_ARR_FOR_KONFO_BACKEND,
  MAKSULLISUUSTYYPPI,
} from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';
import { TODOType } from '#/src/types/common';

import { getAPIRequestParams, getHakuUrl } from './hakutulosSliceSelector';

export type RangeRajainValue<ID extends string> = {
  [id in `${ID}_max` | `${ID}_min`]: number;
};

export type RajainValues = {
  koulutustyyppi: Array<string>;
  koulutusala: Array<string>;
  opetuskieli: Array<string>;
  valintatapa: Array<string>;
  hakukaynnissa: boolean;
  jotpa: boolean;
  tyovoimakoulutus: boolean;
  taydennyskoulutus: boolean;
  hakutapa: Array<string>;
  yhteishaku: Array<string>;
  kunta: Array<string>;
  maakunta: Array<string>;
  opetustapa: Array<string>;
  pohjakoulutusvaatimus: Array<string>;
  lukiopainotukset: Array<string>; // Vain lukio-toteutusten haussa
  lukiolinjaterityinenkoulutustehtava: Array<string>; // Vain lukio-toteutusten haussa
  osaamisala: Array<string>;
  opetusaika: Array<string>;
  maksullisuus: Array<string>;
  sijainti: Array<string>;
  oppilaitos: Array<string>; // Vain toteutusten haussa
  koulutuksenkestokuukausina: RangeRajainValue<'koulutuksenkestokuukausina'>;
  maksullisuustyyppi: Array<MAKSULLISUUSTYYPPI>;
  maksunmaara: RangeRajainValue<'maksunmaara'>;
  lukuvuosimaksunmaara: RangeRajainValue<'lukuvuosimaksunmaara'>;
  apuraha: boolean;
  alkamiskausi: Array<string>;
};

export const HAKU_RAJAIMET_INITIAL = {
  koulutustyyppi: [],
  koulutusala: [],
  opetuskieli: [],
  valintatapa: [],
  hakukaynnissa: false,
  jotpa: false,
  tyovoimakoulutus: false,
  taydennyskoulutus: false,
  hakutapa: [],
  yhteishaku: [], // NOTE: tämä suodatin ei käytä koodistoarvoja vaan hakuOideja
  kunta: [],
  maakunta: [],
  opetustapa: [],
  pohjakoulutusvaatimus: [],
  lukiopainotukset: [],
  lukiolinjaterityinenkoulutustehtava: [],
  osaamisala: [],
  opetusaika: [],
  oppilaitos: [],
  maksullisuus: [],
  koulutuksenkestokuukausina: {
    koulutuksenkestokuukausina_min: 0,
    koulutuksenkestokuukausina_max: 0,
  },
  maksullisuustyyppi: [],
  maksunmaara: {
    maksunmaara_min: 0,
    maksunmaara_max: 0,
  },
  lukuvuosimaksunmaara: {
    lukuvuosimaksunmaara_min: 0,
    lukuvuosimaksunmaara_max: 0,
  },
  apuraha: false,
  alkamiskausi: [],
  sijainti: [],
};

type HakutulosSlice = {
  selectedTab: 'koulutus' | 'oppilaitos';
  size: number;
  order: 'asc' | 'desc';
  sort: 'score' | 'name';
  koulutusOffset: number;
  oppilaitosOffset: number;
  keyword: string;
} & RajainValues;

export const HAKUTULOS_INITIAL: HakutulosSlice = {
  selectedTab: 'koulutus',
  size: 20,
  order: 'desc',
  sort: 'score',

  // offset = ensimmäisen näytettävän entiteetin järjestysnumero
  // Sivunumero päätellään offsetin ja size:n perusteella
  koulutusOffset: 0,
  oppilaitosOffset: 0,

  // Persistoidut suodatinvalinnat
  keyword: '',
  ...HAKU_RAJAIMET_INITIAL,
};

export const hakutulosSlice = createSlice({
  name: 'hakutulos',
  initialState: HAKUTULOS_INITIAL,
  reducers: {
    setKeyword: (state, { payload }: PayloadAction<{ keyword: string }>) => {
      state.keyword = payload.keyword;
    },
    setSelectedTab: (
      state,
      { payload }: PayloadAction<{ newSelectedTab: 'koulutus' | 'oppilaitos' }>
    ) => {
      state.selectedTab = payload.newSelectedTab;
    },
    setRajainValues: (
      state,
      { payload: newValues }: PayloadAction<Partial<RajainValues>>
    ) => {
      Object.assign(state, newValues);
      resetPagination();
    },
    resetPagination: (state) => {
      state.koulutusOffset = 0;
      state.oppilaitosOffset = 0;
    },
    clearRajainValues: (state) => {
      Object.assign(state, HAKU_RAJAIMET_INITIAL);
      resetPagination();
    },
    setSize: (state, { payload }) => {
      state.size = payload.newSize;
      // Asetetaan sivutus alkuun, koska sivuja voi olla vähemmän kuin aiemmin
      resetPagination();
    },
    setKoulutusOffset: (state, { payload }) => {
      state.koulutusOffset = payload.offset;
    },
    setOppilaitosOffset: (state, { payload }) => {
      state.oppilaitosOffset = payload.offset;
    },
    setOrder: (state, { payload }) => {
      state.order = payload;
    },
    setSort: (state, { payload }) => {
      state.sort = payload;
    },
    setSortOrder: (state, { payload }) => {
      const [sort, order] = payload.split('_');
      state.sort = sort;
      state.order = order;
    },
    urlParamsChanged(state, { payload }) {
      const { keyword, search } = payload;
      const params = { keyword, ...search };
      const apiRequestParams = getAPIRequestParams({ hakutulos: state } as TODOType);
      const cleanedParams = getCleanUrlSearch(params, apiRequestParams);

      state.selectedTab = params?.tab ?? 'koulutus';

      if (!isMatch(apiRequestParams, cleanedParams)) {
        forEach(omit(cleanedParams, minmaxParams(cleanedParams)), (value, key) => {
          const valueList = split(value, ',');
          switch (key) {
            case 'keyword':
            case 'size':
            case 'order':
            case 'sort':
              state[key] = value;
              break;
            case RAJAIN_TYPES.SIJAINTI:
              state.maakunta = valueList.filter((v) => v.startsWith('maakunta'));
              state.kunta = valueList.filter((v) => v.startsWith('kunta'));
              break;
            case RAJAIN_TYPES.HAKUKAYNNISSA:
            case RAJAIN_TYPES.JOTPA:
            case RAJAIN_TYPES.TYOVOIMAKOULUTUS:
            case RAJAIN_TYPES.TAYDENNYSKOULUTUS:
            case RAJAIN_TYPES.APURAHA:
              Object.assign(state, { [key]: value === 'true' });
              break;
            default:
              Object.assign(state, { [key]: valueList });
              break;
          }
        });
        Object.assign(state, groupMinMaxParams(cleanedParams));
      }
    },
  },
});

export const {
  setKeyword,
  setSelectedTab,
  setRajainValues,
  resetPagination,
  clearRajainValues,
  setOrder,
  setSort,
  setSortOrder,
  setSize,
  setKoulutusOffset,
  setOppilaitosOffset,
  urlParamsChanged,
} = hakutulosSlice.actions;

export const navigateToHaku =
  ({ navigate }: TODOType) =>
  (_dispatch: TODOType, getState: TODOType) => {
    const state = getState();
    const url = getHakuUrl(state);
    navigate('/' + getLanguage() + url);
  };

const getCleanUrlSearch = (search: TODOType, apiRequestParams: TODOType) =>
  mapValues(pick(search, Object.keys(apiRequestParams ?? {})), (value, key) =>
    includes(RAJAIN_TYPES_ARR_FOR_KONFO_BACKEND, key)
      ? join(sortBy(split(value, ',')), ',')
      : value
  );

const minmaxParams = (allParams: TODOType) =>
  Object.keys(allParams).filter((k) => k.endsWith('_min') || k.endsWith('_max'));

const groupMinMaxParams = (params: TODOType) => {
  const groupedParamNames = groupBy(minmaxParams(params), (param) => param.split('_')[0]);
  return mapValues(groupedParamNames, (val) =>
    reduce(
      val,
      (obj, param) => {
        obj[param] = params[param];
        return obj;
      },
      {} as TODOType
    )
  );
};
