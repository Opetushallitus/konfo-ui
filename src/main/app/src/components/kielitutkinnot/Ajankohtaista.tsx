import { Box, Paper } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';
import { format, isValid, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { LINK_PAPER_SX } from '#/src/components/opintopolku-etusivu/linkPaperStyles';
import {
  EtusivuSection,
  PaperHeading,
} from '#/src/components/opintopolku-etusivu/opintopolkuEtusivuUtils';
import {
  EtusivuNosto,
  EtusivuOsio,
} from '#/src/components/opintopolku-etusivu/useOpintopolkuEtusivuData';

// Julkaisuaika (ISO 8601) muodossa D.M.YYYY
const formatJulkaisuaika = (julkaisuaika: string) => {
  const date = parseISO(julkaisuaika);
  return isValid(date) ? format(date, 'd.M.yyyy') : undefined;
};

// Ajankohtaista-osio: laatikoissa ylhäältä alas kuva, tyyppi, otsikko, asiasanat ja julkaisuaika.
// Isoilla näytöillä kolme laatikkoa rinnakkain.
export const Ajankohtaista = ({ osio }: { osio: EtusivuOsio }) => {
  const { t } = useTranslation();

  return (
    <EtusivuSection osio={osio}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 4,
        }}>
        {osio.nostot.map((nosto: EtusivuNosto) => {
          const julkaistu = nosto.julkaisuaika && formatJulkaisuaika(nosto.julkaisuaika);
          return (
            <Paper
              key={nosto.id}
              sx={{
                ...LINK_PAPER_SX,
                color: ophColors.grey900,
                overflow: 'hidden',
                gap: 0,
              }}>
              {nosto.kuvaUrl && (
                <Box
                  component="img"
                  src={nosto.kuvaUrl}
                  alt=""
                  sx={{ width: '100%', objectFit: 'cover' }}
                />
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  flexGrow: 1,
                  padding: 2,
                }}>
                {nosto.tyyppi && (
                  <OphTypography
                    variant="body2"
                    sx={{
                      color: ophColors.grey600,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}>
                    {nosto.tyyppi}
                  </OphTypography>
                )}
                <PaperHeading
                  color={ophColors.green2}
                  fontSize="20px"
                  fontWeight={400}
                  to={nosto.linkit?.[0]?.href}
                  otsikko={nosto.otsikko}
                />
                {nosto.asiasanat && nosto.asiasanat.length > 0 && (
                  <Box
                    component="ul"
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      margin: 0,
                      padding: 0,
                      listStyle: 'none',
                    }}>
                    {nosto.asiasanat.map((asiasana) => (
                      <OphTypography
                        key={asiasana}
                        component="li"
                        variant="body2"
                        sx={{
                          backgroundColor: ophColors.grey100,
                          color: ophColors.grey700,
                          borderRadius: '2px',
                          paddingX: 1,
                          paddingY: 0.5,
                        }}>
                        {asiasana}
                      </OphTypography>
                    ))}
                  </Box>
                )}
                {julkaistu && (
                  <OphTypography variant="body2" sx={{ color: 'inherit' }}>
                    {t('kielitutkinnot.julkaistu', { pvm: julkaistu })}
                  </OphTypography>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </EtusivuSection>
  );
};
