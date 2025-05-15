import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { isEqual, merge, pick } from 'lodash';

import { RootState } from '#/src/store';
import { getPaginationPage } from '#/src/tools/utils';

import { HAKU_RAJAIMET_INITIAL, RajainValues } from './hakutulosSlice';
import { TOTEUTUS_RAJAIN_NAMES } from './hakutulosSliceSelector';

const initialPagination = {
  size: 5,
  offset: 0,
};

export type Pagination = Partial<typeof initialPagination>;

export const initialState = {
  tulevatJarjestajat: {
    rajainValues: pick(HAKU_RAJAIMET_INITIAL, TOTEUTUS_RAJAIN_NAMES),
    pagination: {
      ...initialPagination,
    },
  },
  jarjestajat: {
    rajainValues: pick(HAKU_RAJAIMET_INITIAL, TOTEUTUS_RAJAIN_NAMES),
    pagination: {
      ...initialPagination,
    },
  },
};

export const koulutusSlice = createSlice({
  name: 'koulutus',
  initialState,
  reducers: {
    setJarjestajatRajainValues(
      state,
      {
        payload,
      }: PayloadAction<{ isTuleva: boolean; rajainValues?: Partial<RajainValues> }>
    ) {
      const { rajainValues, isTuleva } = payload;
      const jarjestajat = isTuleva ? state.tulevatJarjestajat : state.jarjestajat;
      if (rajainValues) {
        const { koulutustyyppi } = rajainValues;
        const tuvaErityisopetus = koulutustyyppi?.includes('tuva-erityisopetus');
        const ammErityisopetus = koulutustyyppi?.includes('koulutustyyppi_4');
        const newRajainValues = Object.assign(
          {},
          jarjestajat.rajainValues,
          rajainValues,
          { amm_erityisopetus: ammErityisopetus },
          { tuva_erityisopetus: tuvaErityisopetus }
        );
        // Resetoidaan sivutus, jos rajaimet muuttuu
        if (!isEqual(jarjestajat.rajainValues, newRajainValues)) {
          state.jarjestajat.pagination.offset = 0;
        }
        jarjestajat.rajainValues = newRajainValues;
      }
    },
    setJarjestajatPaging(
      state,
      { payload }: PayloadAction<{ isTuleva: boolean; pagination: Pagination }>
    ) {
      if (payload.pagination) {
        const jarjestajatKey = payload.isTuleva ? 'tulevatJarjestajat' : 'jarjestajat';
        merge(state[jarjestajatKey].pagination, payload.pagination);
      }
    },
    clearJarjestajatRajainValues(
      state,
      { payload }: PayloadAction<{ isTuleva: boolean }>
    ) {
      const jarjestajatKey = payload.isTuleva ? 'tulevatJarjestajat' : 'jarjestajat';
      Object.assign(state[jarjestajatKey], initialState[jarjestajatKey]);
    },
  },
});

export const {
  setJarjestajatRajainValues,
  setJarjestajatPaging,
  clearJarjestajatRajainValues,
} = koulutusSlice.actions;

const selectKoulutusJarjestajat = (state: RootState) => state?.koulutus?.jarjestajat;
const selectKoulutusTulevatJarjestajat = (state: RootState) =>
  state?.koulutus?.tulevatJarjestajat;

export const selectJarjestajatQuery = createSelector(
  [
    selectKoulutusJarjestajat,
    selectKoulutusTulevatJarjestajat,
    (_state: RootState, isTuleva: boolean) => isTuleva,
  ],
  (jarjestajat, tulevatJarjestajat, isTuleva) => {
    const selectedJarjestajat = isTuleva ? tulevatJarjestajat : jarjestajat;
    const { pagination } = selectedJarjestajat;
    return {
      ...selectedJarjestajat,
      pagination: {
        ...pagination,
        page: getPaginationPage({
          offset: pagination.offset,
          size: pagination.size,
        }),
      },
    };
  }
);
