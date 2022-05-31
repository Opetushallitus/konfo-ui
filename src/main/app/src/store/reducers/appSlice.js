import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

const getLocationPage = (location) => _.split(location?.pathname, '/')?.[2];

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    sideMenuOpen: !(window.innerWidth < KEEP_VALIKKO_OPEN_WIDTH),
    // currentPage tallennettu vain, jotta voidaan päätellä previousPage
    currentPage: undefined,
    previousPage: undefined,
  },
  reducers: {
    setMenuState: (state, action) => {
      state.sideMenuOpen = action.payload;
    },
    locationChanged: (state, { payload }) => {
      const newPage = getLocationPage(payload);
      if (newPage !== state.currentPage) {
        state.previousPage = state.currentPage;
        state.currentPage = newPage;
      }
    },
  },
});

export const useMenuOpen = () => useSelector((state) => state.app.sideMenuOpen);

export const usePreviousPage = () => useSelector((state) => state.app.previousPage);

// Käytetty useLocation():a tässä, koska Reduxiin tallennetun currentPagen käyttäminen
// aiheutti ongelmia reitityksessä
export const useCurrentPage = () => getLocationPage(useLocation());

export const useIsAtEtusivu = () => useCurrentPage() === '';

export const { setMenuState, locationChanged } = appSlice.actions;

export default appSlice.reducer;
