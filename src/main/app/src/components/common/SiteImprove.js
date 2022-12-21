import { useEffect } from 'react';

import Cookies from 'js-cookie';

import {
  useCurrentSiteImproveLocation,
  useIsAtEtusivu,
  usePreviousSiteImproveLocation,
} from '#/src/store/reducers/appSlice';

export const SiteImprove = (props) => {
  const { titleObj } = props;

  const previousLocation = usePreviousSiteImproveLocation() || '';
  const currentLocation = useCurrentSiteImproveLocation();
  const isAtEtusivu = useIsAtEtusivu();
  const langCookie = Cookies.get('lang');

  useEffect(() => {
    const isLangSetOnPath = () => currentLocation.includes('/' + langCookie);
    const langCookieMatchesTitle = () => titleObj?.lang === langCookie;

    const isTitleLoaded = () => {
      if (titleObj == null) {
        return false;
      } else if (isAtEtusivu && langCookieMatchesTitle()) {
        return true;
      } else return !isAtEtusivu && !titleObj?.isDefaultTitle;
    };

    const title = titleObj?.title;
    // console.log(titleObj);
    // console.log('title ' + title);
    // console.log('isAtEtusivu ' + isAtEtusivu);
    // console.log('langCookie ' + langCookie);
    // console.log('isLangSetOnPath ' + isLangSetOnPath());
    // console.log('langCookieMatchesTitle ' + langCookieMatchesTitle());
    // console.log('isTitleLoaded ' + isTitleLoaded());

    if (isLangSetOnPath() && isTitleLoaded()) {
      window.siteImproveTracker(previousLocation, currentLocation, title);
    }
  }, [previousLocation, currentLocation, titleObj, langCookie, isAtEtusivu]);
  return null;
};
export default SiteImprove;
