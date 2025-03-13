import Cookies from 'js-cookie';
import { create } from 'zustand';

import { COOKIES } from '#/src/constants';

interface CookieConsentState {
  isCookieModalVisible: boolean;
  isCookieDrawerVisible: boolean;
  setCookieModalVisibility: (isShown: boolean) => void;
  setCookieDrawerVisibility: (isVisible: boolean) => void;
  saveCookieConsent: ({ statistics }: { statistics: boolean }) => void;
}

export const useCookieConsentState = create<CookieConsentState>()((set) => ({
  isCookieDrawerVisible: !Cookies.get(COOKIES.MANDATORY_COOKIE_NAME),
  setCookieDrawerVisibility: (isVisible) => set({ isCookieDrawerVisible: isVisible }),
  isCookieModalVisible: false,
  setCookieModalVisibility: (isVisible) => set({ isCookieModalVisible: isVisible }),
  saveCookieConsent: ({ statistics }) => {
    Cookies.set(COOKIES.MANDATORY_COOKIE_NAME, 'true', { expires: 1800 });
    if (statistics) {
      Cookies.set(COOKIES.STATISTICS_COOKIE_NAME, 'true', { expires: 1800 });
    }
    set({
      isCookieDrawerVisible: false,
      isCookieModalVisible: false,
    });
  },
}));
