import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { forEach, split, mapValues, includes, noop, isEqual } from 'lodash';
import { match } from 'ts-pattern';

import { RAJAIN_TYPES, MAKSULLISUUSTYYPPI } from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';
import { sortArray } from '#/src/tools/utils';
import { KonfoKoulutustyyppi, TODOType } from '#/src/types/common';

import { getHakuUrl } from './hakutulosSliceSelector';

export type RangeRajainValue<ID extends string> = {
  [id in `${ID}_max` | `${ID}_min`]: number;
};

export type RajainValues = {
  koulutustyyppi: Array<KonfoKoulutustyyppi>;
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
  hakualkaapaivissa: Array<string>;
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
  hakualkaapaivissa: [],
};

export type HakutulosSlice = {
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

const setWhenChanged = (state: any, key: string, value: any) => {
  if (!isEqual(state[key], value)) {
    state[key] = value;
  }
};

const getParamValueList = (value?: string) => sortArray(split(value, ','));

const resetOffset = (state: HakutulosSlice) => {
  state.koulutusOffset = 0;
  state.oppilaitosOffset = 0;
};

export const hakutulosSlice = createSlice({
  name: 'hakutulos',
  initialState: HAKUTULOS_INITIAL,
  reducers: {
    setKeyword: (state, { payload }: PayloadAction<{ keyword: string }>) => {
      state.keyword = payload.keyword;
      resetOffset(state);
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
      Object.assign(
        state,
        mapValues(newValues, (v) => (Array.isArray(v) ? sortArray(v) : v))
      );
      resetOffset(state);
    },
    resetPagination: (state) => {
      resetOffset(state);
    },
    clearRajainValues: (state) => {
      Object.assign(state, HAKU_RAJAIMET_INITIAL);
      resetOffset(state);
    },
    setSize: (state, { payload }) => {
      state.size = payload.newSize;
      // Asetetaan sivutus alkuun, koska sivuja voi olla vähemmän kuin aiemmin
      resetOffset(state);
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

      state.selectedTab = params?.tab ?? 'koulutus';

      forEach(params, (value, key) => {
        match(key)
          .with('keyword', 'size', 'order', 'sort', () => {
            Object.assign(state, { [key]: value });
          })
          .with(RAJAIN_TYPES.SIJAINTI, () => {
            const valueList = getParamValueList(value);
            setWhenChanged(
              state,
              'maakunta',
              valueList.filter((v) => v.startsWith('maakunta'))
            );
            setWhenChanged(
              state,
              'kunta',
              valueList.filter((v) => v.startsWith('kunta'))
            );
          })
          .with(
            RAJAIN_TYPES.HAKUKAYNNISSA,
            RAJAIN_TYPES.JOTPA,
            RAJAIN_TYPES.TYOVOIMAKOULUTUS,
            RAJAIN_TYPES.TAYDENNYSKOULUTUS,
            RAJAIN_TYPES.APURAHA,
            () => {
              Object.assign(state, { [key]: value === 'true' });
            }
          )
          .with(
            'lukuvuosimaksunmaara_min',
            'lukuvuosimaksunmaara_max',
            'maksunmaara_min',
            'maksunmaara_max',
            'koulutuksenkestokuukausina_min',
            'koulutuksenkestokuukausina_max',
            () => {
              const rajainKey = key.split('_')?.[0];
              const minKey = `${rajainKey}_min`;
              const maxKey = `${rajainKey}_max`;

              setWhenChanged(state, rajainKey, {
                [minKey]: params[minKey],
                [maxKey]: params[maxKey],
              });
            }
          )
          .when(
            () => includes(Object.values(RAJAIN_TYPES), key),
            () => {
              const valueList = getParamValueList(value);
              setWhenChanged(state, key, valueList);
            }
          )
          .otherwise(noop);
      });
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
