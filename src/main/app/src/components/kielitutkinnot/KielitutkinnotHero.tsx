import { Box } from '@mui/material';
import { ophColors, OphTypography } from '@opetushallitus/oph-design-system';
import { preload } from 'react-dom';
import { Trans, useTranslation } from 'react-i18next';

import { WithSideMargins } from '#/src/components/WithSideMargins';
import { styled } from '#/src/theme';

const HERO_MAX_WIDTH = 1440;

// Kuva on wrapperin taustakuvana ja teksti sen päällä tavallisessa sivuvirrassa,
// joten wrapperin korkeus kasvaa tekstin mukana.
const HeroWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'kuva',
})<{ kuva?: string }>(({ theme, kuva }) => ({
  maxWidth: `${HERO_MAX_WIDTH}px`,
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundImage: kuva ? `url("${kuva}")` : undefined,
  backgroundSize: '100% auto',
  backgroundPosition: 'top',
  backgroundRepeat: 'no-repeat',
  '& .hero-content': {
    maxWidth: '75%',
    // Yläreunan etäisyys skaalautuu näkymän leveyden mukana, kuten kuvakin (max HERO_MAX_WIDTH)
    paddingTop: `min(5vw, ${HERO_MAX_WIDTH * 0.06}px)`,
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
    },
  },
  '& .hero-text': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
  '& .hero-kuvaus': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    '& p, & ul': {
      margin: 0,
    },
    '& ul': {
      paddingLeft: theme.spacing(3),
    },
  },
  '& hr': {
    border: 'none',
    width: '65px',
    height: '4px',
    backgroundColor: ophColors.green2,
    margin: theme.spacing(1, 0),
    [theme.breakpoints.down('md')]: {
      height: '2px',
    },
  },
}));

export const KielitutkinnotHero = ({ kuvaDesktop }: { kuvaDesktop?: string }) => {
  const { t } = useTranslation();

  // Sivun suurin kuva: ladataan ensimmäisenä, vaikka se on CSS-taustakuva
  if (kuvaDesktop) {
    preload(kuvaDesktop, { as: 'image', fetchPriority: 'high' });
  }

  return (
    <HeroWrapper kuva={kuvaDesktop}>
      <Box className="hero-content">
        {/* Sivumarginaalit samoin kuin footerissa ja sivun sisällössä */}
        <WithSideMargins>
          <Box className="hero-text">
            <OphTypography variant="h1">{t('kielitutkinnot.otsikko')}</OphTypography>
            <hr />
            <OphTypography component="p" sx={{ fontSize: '20px', marginBottom: 2 }}>
              {t('kielitutkinnot.ingressi')}
            </OphTypography>
            <Box className="hero-kuvaus">
              {/* Käännöksessä kappaleet <p> ja lista <ul><li>, jotka korvataan näillä komponenteilla */}
              <Trans
                i18nKey="kielitutkinnot.kuvaus"
                components={{
                  p: <OphTypography variant="body1" component="p" />,
                  ul: <ul />,
                  li: <OphTypography variant="body1" component="li" />,
                }}
              />
            </Box>
          </Box>
        </WithSideMargins>
      </Box>
    </HeroWrapper>
  );
};
