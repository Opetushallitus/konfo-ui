import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import {
  LINK_PAPER_SX,
  PaperHeading,
  SectionHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';
import { ContentfulData } from '#/src/types/ContentfulTypes';

export const KirjautuneenPalvelut = ({
  contentfulData,
}: {
  contentfulData: ContentfulData;
}) => {
  const { assetUrl } = useContentful();

  const etusivuData = getOne(contentfulData?.opintopolkuEtusivu);
  const otsikko = etusivuData?.kirjautuneenPalvelutOtsikko;
  const nostot = contentfulData.nosto;
  const kirjautuneenPalvelutNostot = etusivuData?.kirjautuneenPalvelutNostot ?? [];

  return kirjautuneenPalvelutNostot.length > 0 ? (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">{otsikko}</SectionHeading>
      {kirjautuneenPalvelutNostot?.map((nostoRef, index) => {
        const nosto = nostot[nostoRef?.id ?? ''];
        return (
          <Paper
            key={nostoRef?.id ?? index}
            component="a"
            href={nosto.linkki}
            sx={{
              ...LINK_PAPER_SX,
              color: ophColors.grey900,
              borderTop: `4px solid ${ophColors.green2}`,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 2,
            }}>
            <Box
              component="img"
              src={assetUrl(nosto.ikoni?.url)}
              alt=""
              sx={{ height: '38px' }}
            />
            <PaperHeading color={ophColors.green2}>{nosto?.otsikko}</PaperHeading>
            <OphTypography sx={{ color: 'inherit' }}>{nosto.teksti}</OphTypography>
          </Paper>
        );
      })}
    </Box>
  ) : null;
};
