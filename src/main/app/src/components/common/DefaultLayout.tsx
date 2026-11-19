import { Outlet } from 'react-router-dom';

import { HeadingBoundary } from '#/src/components/Heading';
import { Palvelut } from '#/src/components/palvelu/Palvelut';
import { ContentMaxWidthContext } from '#/src/components/ContentMaxWidthContext';

import { Footer } from './Footer';
import { MainContent } from './MainContent';
import { Notifications } from './Notifications';

type DefaultLayoutProps = {
  palvelutVisible: boolean;
  // Tekstialueen enimmäisleveys (px) sisällölle ja footerille. Oletuksena ei rajausta.
  contentMaxWidth?: number;
};

// Oletussivupohja: sivun sisältö, ilmoitukset, palvelut ja footer.
export const DefaultLayout = ({
  palvelutVisible,
  contentMaxWidth,
}: DefaultLayoutProps) => (
  <ContentMaxWidthContext value={contentMaxWidth}>
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
  </ContentMaxWidthContext>
);
