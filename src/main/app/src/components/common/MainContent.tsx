import { useMediaQuery } from '@mui/material';

import { useSideMenu } from '#/src/hooks';
import { getHeaderHeight, styled, theme } from '#/src/theme';

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'isSmall' && prop !== 'menuVisible',
})(({ isSmall, menuVisible }: { isSmall?: boolean; menuVisible?: boolean }) => ({
  // Ei ylämarginaalia headerin kohdalle: DefaultLayout jättää tilan headerille, jotta
  // häiriötiedotteet voidaan näyttää headerin alla ennen <main>-elementtiä.
  minWidth: 0,
  flexGrow: 1,
  padding: 0,
  // Väli footeriin paddingina (ei footerin marginaalina), jotta taustaväri ulottuu footeriin asti
  paddingBottom: theme.spacing(8),
  ...(isSmall && menuVisible
    ? {
        position: 'absolute',
        left: 0,
        right: 0,
        overflow: 'hidden',
        // Ennen ylämarginaali siirsi tämän headerin alle, nyt sama tehdään top-arvolla
        top: getHeaderHeight(theme),
        bottom: 0,
      }
    : {}),
}));

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
