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
    const langCookieMatchesTitlePath = () => titleObj?.path.startsWith('/' + langCookie);

    const isTitleLangCorrect = () => {
      if (titleObj == null) {
        return false;
      } else if (isAtEtusivu && langCookieMatchesTitlePath()) {
        return true;
      } else
        return !isAtEtusivu && !titleObj?.isDefaultTitle && langCookieMatchesTitlePath();
    };

    const title = titleObj?.title;

    if (isTitleLangCorrect()) {
      window.siteImproveTracker(previousLocation, currentLocation, title);
    }
  }, [previousLocation, currentLocation, titleObj, langCookie, isAtEtusivu]);
  return null;
};
export default SiteImprove;
