import { Location, useLocation } from 'react-router-dom';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { KEEP_VALIKKO_OPEN_WIDTH } from '#/src/constants';

const getLocationPage = (location: Location) => location?.pathname?.split('/')?.[2];

const getFullUrl = (path: string) =>
  window.location.protocol + '//' + window.location.hostname + '/konfo' + path;

const getSiteImproveUrl = (location: Location) => {
  const locationString = location?.pathname + location?.hash;
  return getFullUrl(locationString.replace(/#/, '/hash/'));
};

type AppState = {
  hakutulosWidth: number;
  sideMenuOpen: boolean;
  currentPage: string | undefined;
  previousPage: string | undefined;
  currentSiteImproveUrl?: string | undefined;
  previousSiteImproveUrl?: string | undefined;
  closedHairiotiedotteetIds: Array<string>;
  setHakutulosWidth: (width: number) => void;
  setMenuState: (isOpen: boolean) => void;
  locationChanged: (location: Location) => void;
  setClosedHairiotiedotteetIds: (ids: Array<string>) => void;
};

const useAppState = create<AppState>()(
  immer((set) => ({
    hakutulosWidth: 0,
    sideMenuOpen: !(window.innerWidth < KEEP_VALIKKO_OPEN_WIDTH),
    // currentPage tallennettu vain, jotta voidaan päätellä previousPage
    currentPage: undefined,
    previousPage: undefined,
    currentSiteImproveUrl: undefined,
    previousSiteImproveUrl: undefined,
    closedHairiotiedotteetIds: [],
    setHakutulosWidth: (width: number) =>
      set((state) => {
        state.hakutulosWidth = width;
      }),
    setMenuState: (isOpen) =>
      set((state) => {
        state.sideMenuOpen = isOpen;
      }),
    locationChanged: (location: Location) =>
      set((state) => {
        const newPage = getLocationPage(location);
        const newSiteImproveLocation = getSiteImproveUrl(location);
        if (newPage !== state.currentPage) {
          state.previousPage = state.currentPage;
          state.currentPage = newPage;
        }
        if (newSiteImproveLocation !== state.currentSiteImproveUrl) {
          state.previousSiteImproveUrl = state.currentSiteImproveUrl;
          state.currentSiteImproveUrl = newSiteImproveLocation;
        }
      }),
    setClosedHairiotiedotteetIds: (ids: Array<string>) =>
      set((state) => {
        state.closedHairiotiedotteetIds = ids;
      }),
  }))
);

export const useSideMenuOpen = (): [
  AppState['sideMenuOpen'],
  AppState['setMenuState'],
] => {
  const { sideMenuOpen, setMenuState } = useAppState();
  return [sideMenuOpen, setMenuState];
};

export const usePreviousPage = () => useAppState((state) => state.previousPage);

// Käytetty useLocation():a tässä, koska Reduxiin tallennetun currentPagen käyttäminen
// aiheutti ongelmia reitityksessä
export const useCurrentPage = () => getLocationPage(useLocation());

export const usePreviousSiteImproveLocation = () =>
  useAppState((state) => state.previousSiteImproveUrl);

export const useCurrentSiteImproveLocation = () =>
  useAppState((state) => state.currentSiteImproveUrl);

export const useIsAtEtusivu = () => useCurrentPage() === '';

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
