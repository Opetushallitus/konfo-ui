import { Box, useTheme } from '@mui/material';
import { ophColors } from '@opetushallitus/oph-design-system';
import { useTranslation } from 'react-i18next';

import { WithSideMargins } from '#/src/components/WithSideMargins';
import { styled } from '#/src/theme';

const HERO_MAX_WIDTH = 1440;

// Ison näytön kuvassa on kaareva alareuna, sen alla raita ja valkoista tilaa. Sivun sisältö
// nostetaan näin paljon kuvan alaosan päälle, jotta se alkaa suunnilleen kaaren alta. Prosentit
// ovat suhteessa leveyteen (CSS:n marginaaliprosentit lasketaan aina leveydestä).
const HERO_DESKTOP_CONTENT_OVERLAP = '7%';

// Tekstin yläetäisyys: täysi arvo heron täydellä leveydellä ja pienenee kapeammalla nopeammin kuin
// kuvan korkeus, niin että se on 0 jo TEXT_TOP_ZERO_WIDTH-levyisellä herolla. (Aito eksponenttikäyrä
// ei onnistu CSS:llä, koska pituutta ei voi muuttaa luvuksi pow()/exp()-funktioille.)
const TEXT_TOP_MAX_PX = 180;
const TEXT_TOP_ZERO_WIDTH = 700;
const TEXT_TOP_SLOPE = TEXT_TOP_MAX_PX / (HERO_MAX_WIDTH - TEXT_TOP_ZERO_WIDTH);
const TEXT_TOP_MARGIN = `clamp(0px, calc((100cqw - ${TEXT_TOP_ZERO_WIDTH}px) * ${TEXT_TOP_SLOPE.toFixed(4)}), ${TEXT_TOP_MAX_PX}px)`;

const TITLE_LINE_HEIGHT = 1.4;

// Mobiilissa otsikko pienenee näkymän leveyden mukana (n. 29px Galaxy S9+:n 412px leveydellä)
const MOBILE_TITLE_FONT_SIZE = 'clamp(26px, 7vw, 30px)';

// Mobiilissa otsikon ja sen alaviivan alareuna on näin paljon kuvan alareunan yläpuolella.
// Skaalautuu näkymän leveyden mukana kuten kuvan korkeuskin.
const MOBILE_TEXT_LIFT = '3vw';

const HeroWrapper = styled(Box)(({ theme }) => {
  // Mobiilin alaviivan korkeus ja pystymarginaalit
  const mobileHrHeight = 2;
  const mobileHrMargin = theme.spacing(1);
  return {
    position: 'relative',
    maxWidth: `${HERO_MAX_WIDTH}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      // Mobiilissa tumma teksti tavallisessa sivuvirrassa, kuten kielitutkintojen
      // laskeutumissivulla, joten hero kasvaa tekstin mukana. Ingressi jatkuu kuvan alapuolelle.
      color: 'inherit',
    },
    '& h1': {
      fontSize: `clamp(30px, ${((64 / HERO_MAX_WIDTH) * 100).toFixed(2)}vw, 64px)`,
      margin: 0,
      lineHeight: TITLE_LINE_HEIGHT,
      [theme.breakpoints.down('sm')]: {
        fontSize: MOBILE_TITLE_FONT_SIZE,
      },
    },
    '& hr': {
      border: 'none',
      width: '65px',
      display: 'inline-block',
      height: '4px',
      backgroundColor: 'white',
      margin: theme.spacing(2, 0),
      [theme.breakpoints.down('md')]: {
        margin: `${mobileHrMargin} 0`,
        height: `${mobileHrHeight}px`,
      },
      [theme.breakpoints.down('sm')]: {
        backgroundColor: ophColors.green2,
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
      marginBottom: `-${HERO_DESKTOP_CONTENT_OVERLAP}`,
      [theme.breakpoints.down('md')]: {
        marginBottom: 0,
      },
      '& img': {
        display: 'block',
        width: '100%',
        height: 'auto',
      },
    },
    '& .hero-content': {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      [theme.breakpoints.down('sm')]: {
        // Tavallisessa virrassa kuvan alla, ja negatiivinen ylämarginaali nostaa otsikon ja
        // alaviivan kuvan alaosan päälle. relative, jotta teksti piirretään kuvan päälle.
        position: 'relative',
        marginTop: `calc(-1 * (${MOBILE_TITLE_FONT_SIZE} * ${TITLE_LINE_HEIGHT} + ${mobileHrHeight}px + 2 * ${mobileHrMargin} + ${MOBILE_TEXT_LIFT}))`,
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
  };
});

export const HeroImageContent = ({
  kuvaDesktop,
  kuvaMobiili,
}: {
  kuvaDesktop?: string;
  kuvaMobiili?: string;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <HeroWrapper>
      {/* Kuva normaalissa virrassa koko heron levyisenä, joten hero on kuvan korkuinen ilman
            että kuvan mittoja tarvitsee tietää. Isolla näytöllä negatiivinen alamarginaali nostaa
            sivun sisällön kuvan alaosan (raidan) päälle. Selain valitsee kuvan <source>-elementin
            mediaehdon perusteella jo ennen Reactia, joten vain näytön kokoon sopiva kuva ladataan. */}
      <picture className="hero-image">
        {/* Mobiilikuva oletuksena, isommilla näytöillä desktop-kuva. Puuttuva kuva korvataan toisella, jottei kuva jää tyhjäksi. */}
        {kuvaDesktop && (
          <source
            media={`(min-width: ${theme.breakpoints.values.sm}px)`}
            srcSet={kuvaDesktop}
          />
        )}
        {/* Sivun suurin kuva: ladataan ensimmäisenä */}
        <img src={kuvaMobiili ?? kuvaDesktop} fetchPriority="high" alt="" />
      </picture>
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
