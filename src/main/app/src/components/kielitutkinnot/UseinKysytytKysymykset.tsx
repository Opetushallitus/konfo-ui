import { useId } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Sisalto } from '#/src/components/sivu/Sisalto';
import { PageSectionHeading } from '#/src/components/PageSectionHeading';

export type UseinKysyttyKysymys = {
  id: string;
  kysymys: string;
  vastaus?: string;
};

// Usein kysytyt kysymykset -osio: kysymykset allekkain harmaina haitareina. Kysymys on haitarin
// otsikko ja vastaus (markdown, voi sisältää muotoiltua tekstiä ja linkkejä) sen sisältö.
// Osiota ei näytetä, jos siinä ei ole kysymyksiä.
export const UseinKysytytKysymykset = ({
  otsikko,
  kysymykset,
}: {
  otsikko?: string;
  kysymykset: Array<UseinKysyttyKysymys>;
}) => {
  const headingId = useId();

  return kysymykset.length > 0 ? (
    <Box component="section" aria-labelledby={headingId} sx={{ marginTop: 6 }}>
      <PageSectionHeading component="h2" id={headingId}>
        {otsikko}
      </PageSectionHeading>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: '900px' }}>
        {kysymykset.map((faq) => (
          <Accordion
            key={faq.id}
            disableGutters
            elevation={0}
            sx={{
              backgroundColor: ophColors.grey50,
              color: ophColors.grey900,
              borderRadius: '4px',
              '&::before': { display: 'none' },
            }}>
            <AccordionSummary
              expandIcon={<MaterialIcon icon="expand_more" />}
              sx={{ paddingX: 2.5, paddingY: 0.5 }}>
              <OphTypography
                component="h3"
                variant="body1"
                sx={{ color: ophColors.green2 }}>
                {faq.kysymys}
              </OphTypography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                paddingX: 3,
                paddingBottom: 2,
                paddingTop: 1,
              }}>
              <Sisalto content={faq.vastaus} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  ) : null;
};
