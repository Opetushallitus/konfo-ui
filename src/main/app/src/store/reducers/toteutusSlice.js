import { createSlice } from '@reduxjs/toolkit';
import _fp from 'lodash/fp';

import { getToteutus } from '#/src/api/konfoApi';
import { HAKULOMAKE_TYYPPI } from '#/src/constants';
import { isHakuAuki, isHakuTimeRelevant } from '#/src/tools/hakuaikaUtils';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

export const initialState = {
  status: IDLE_STATUS,
  toteutukset: {},
  error: null,
};

const toteutusSlice = createSlice({
  name: 'toteutus',
  initialState,
  reducers: {
    fetchToteutusStart(state) {
      if (state.status === IDLE_STATUS) {
        state.status = LOADING_STATUS;
      }
    },
    fetchToteutusSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        state.toteutukset[payload.oid] = payload;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    fetchToteutusFail(state, action) {
      if (state.koulutusStatus === LOADING_STATUS) {
        state.error = action.payload;
        state.status = IDLE_STATUS;
      }
    },
  },
});

export const {
  fetchToteutusStart,
  fetchToteutusSuccess,
  fetchToteutusFail,
} = toteutusSlice.actions;

export default toteutusSlice.reducer;

export const fetchToteutus = (oid, isDraft) => async (dispatch) => {
  try {
    dispatch(fetchToteutusStart());
    const data = await getToteutus(oid, isDraft);
    dispatch(fetchToteutusSuccess(data));
  } catch (err) {
    dispatch(fetchToteutusFail(err.toString()));
  }
};

const getWithoutVersion = (koodi) => koodi.slice(0, koodi.lastIndexOf('#'));

const getHakukohteetWithTypes = (toteutus) => {
  const hakutavat = _fp.flow(
    _fp.map(_fp.prop('hakutapa')),
    _fp.sortBy('koodiUri'),
    _fp.uniqBy('koodiUri')
  )(toteutus.hakutiedot);

  // Konfossa halutaan näyttää hakukohteet hakutyypeittäin, ei per haku
  return hakutavat.reduce(
    (a, hakutapa) => ({
      ...a,
      [getWithoutVersion(hakutapa.koodiUri)]: {
        nimi: hakutapa.nimi,
        hakukohteet: toteutus.hakutiedot
          .filter((hakutieto) => hakutieto.hakutapa.koodiUri === hakutapa.koodiUri)
          .flatMap((hakutieto) => hakutieto.hakukohteet)
          .filter((hakukohde) => isHakuTimeRelevant(hakukohde.hakuajat))
          .map((hakukohde) => ({
            ...hakukohde,
            isHakuAuki: isHakuAuki(hakukohde.hakuajat),
          })),
      },
    }),
    {}
  );
};

export const selectLoading = (state) => state.toteutus.status === LOADING_STATUS;
export const selectHakukohteet = (oid) => (state) => {
  const toteutus = selectToteutus(oid)(state);
  if (!toteutus || toteutus.hasMuuHaku || toteutus.hasEiSahkoistaHaku) {
    return {};
  }

  return getHakukohteetWithTypes(toteutus);
};

export const selectMuuHaku = (oid) => (state) => {
  const toteutus = selectToteutus(oid)(state);
  const hakuAuki = isHakuAuki([toteutus.metadata.hakuaika]);

  // TODO: SORA-kuvaus - atm. we only get an Id from the API but we cannot do anything with it
  return {
    ..._fp.pick(
      [
        'aloituspaikat',
        'hakuaika',
        'hakulomakeLinkki',
        'hakutermi',
        'lisatietoaHakeutumisesta',
        'lisatietoaValintaperusteista',
      ],
      toteutus.metadata
    ),
    isHakuAuki: hakuAuki,
    nimi: toteutus.nimi,
    // TODO: we do not get osoite from the API atm. so just use all the tarjoajat to fetch oppilaitoksenOsat
    // This should be replaced with just the osoite when we have it in the API
    tarjoajat: toteutus.tarjoajat,
  };
};

export const selectEiSahkoistaHaku = (oid) => (state) => {
  const toteutus = selectToteutus(oid)(state);
  return {
    ..._fp.pick(['lisatietoaHakeutumisesta'], toteutus.metadata),
  };
};

const getHakuAukiType = (toteutus) => {
  if (toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.EI_SAHKOISTA) {
    return null;
  }
  if (toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.MUU) {
    return isHakuAuki([toteutus.metadata.hakuaika]) ? 'ilmoittautuminen' : null;
  }

  const hakuKohdeAuki = toteutus.hakutiedot
    ?.map((hakutieto) => hakutieto.hakukohteet)
    .flat()
    .some((hakukohde) => isHakuAuki(hakukohde.hakuajat));

  return hakuKohdeAuki ? 'hakukohde' : null;
};

export const selectToteutus = (oid) => (state) => {
  const toteutus = state.toteutus.toteutukset[oid];
  return (
    toteutus && {
      ...toteutus,
      hasMuuHaku: toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.MUU,
      hasEiSahkoistaHaku:
        toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKE_TYYPPI.EI_SAHKOISTA,
      hakuAukiType: getHakuAukiType(toteutus),
    }
  );
};
