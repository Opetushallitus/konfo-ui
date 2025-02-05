import Cookies from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { COOKIES } from '#/src/constants';

interface CookieConsentState {
  isMandatoryCookiesAccepted: boolean;
  isStatisticsCookiesAccepted: boolean;
  isCookieModalShown: boolean;
  acceptMandatoryCookies: () => void;
  acceptStatisticsCookies: () => void;
  setCookieModalVisible: (isShown: boolean) => void;
}

export const useCookieConsentState = create<CookieConsentState>()(
  persist(
    (set) => ({
      isMandatoryCookiesAccepted: Boolean(Cookies.get(COOKIES.MANDATORY_COOKIE_NAME)),
      isStatisticsCookiesAccepted: Boolean(Cookies.get(COOKIES.STATISTICS_COOKIE_NAME)),
      isCookieModalShown: false,

      acceptMandatoryCookies: () => {
        Cookies.set(COOKIES.MANDATORY_COOKIE_NAME, 'true', { expires: 1800 });
        set({ isMandatoryCookiesAccepted: true });
      },

      acceptStatisticsCookies: () => {
        Cookies.set(COOKIES.STATISTICS_COOKIE_NAME, 'true', { expires: 1800 });
        set({ isStatisticsCookiesAccepted: true });
      },

      setCookieModalVisible: (isShown: boolean) => set({ isCookieModalShown: isShown }),
    }),
    {
      name: 'cookies-info-storage',
      getStorage: () => sessionStorage,
    }
  )
);
