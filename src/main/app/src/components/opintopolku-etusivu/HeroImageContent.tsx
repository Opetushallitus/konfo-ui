import { type CSSProperties, useCallback, useState } from 'react';

import { Box, useTheme } from '@mui/material';
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
const TEXT_TOP_ZERO_WIDTH = 700;
const TEXT_TOP_SLOPE = TEXT_TOP_MAX_PX / (HERO_MAX_WIDTH - TEXT_TOP_ZERO_WIDTH);
const TEXT_TOP_MARGIN = `clamp(0px, calc((100cqw - ${TEXT_TOP_ZERO_WIDTH}px) * ${TEXT_TOP_SLOPE.toFixed(4)}), ${TEXT_TOP_MAX_PX}px)`;

// Mobiilikuvan yläosasta rajataan pois MOBILE_CROP_MAX osuus kuvan korkeudesta juuri
// mobiilirajan (sm) alapuolella, ja rajaus pienenee nollaan MOBILE_CROP_ZERO_WIDTH-levyiseen
// kuvaan mennessä. Rajauksen pituus = kuvan korkeus/leveys -suhde * kuvan leveydestä laskettu
// lineaarinen pituus. (Osuus kertaa korkeus olisi leveyden suhteen toisen asteen lauseke, mitä
// CSS ei osaa laskea, joten välillä rajaus on hieman suurempi kuin tarkka osuus.)
const MOBILE_CROP_MAX = 0.2;
const MOBILE_CROP_ZERO_WIDTH = 500;
const HEIGHT_RATIO_VAR = '--hero-image-height-ratio';
const getMobileCrop = (mobileBreakpoint: number) => {
  const fullCropWidth = mobileBreakpoint - 1;
  const slope =
    (MOBILE_CROP_MAX * fullCropWidth) / (fullCropWidth - MOBILE_CROP_ZERO_WIDTH);
  return `max(0px, var(${HEIGHT_RATIO_VAR}, 0) * (100cqw - ${MOBILE_CROP_ZERO_WIDTH}px) * ${slope.toFixed(4)})`;
};

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
    marginBottom: `-${HERO_DESKTOP_CONTENT_OVERLAP}`,
    [theme.breakpoints.down('md')]: {
      marginBottom: 0,
    },
    '& img': {
      display: 'block',
      width: '100%',
      height: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      // Rajattu yläosa piiloon. overflow: hidden estää myös kuvan negatiivisen marginaalin
      // siirtymisen kuvaelementin ulkopuolelle. 100cqw = kuvan leveys.
      overflow: 'hidden',
      containerType: 'inline-size',
      '& img': {
        marginTop: `calc(-1 * ${getMobileCrop(theme.breakpoints.values.sm)})`,
      },
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
  const { t } = useTranslation();

  // Ladatun kuvan korkeus/leveys -suhde mobiilikuvan rajausta varten. Päivittyy, kun selain
  // vaihtaa kuvaa näytön leveyden mukaan.
  const [heightRatio, setHeightRatio] = useState<number>();
  const updateHeightRatio = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) {
      setHeightRatio(img.naturalHeight / img.naturalWidth);
    }
  }, []);

  return (
    <HeroWrapper
      style={
        heightRatio ? ({ [HEIGHT_RATIO_VAR]: heightRatio } as CSSProperties) : undefined
      }>
      {/* Kuva normaalissa virrassa koko heron levyisenä, joten hero on kuvan korkuinen ilman
            että kuvan mittoja tarvitsee tietää. Isolla näytöllä negatiivinen alamarginaali nostaa
            sivun sisällön kuvan alaosan (raidan) päälle. Pienen näytön kuvassa ei ole raitaa.
            Selain valitsee kuvan <source>-elementin mediaehdon perusteella jo ennen Reactia, joten
            vain näytön kokoon sopiva kuva ladataan. */}
      <picture className="hero-image">
        {/* Mobiilikuva oletuksena, isommilla näytöillä desktop-kuva. Puuttuva kuva korvataan toisella, jottei kuva jää tyhjäksi. */}
        {kuvaDesktop && (
          <source
            media={`(min-width: ${theme.breakpoints.values.sm}px)`}
            srcSet={kuvaDesktop}
          />
        )}
        {/* Sivun suurin kuva: ladataan ensimmäisenä */}
        <img
          ref={updateHeightRatio}
          onLoad={(event) => updateHeightRatio(event.currentTarget)}
          src={kuvaMobiili ?? kuvaDesktop}
          fetchPriority="high"
          alt=""
        />
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
