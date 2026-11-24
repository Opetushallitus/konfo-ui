import { Box, Paper, SxProps, Theme } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';
import { Link as RouterLink } from 'react-router-dom';

import { InlineSvgIcon } from '#/src/components/common/InlineSvgIcon';
import {
  LINK_PAPER_SX,
  PaperHeading,
  SectionHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';
import { ContentfulData } from '#/src/types/ContentfulTypes';

const KoulutustietoPaper = ({
  icon,
  heading,
  text,
  to,
  backgroundColor,
  sx,
}: {
  icon?: string;
  heading: string;
  text?: string;
  backgroundColor: string;
  to: string;
  sx?: SxProps<Theme>;
}) => (
  <Paper
    elevation={0}
    component={RouterLink}
    to={to}
    sx={[
      {
        backgroundColor,
        color: 'white',
        ...LINK_PAPER_SX,
        '&:focus-visible': {
          outline: `2px solid ${ophColors.black}`,
          outlineOffset: '2px',
        },
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}>
    {/* SVG upotetaan sivulle (kuten MaterialIcon), jolloin se saa tekstin värin (currentColor).
        Koristekuva: otsikko kertoo jo sisällön. */}
    {icon && <InlineSvgIcon src={icon} aria-hidden sx={{ fontSize: '64px' }} />}
    <PaperHeading color="inherit">{heading}</PaperHeading>
    <OphTypography sx={{ color: 'inherit' }}>{text}</OphTypography>
  </Paper>
);

export const Koulutustieto = ({ contentfulData }: { contentfulData: ContentfulData }) => {
  // Contentfulin kuvien url:t ovat suhteellisia sisältö-bucketiin, assetUrl lisää alun
  const { assetUrl } = useContentful();

  const etusivuData = getOne(contentfulData?.opintopolkuEtusivu);
  const otsikko = etusivuData?.koulutustietoOtsikko;
  const nostot = contentfulData.nosto;

  const koulutustietoNostot = etusivuData?.koulutustietoNostot ?? [];

  return koulutustietoNostot.length > 0 ? (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">{otsikko}</SectionHeading>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 4,
        }}>
        {koulutustietoNostot?.map((nostoRef, index) => {
          const nosto = nostot[nostoRef?.id ?? ''];
          return (
            <KoulutustietoPaper
              key={nostoRef.id}
              icon={assetUrl(nosto.ikoni?.url)}
              heading={nosto.otsikko}
              text={nosto.teksti}
              backgroundColor={index === 0 ? ophColors.cyan1 : ophColors.green2}
              to={nosto.linkki ?? ''}
              sx={index === 0 ? { gridColumn: '1 / -1' } : undefined}
            />
          );
        })}
      </Box>
    </Box>
  ) : null;
};
