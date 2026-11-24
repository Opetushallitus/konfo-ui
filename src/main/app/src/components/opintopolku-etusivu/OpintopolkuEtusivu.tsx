import { Box } from '@mui/material';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { EtusivuHaku } from '#/src/components/opintopolku-etusivu/EtusivuHaku';
import { HeroImageContent } from '#/src/components/opintopolku-etusivu/HeroImageContent';
import { KirjautuneenPalvelut } from '#/src/components/opintopolku-etusivu/KirjautuneenPalvelut';
import { Koulutustieto } from '#/src/components/opintopolku-etusivu/Koulutustieto';
import { MuutPalvelut } from '#/src/components/opintopolku-etusivu/MuutPalvelut';
import { WithSideMargins } from '#/src/components/WithSideMargins';
import { useContentful } from '#/src/hooks/useContentful';

export const OpintopolkuEtusivu = () => {
  const { data: contentfulData, isLoading } = useContentful();

  return (
    <Box sx={{ width: '100%', minHeight: 0 }}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <HeroImageContent contentfulData={contentfulData} />
          {/* Sivun sisältö: sivumarginaalit samoin kuin footerissa ja palveluissa.
          position: relative on välttämätön: isolla näytöllä sisältö nousee hero-kuvan alaosan
          päälle, ja koska hero on sijoitettu (relative), se piirrettäisiin muuten sisällön päälle. */}
          <Box sx={{ position: 'relative', marginTop: 4 }}>
            <WithSideMargins>
              <EtusivuHaku />
              <Koulutustieto contentfulData={contentfulData} />
              <KirjautuneenPalvelut contentfulData={contentfulData} />
              <MuutPalvelut contentfulData={contentfulData} />
            </WithSideMargins>
          </Box>
        </>
      )}
    </Box>
  );
};
