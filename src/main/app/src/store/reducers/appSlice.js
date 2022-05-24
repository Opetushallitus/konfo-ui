import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    sideMenuOpen: !(window.innerWidth < KEEP_VALIKKO_OPEN_WIDTH),
    currentLocation: {},
    previousLocation: {},
  },
  reducers: {
    setMenuState: (state, action) => {
      state.sideMenuOpen = action.payload;
    },
    setCurrentLocation: (state, { payload }) => {
      state.previousLocation = state.currentLocation;
      state.currentLocation = payload.currentLocation;
    },
  },
});

export const usePreviousLocation = () =>
  useSelector((state) => state.app.previousLocation);

const getLocationPage = (location) => _.split(location?.pathname, '/')?.[2];

export const usePreviousPage = () => getLocationPage(usePreviousLocation());

export const useCurrentLocation = () => useSelector((state) => state.app.currentLocation);

export const useCurrentPage = () => getLocationPage(useCurrentLocation());

export const useMenuOpen = () => useSelector((state) => state.app.sideMenuOpen);

export const useIsAtEtusivu = () => useCurrentPage() === '';

export const { setMenuState, setCurrentLocation } = appSlice.actions;

export default appSlice.reducer;
