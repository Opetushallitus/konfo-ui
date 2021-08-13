import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import _fp from 'lodash/fp';

import {
  getKoulutus,
  getKoulutusKuvaus,
  getKoulutusJarjestajat,
  getSuositellutKoulutukset,
  getEperusteKuvaus,
} from '#/src/api/konfoApi';
import { KOULUTUS_TYYPPI } from '#/src/constants';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

export const initialState = {
  koulutusStatus: IDLE_STATUS,
  jarjestajatStatus: IDLE_STATUS,
  tulevatJarjestajatStatus: IDLE_STATUS,
  suositellutKoulutuksetStatus: IDLE_STATUS,
  koulutukset: {},
  jarjestajat: [],
  jarjestajatFilters: {},
  tulevatJarjestajat: {},
  suositellutKoulutukset: {},
  koulutusError: null,
  jarjestajatError: null,
  suositellutKoulutuksetError: null,
};

const koulutusSlice = createSlice({
  name: 'koulutus',
  initialState,
  reducers: {
    fetchKoulutusStart(state) {
      if (state.koulutusStatus === IDLE_STATUS) {
        state.koulutusStatus = LOADING_STATUS;
      }
    },
    fetchSuositellutKoulutuksetStart(state) {
      if (state.suositellutKoulutuksetStatus === IDLE_STATUS) {
        state.suositellutKoulutuksetStatus = LOADING_STATUS;
      }
    },
    fetchJarjestajatStart(state) {
      if (state.jarjestajatStatus === IDLE_STATUS) {
        state.jarjestajatStatus = LOADING_STATUS;
      }
    },
    fetchTulevatJarjestajatStart(state) {
      if (state.tulevatJarjestajatStatus === IDLE_STATUS) {
        state.tulevatJarjestajatStatus = LOADING_STATUS;
      }
    },
    fetchKoulutusSuccess(state, { payload }) {
      if (state.koulutusStatus === LOADING_STATUS) {
        const { koulutus, oid } = payload;
        state.koulutukset[oid] = koulutus;
        state.error = null;
        state.koulutusStatus = IDLE_STATUS;
      }
    },
    fetchSuositellutKoulutuksetSuccess(state, { payload }) {
      if (state.suositellutKoulutuksetStatus === LOADING_STATUS) {
        state.suositellutKoulutukset = payload.suositellutKoulutuksetData;
        state.suositellutKoulutuksetError = null;
        state.suositellutKoulutuksetStatus = IDLE_STATUS;
      }
    },
    fetchJarjestajatSuccess(state, { payload }) {
      if (state.jarjestajatStatus === LOADING_STATUS) {
        const { jarjestajatData } = payload;
        state.jarjestajat = jarjestajatData.hits;
        state.jarjestajatFilters = jarjestajatData.filters;
        state.error = null;
        state.jarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchJarjestajatError(state, action) {
      if (state.jarjestajatStatus === LOADING_STATUS) {
        state.jarjestajatError = action.payload;
        state.jarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchTulevatJarjestajatSuccess(state, { payload }) {
      if (state.tulevatJarjestajatStatus === LOADING_STATUS) {
        const { tulevatJarjestajat, oid } = payload;
        state.tulevatJarjestajat[oid] = tulevatJarjestajat;
        state.error = null;
        state.tulevatJarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchTulevatJarjestajatError(state, action) {
      if (state.tulevatJarjestajatStatus === LOADING_STATUS) {
        state.tulevatJarjestajatError = action.payload;
        state.tulevatJarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchKoulutusError(state, action) {
      if (state.koulutusStatus === LOADING_STATUS) {
        state.koulutusError = action.payload;
        state.koulutusStatus = IDLE_STATUS;
      }
    },
    fetchSuositellutKoulutuksetError(state, action) {
      if (state.suositellutKoulutuksetStatus === LOADING_STATUS) {
        state.suositellutKoulutuksetError = action.payload;
        state.suositellutKoulutuksetStatus = IDLE_STATUS;
      }
    },
  },
});

export const {
  fetchKoulutusStart,
  fetchSuositellutKoulutuksetStart,
  fetchJarjestajatStart,
  fetchTulevatJarjestajatStart,
  fetchKoulutusSuccess,
  fetchSuositellutKoulutuksetSuccess,
  fetchJarjestajatSuccess,
  fetchTulevatJarjestajatSuccess,
  fetchKoulutusError,
  fetchSuositellutKoulutuksetError,
  fetchJarjestajatError,
  fetchTulevatJarjestajatError,
} = koulutusSlice.actions;
export default koulutusSlice.reducer;

export const fetchKoulutus = (oid, draft) => async (dispatch) => {
  try {
    dispatch(fetchKoulutusStart());
    const koulutusData = await getKoulutus(oid, draft);
    if (
      (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM && koulutusData.ePerusteId) ||
      (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_OSAAMISALA &&
        koulutusData.ePerusteId)
    ) {
      const koulutusKuvausData = await getKoulutusKuvaus(koulutusData.ePerusteId);
      _.set(koulutusData, 'metadata.kuvaus', koulutusKuvausData);
    } else if (koulutusData?.koulutustyyppi === KOULUTUS_TYYPPI.AMM_TUTKINNON_OSA) {
      const tutkinnonOsat = koulutusData?.metadata?.tutkinnonOsat ?? [];
      const eperusteet = _.uniq(tutkinnonOsat.map((t) => t.ePerusteId));

      let e = [];
      for (const index in eperusteet) {
        const id = eperusteet[index];
        const eperuste = await getEperusteKuvaus(id);
        e.push(eperuste);
      }

      let yksikko = tutkinnonOsat[0]?.opintojenLaajuusyksikko;
      let pisteet = tutkinnonOsat
        .map((tutkinnonOsa) => tutkinnonOsa.opintojenLaajuusNumero)
        .join(' + ');

      _.set(koulutusData, 'metadata.opintojenLaajuusyksikko', yksikko);
      _.set(koulutusData, 'metadata.opintojenLaajuus', {
        nimi: {
          sv: pisteet,
          fi: pisteet,
          en: pisteet,
        },
      });

      _.set(koulutusData, 'eperusteet', e);
    }
    dispatch(fetchKoulutusSuccess({ oid, koulutus: koulutusData }));
  } catch (err) {
    dispatch(fetchKoulutusError(err.toString()));
  }
};

export const fetchSuositellutKoulutukset = (oid) => async (dispatch) => {
  try {
    dispatch(fetchSuositellutKoulutuksetStart());
    const suositellutKoulutuksetData = await getSuositellutKoulutukset({
      koulutukset: oid,
    });
    dispatch(fetchSuositellutKoulutuksetSuccess({ oid, suositellutKoulutuksetData }));
  } catch (error) {}
};

export const fetchKoulutusJarjestajat = (oid, requestParams) => async (dispatch) => {
  try {
    dispatch(fetchJarjestajatStart());

    // TODO: This does not use paging but backend presumes so? Does this only show first 20 toteutukses?
    const jarjestajatData = await getKoulutusJarjestajat(oid, {
      ...requestParams,
      size: 100,
    });
    dispatch(fetchJarjestajatSuccess({ jarjestajatData }));
  } catch (err) {
    dispatch(fetchJarjestajatError(err.toString()));
  }
};

export const fetchTulevatJarjestajat = (oid) => async (dispatch) => {
  try {
    dispatch(fetchTulevatJarjestajatStart());

    // TODO: This does not use paging but backend presumes so? Does this only show first 20 toteutukses?
    const tulevatJarjestajat = await getKoulutusJarjestajat(oid, {
      tuleva: true,
      size: 100,
    });
    dispatch(
      fetchTulevatJarjestajatSuccess({
        oid,
        tulevatJarjestajat,
      })
    );
  } catch (err) {
    dispatch(fetchTulevatJarjestajatError(err.toString()));
  }
};

export const fetchKoulutusWithRelatedData = (oid, draft) => {
  return (dispatch) => {
    Promise.all([
      dispatch(fetchKoulutus(oid, draft)),
      // NOTE: Suosittelu API is not available in any environment currently.
      // TODO: Remove suosittelu code if it's not meant to be used anymore.
      //dispatch(fetchSuositellutKoulutukset(oid)),
      dispatch(fetchTulevatJarjestajat(oid)),
    ]);
  };
};

export const selectKoulutus = (oid) => (state) => {
  const koulutusData = state.koulutus.koulutukset[oid];
  if (koulutusData) {
    return {
      kuvaus: koulutusData.metadata?.kuvaus,
      linkkiEPerusteisiin: koulutusData.metadata?.linkkiEPerusteisiin,
      eperusteet: koulutusData.eperusteet,
      ePerusteId: koulutusData?.ePerusteId,
      tutkinnonOsat: koulutusData.metadata?.tutkinnonOsat,
      tyotehtavatJoissaVoiToimia:
        koulutusData.metadata?.kuvaus?.tyotehtavatJoissaVoiToimia,
      suorittaneenOsaaminen: koulutusData.metadata?.kuvaus?.suorittaneenOsaaminen,
      koulutusAla: koulutusData.metadata?.koulutusala,
      tutkintoNimi: koulutusData?.nimi,
      tutkintoNimikkeet: koulutusData.metadata?.tutkintonimike,
      opintojenLaajuus: koulutusData.metadata?.opintojenLaajuus,
      opintojenLaajuusNumero: koulutusData.metadata?.opintojenLaajuusNumero,
      opintojenLaajuusyksikko: koulutusData.metadata?.opintojenLaajuusyksikko,
      koulutusTyyppi: koulutusData.metadata?.tyyppi,
      lisatiedot: koulutusData.metadata?.lisatiedot,
      teemakuva: koulutusData?.teemakuva,
      sorakuvaus: koulutusData?.sorakuvaus,
    };
  } else {
    return undefined;
  }
};

export const selectSuositellutKoulutukset = (state) =>
  state.koulutus.suositellutKoulutukset;

export const selectLoading = (state) =>
  state.koulutus.koulutusStatus === LOADING_STATUS ||
  state.koulutus.tulevatJarjestajatStatus === LOADING_STATUS;

export const selectTulevatJarjestajat = (state, oid) =>
  state.koulutus.tulevatJarjestajat[oid]?.hits;

export const selectJarjestajat = (state) => {
  // Ei näytetä järjestäjälistassa sellaisia suodattimia joiden lukumäärä on 0 (niitä on paljon)
  const sortedFilters = _.mapValues(
    state.koulutus.jarjestajatFilters || {},
    _fp.pickBy((v) => !_fp.isObject(v) || v.count > 0)
  );

  return {
    jarjestajat: state.koulutus.jarjestajat,
    loading: state.koulutus.jarjestajatStatus === LOADING_STATUS,
    sortedFilters,
  };
};
