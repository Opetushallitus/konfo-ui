import { Box } from '@mui/material';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { HeroImageContent } from '#/src/components/tutu-laskeutumissivu/HeroImageContent';
import { WithSideMargins } from '#/src/components/WithSideMargins';
import { TutuPalveluopasLinkBox } from './TutuPalveluopasLinkBox';
import { useTutuLaskeutumissivuData } from './useTutuLaskeutumissivuData';

export const TutuLaskeutumissivu = () => {
  const { isLoading, heroKuvaDesktop, heroKuvaMobiili, tutuPalveluopas } =
    useTutuLaskeutumissivuData();

  return (
    <Box sx={{ width: '100%', minHeight: 0 }}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <HeroImageContent
            heroImageDesktop={heroKuvaDesktop}
            heroImageMobile={heroKuvaMobiili}
          />
          <WithSideMargins>
            <TutuPalveluopasLinkBox osio={tutuPalveluopas} />
          </WithSideMargins>
        </>
      )}
    </Box>
  );
};
