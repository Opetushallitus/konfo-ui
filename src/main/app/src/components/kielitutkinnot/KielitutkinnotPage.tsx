import { Box } from '@mui/material';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { KielitutkinnotHero } from '#/src/components/kielitutkinnot/KielitutkinnotHero';
import { useKielitutkinnotData } from '#/src/components/kielitutkinnot/useKielitutkinnotData';
import { YkiTestiinOsallistuminen } from '#/src/components/kielitutkinnot/YkiTestiinOsallistuminen';
import { WithSideMargins } from '#/src/components/WithSideMargins';

export const KielitutkinnotPage = () => {
  const { isLoading, heroKuvaDesktop, ykiTestiinOsallistuminen } =
    useKielitutkinnotData();

  return (
    <Box sx={{ width: '100%', minHeight: 0 }}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <KielitutkinnotHero kuvaDesktop={heroKuvaDesktop} />
          <Box sx={{ position: 'relative', marginTop: 4 }}>
            <WithSideMargins>
              <YkiTestiinOsallistuminen osio={ykiTestiinOsallistuminen} />
              {/* TODO: Kielitutkintojen laskeutumissivun muu sisältö */}
            </WithSideMargins>
          </Box>
        </>
      )}
    </Box>
  );
};
