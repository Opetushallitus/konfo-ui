import { useWindowSize } from 'react-use';

import { useSideMenu } from '#/src/hooks';

export const useContentWidth = () => {
  const { width: windowWidth } = useWindowSize();
  const { width: sideMenuWidth } = useSideMenu();

  return Math.round(windowWidth - sideMenuWidth);
};
