import Cookies from 'js-cookie';
import { create } from 'zustand';

import { COOKIES } from '#/src/constants';

interface CookieInfoState {
  isMandatoryCookiesAccepted: boolean;
  isStatisticsCookiesAccepted: boolean;
  isCookieModalShown: boolean;
  acceptMandatoryCookies: () => void;
  acceptStatisticsCookies: () => void;
  setCookieModalShown: (isShown: boolean) => void;
}

export const useCookiesInfo = create<CookieInfoState>((set) => ({
  isMandatoryCookiesAccepted: Boolean(Cookies.get(COOKIES.MANDATORY_COOKIE_NAME)),
  isStatisticsCookiesAccepted: Boolean(Cookies.get(COOKIES.STATISTICS_COOKIE_NAME)),
  isCookieModalShown: false,
  acceptMandatoryCookies: () => set(() => ({ isMandatoryCookiesAccepted: true })),
  acceptStatisticsCookies: () => set(() => ({ isStatisticsCookiesAccepted: true })),
  setCookieModalShown: (isShown: boolean) => set(() => ({ isCookieModalShown: isShown })),
}));
