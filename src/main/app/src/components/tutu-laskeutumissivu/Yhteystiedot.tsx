import { PageSectionHeading } from '#/src/components/PageSectionHeading';
import { Box } from '@mui/material';
import { OphTypography } from '@opetushallitus/oph-design-system';
import { HorizontalLine } from './HeroImageContent';
import { YhteystiedotType } from './useTutuLaskeutumissivuData';

export const Yhteystiedot = ({ yhteystiedot }: { yhteystiedot: YhteystiedotType }) => {
  const headingId = 'yhteystiedot-section';
  return (
    <Box
      component="section"
      sx={{
        marginTop: 6,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
      <PageSectionHeading component="h2" id={headingId} sx={{ marginBottom: 0 }}>
        {yhteystiedot?.otsikko}
      </PageSectionHeading>
      <HorizontalLine />
      <OphTypography
        aria-labelledby={headingId}
        sx={{
          maxWidth: '50%',
        }}>
        {yhteystiedot?.sisalto}
      </OphTypography>
    </Box>
  );
};
