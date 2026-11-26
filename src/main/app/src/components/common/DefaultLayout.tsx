import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { ContentMaxWidthContext } from '#/src/components/ContentMaxWidthContext';
import { Hairiotiedote } from '#/src/components/Hairiotiedote';
import { HeadingBoundary } from '#/src/components/Heading';
import { Palvelut } from '#/src/components/palvelu/Palvelut';
import { getHeaderHeight, theme } from '#/src/theme';

import { Footer } from './Footer';
import { MainContent } from './MainContent';
import { Notifications } from './Notifications';

type DefaultLayoutProps = {
  palvelutVisible?: boolean;
  hairiotiedoteVisible?: boolean;
  // Tekstialueen enimmäisleveys (px) sisällölle ja footerille. Oletuksena ei rajausta.
  contentMaxWidth?: number;
  // Koko sivun (esim. hero-kuvan) enimmäisleveys (px), keskitettynä. Oletuksena ei rajausta.
  pageMaxWidth?: number;
  // Pääsisältöalueen taustaväri koko leveydeltä (myös sivun enimmäisleveyden ulkopuolella).
  backgroundColor?: string;
};

// Oletussivupohja: häiriötiedotteet, sivun sisältö, ilmoitukset, palvelut ja footer.
export const DefaultLayout = ({
  palvelutVisible = true,
  hairiotiedoteVisible = true,
  contentMaxWidth,
  pageMaxWidth,
  backgroundColor,
}: DefaultLayoutProps) => (
  <ContentMaxWidthContext value={contentMaxWidth}>
    {/* Yläpadding jättää tilan kiinteälle headerille, joten häiriötiedotteet näkyvät sen alla
    koko leveydellä ennen sivun enimmäisleveyteen rajattua sisältöä. */}
    <Box sx={{ backgroundColor, paddingTop: `${getHeaderHeight(theme)}px` }}>
      {hairiotiedoteVisible && <Hairiotiedote />}
      <Box
        sx={{
          width: '100%',
          minHeight: 0,
          maxWidth: pageMaxWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: 'white',
        }}>
        <Box className="content-container" sx={{ maxWidth: pageMaxWidth }}>
          <MainContent>
            <HeadingBoundary>
              <Outlet />
              <HeadingBoundary>
                <Notifications />
                {palvelutVisible && <Palvelut />}
              </HeadingBoundary>
            </HeadingBoundary>
          </MainContent>
          <Footer />
        </Box>
      </Box>
    </Box>
  </ContentMaxWidthContext>
);
