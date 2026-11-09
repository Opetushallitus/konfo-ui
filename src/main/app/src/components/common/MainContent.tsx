import { useMediaQuery } from '@mui/material';

import { useSideMenu } from '#/src/hooks';
import { getHeaderHeight, styled, theme } from '#/src/theme';

const Main = styled('main')(
  ({ isSmall, menuVisible }: { isSmall?: boolean; menuVisible?: boolean }) => ({
    marginTop: getHeaderHeight(theme),
    minWidth: 0,
    flexGrow: 1,
    padding: 0,
    ...(isSmall && menuVisible
      ? {
          position: 'absolute',
          left: 0,
          right: 0,
          overflow: 'hidden',
          top: 0,
          bottom: 0,
        }
      : {}),
  })
);

// Sivun pääsisältö (<main>). Jokainen sivupohja (layout) renderöi tämän ja footerin itse, jotta
// sivupohjat voivat asetella sisällön ja footerin eri tavoin.
export const MainContent = ({ children }: React.PropsWithChildren) => {
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { state: menuVisible } = useSideMenu();

  return (
    <Main id="app-main-content" isSmall={isSmall} menuVisible={menuVisible}>
      {children}
    </Main>
  );
};
