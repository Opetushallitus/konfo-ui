import { Box } from '@mui/material';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { Ajankohtaista } from '#/src/components/kielitutkinnot/Ajankohtaista';
import { KielitutkinnotHero } from '#/src/components/kielitutkinnot/KielitutkinnotHero';
import { KielitutkinnotNostoOsio } from '#/src/components/kielitutkinnot/KielitutkinnotNostoOsio';
import { UseinKysytytKysymykset } from '#/src/components/kielitutkinnot/UseinKysytytKysymykset';
import { useKielitutkinnotData } from '#/src/components/kielitutkinnot/useKielitutkinnotData';
import { WithSideMargins } from '#/src/components/WithSideMargins';

export const KielitutkinnotPage = () => {
  const {
    isLoading,
    heroKuvaDesktop,
    ykiTestiinOsallistuminen,
    ykiLisatietoa,
    useinKysytytKysymykset,
    ajankohtaista,
    julkaisut,
  } = useKielitutkinnotData();

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
              <UseinKysytytKysymykset
                otsikko={useinKysytytKysymykset.otsikko}
                kysymykset={useinKysytytKysymykset.kysymykset}
              />
              <Ajankohtaista osio={ajankohtaista} />
              <KielitutkinnotNostoOsio osio={julkaisut} naytaNuoli={false} />
              {/* TODO: Kielitutkintojen laskeutumissivun muu sisältö */}
            </WithSideMargins>
          </Box>
        </>
      )}
    </Box>
  );
};
