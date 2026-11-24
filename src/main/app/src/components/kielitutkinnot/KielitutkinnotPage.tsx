import { Box } from '@mui/material';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { KielitutkinnotHero } from '#/src/components/kielitutkinnot/KielitutkinnotHero';
import { KielitutkinnotNostoOsio } from '#/src/components/kielitutkinnot/KielitutkinnotNostoOsio';
import { useKielitutkinnotData } from '#/src/components/kielitutkinnot/useKielitutkinnotData';
import { WithSideMargins } from '#/src/components/WithSideMargins';

export const KielitutkinnotPage = () => {
  const { isLoading, heroKuvaDesktop, ykiTestiinOsallistuminen, ykiLisatietoa } =
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
              <KielitutkinnotNostoOsio osio={ykiTestiinOsallistuminen} />
              <KielitutkinnotNostoOsio osio={ykiLisatietoa} />
              {/* TODO: Kielitutkintojen laskeutumissivun muu sisältö */}
            </WithSideMargins>
          </Box>
        </>
      )}
    </Box>
  );
};
