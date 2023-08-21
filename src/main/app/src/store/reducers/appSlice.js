import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

const getLocationPage = (location) => location?.pathname?.split('/')?.[2];

const getFullUrl = (location) =>
  window.location.protocol + '//' + window.location.hostname + '/konfo' + location;

const getSiteImproveUrl = (location) => {
  const locationString = location?.pathname + location?.hash;
  return getFullUrl(locationString.replace(/#/, '/hash/'));
};

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    hakutulosWidth: 0,
    sideMenuOpen: !(window.innerWidth < KEEP_VALIKKO_OPEN_WIDTH),
    // currentPage tallennettu vain, jotta voidaan päätellä previousPage
    currentPage: undefined,
    previousPage: undefined,
    currentSiteImproveUrl: undefined,
    previousSiteImproveUrl: undefined,
  },
  reducers: {
    setHakutulosWidth: (state, action) => {
      state.hakutulosWidth = action.payload;
    },
    setMenuState: (state, action) => {
      state.sideMenuOpen = action.payload;
    },
    locationChanged: (state, { payload }) => {
      const newPage = getLocationPage(payload);
      const newSiteImproveLocation = getSiteImproveUrl(payload);
      if (newPage !== state.currentPage) {
        state.previousPage = state.currentPage;
        state.currentPage = newPage;
      }
      if (newSiteImproveLocation !== state.currentSiteImproveUrl) {
        state.previousSiteImproveUrl = state.currentSiteImproveUrl;
        state.currentSiteImproveUrl = newSiteImproveLocation;
      }
    },
  },
});

export const useMenuOpen = () => useSelector((state) => state.app.sideMenuOpen);

export const usePreviousPage = () => useSelector((state) => state.app.previousPage);

// Käytetty useLocation():a tässä, koska Reduxiin tallennetun currentPagen käyttäminen
// aiheutti ongelmia reitityksessä
export const useCurrentPage = () => getLocationPage(useLocation());

export const usePreviousSiteImproveLocation = () =>
  useSelector((state) => state.app.previousSiteImproveUrl);

export const useCurrentSiteImproveLocation = () =>
  useSelector((state) => state.app.currentSiteImproveUrl);

export const useIsAtEtusivu = () => useCurrentPage() === '';

export const { setMenuState, locationChanged, setHakutulosWidth } = appSlice.actions;

export const useHakutulosWidth = () => {
  const width = useSelector((state) => state.app.hakutulosWidth);
  const dispatch = useDispatch();

  return [width, (newWidth) => dispatch(setHakutulosWidth(newWidth))];
};
