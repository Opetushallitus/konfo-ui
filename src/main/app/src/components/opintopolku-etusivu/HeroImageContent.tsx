import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { WithSideMargins } from '#/src/components/WithSideMargins';
import { styled } from '#/src/theme';

const HERO_MAX_WIDTH = 1700;

// Ison näytön kuvassa on kaareva alareuna, sen alla raita ja valkoista tilaa. Sivun sisältö
// nostetaan näin paljon kuvan alaosan päälle, jotta se alkaa suunnilleen kaaren alta. Prosentit
// ovat suhteessa leveyteen (CSS:n marginaaliprosentit lasketaan aina leveydestä).
const HERO_DESKTOP_CONTENT_OVERLAP = '7%';

// Tekstin yläetäisyys: täysi arvo heron täydellä leveydellä ja pienenee kapeammalla nopeammin kuin
// kuvan korkeus, niin että se on 0 jo TEXT_TOP_ZERO_WIDTH-levyisellä herolla. (Aito eksponenttikäyrä
// ei onnistu CSS:llä, koska pituutta ei voi muuttaa luvuksi pow()/exp()-funktioille.)
const TEXT_TOP_MAX_PX = 180;
const TEXT_TOP_ZERO_WIDTH = 800;
const TEXT_TOP_SLOPE = TEXT_TOP_MAX_PX / (HERO_MAX_WIDTH - TEXT_TOP_ZERO_WIDTH);
const TEXT_TOP_MARGIN = `clamp(15px, calc((100cqw - ${TEXT_TOP_ZERO_WIDTH}px) * ${TEXT_TOP_SLOPE.toFixed(4)}), ${TEXT_TOP_MAX_PX}px)`;

const HeroWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: `${HERO_MAX_WIDTH}px`,
  marginLeft: 'auto',
  marginRight: 'auto',
  color: 'white',
  '& h1': {
    fontSize: `clamp(30px, ${((64 / HERO_MAX_WIDTH) * 100).toFixed(2)}vw, 64px)`,
    margin: 0,
    lineHeight: 1.4,
  },
  '& hr': {
    border: 'none',
    width: '65px',
    display: 'inline-block',
    height: '4px',
    backgroundColor: 'white',
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 0),
      height: '2px',
    },
  },
  '& p': {
    margin: 0,
    padding: 0,
    fontSize: '18px',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      lineHeight: 1.4,
    },
    fontWeight: 600,
  },
  '& .hero-image': {
    display: 'block',
    width: '100%',
    height: 'auto',
    marginBottom: `-${HERO_DESKTOP_CONTENT_OVERLAP}`,
    [theme.breakpoints.down('md')]: {
      marginBottom: 0,
    },
  },
  '& .hero-content': {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    [theme.breakpoints.down('sm')]: {
      top: 'auto',
      bottom: '10%',
    },
  },
  '& .hero-text': {
    maxWidth: '52%',
    marginTop: TEXT_TOP_MARGIN,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      marginTop: 0,
    },
  },
}));

export const HeroImageContent = ({
  kuvaDesktop,
  kuvaMobiili,
}: {
  kuvaDesktop?: string;
  kuvaMobiili?: string;
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  return (
    <HeroWrapper>
      {/* Kuva normaalissa virrassa koko heron levyisenä, joten hero on kuvan korkuinen ilman
            että kuvan mittoja tarvitsee tietää. Isolla näytöllä negatiivinen alamarginaali nostaa
            sivun sisällön kuvan alaosan (raidan) päälle. Pienen näytön kuvassa ei ole raitaa. */}
      <Box
        component="img"
        className="hero-image"
        src={isSmallScreen ? kuvaMobiili : kuvaDesktop}
        // Sivun suurin kuva: ladataan ensimmäisenä
        fetchPriority="high"
        alt=""
      />
      <Box className="hero-content">
        {/* Sivumarginaalit samoin kuin footerissa ja palveluissa */}
        <WithSideMargins>
          {/* Teksti enintään sisältöpalstan puoleen väliin asti */}
          <Box className="hero-text">
            <h1>{t('opintopolku-etusivu.hero-title')}</h1>
            <hr />
            <p>{t('opintopolku-etusivu.hero-text')}</p>
          </Box>
        </WithSideMargins>
      </Box>
    </HeroWrapper>
  );
};
