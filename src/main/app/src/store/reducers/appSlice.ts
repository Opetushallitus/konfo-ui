import { Location, useLocation } from 'react-router-dom';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

const getLocationPage = (location: Location) => location?.pathname?.split('/')?.[2];

type AppState = {
  hakutulosWidth: number;
  isSideMenuOpen: boolean;
  currentPage: string | undefined;
  previousPage: string | undefined;
  closedHairiotiedotteetIds: Array<string>;
  setHakutulosWidth: (width: number) => void;
  setIsSideMenuOpen: (isOpen: boolean) => void;
  locationChanged: (location: Location) => void;
  setClosedHairiotiedotteetIds: (ids: Array<string>) => void;
};

const useAppState = create<AppState>()(
  immer((set) => ({
    hakutulosWidth: 0,
    isSideMenuOpen: window.innerWidth >= KEEP_VALIKKO_OPEN_WIDTH,
    // currentPage tallennettu vain, jotta voidaan päätellä previousPage
    currentPage: undefined,
    previousPage: undefined,
    closedHairiotiedotteetIds: [],
    setHakutulosWidth: (width: number) =>
      set((state) => {
        state.hakutulosWidth = width;
      }),
    setIsSideMenuOpen: (isOpen) =>
      set((state) => {
        state.isSideMenuOpen = isOpen;
      }),
    locationChanged: (location: Location) =>
      set((state) => {
        const newPage = getLocationPage(location);
        if (newPage !== state.currentPage) {
          state.previousPage = state.currentPage;
          state.currentPage = newPage;
        }
      }),
    setClosedHairiotiedotteetIds: (ids: Array<string>) =>
      set((state) => {
        state.closedHairiotiedotteetIds = ids;
      }),
  }))
);

export const useIsSideMenuOpen = (): [
  AppState['isSideMenuOpen'],
  AppState['setIsSideMenuOpen'],
] => {
  const { isSideMenuOpen, setIsSideMenuOpen } = useAppState();
  return [isSideMenuOpen, setIsSideMenuOpen];
};

export const usePreviousPage = () => useAppState((state) => state.previousPage);

// Käytetty useLocation():a tässä, koska Reduxiin tallennetun currentPagen käyttäminen
// aiheutti ongelmia reitityksessä
export const useCurrentPage = () => getLocationPage(useLocation());

// Nykyinen etusivu ('') tai uusi etusivu ('etusivu')
export const useIsAtEtusivu = () => {
  const page = useCurrentPage();
  return page === '' || page === 'etusivu';
};

export const useClosedHairioTiedotteet = (): [
  AppState['closedHairiotiedotteetIds'],
  AppState['setClosedHairiotiedotteetIds'],
] => {
  const { closedHairiotiedotteetIds, setClosedHairiotiedotteetIds } = useAppState();
  return [closedHairiotiedotteetIds, setClosedHairiotiedotteetIds];
};

export const useHakutulosWidth = (): [
  AppState['hakutulosWidth'],
  AppState['setHakutulosWidth'],
] => {
  const { hakutulosWidth, setHakutulosWidth } = useAppState();
  return [hakutulosWidth, setHakutulosWidth];
};

export const useLocationChanged = () => useAppState((state) => state.locationChanged);
