import { Box } from '@mui/material';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { HeroImageContent } from '#/src/components/tutu-laskeutumissivu/HeroImageContent';
import { WithSideMargins } from '#/src/components/WithSideMargins';
import { useContentful } from '#/src/hooks/useContentful';

export const TutuLaskeutumissivu = () => {
  const { data: contentfulData, isLoading } = useContentful();

  return (
    <Box sx={{ width: '100%', minHeight: 0 }}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <HeroImageContent contentfulData={contentfulData} />
          <WithSideMargins></WithSideMargins>
        </>
      )}
    </Box>
  );
};
