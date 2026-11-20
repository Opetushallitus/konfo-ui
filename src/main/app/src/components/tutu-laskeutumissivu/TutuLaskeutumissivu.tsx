import { Box } from '@mui/material';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { HeroImageContent } from '#/src/components/tutu-laskeutumissivu/HeroImageContent';
import { WithSideMargins } from '#/src/components/WithSideMargins';
import { useContentful } from '#/src/hooks/useContentful';
import { TutuPalveluopasLinkBox } from './TutuPalveluopasLinkBox';
import { useTutuLaskeutumissivuData } from './useTutuLaskeutumissivuData';

export const TutuLaskeutumissivu = () => {
  const { data: contentfulData, isLoading } = useContentful();
  const { tutuPalveluopas } = useTutuLaskeutumissivuData();

  return (
    <Box sx={{ width: '100%', minHeight: 0 }}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <HeroImageContent contentfulData={contentfulData} />
          <WithSideMargins>
            <TutuPalveluopasLinkBox osio={tutuPalveluopas} />
          </WithSideMargins>
        </>
      )}
    </Box>
  );
};
