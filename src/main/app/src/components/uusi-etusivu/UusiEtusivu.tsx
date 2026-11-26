import { Box } from '@mui/material';
import { ophColors } from '@opetushallitus/oph-design-system';
import HeroImage from '#/src/assets/images/uusi_opintopolku_hero.jpg';
import { styled } from '#/src/theme';

// Hero-kuva saa olla korkeintaan kuvan oman levyinen, sisältö (teksti ym.) korkeintaan 1200px
const HERO_MAX_WIDTH = 1705;
const CONTENT_MAX_WIDTH = 1200;

// Käyrien koordinaatisto: alla olevat px-arvot (esim. raidan paksuus) ovat tarkkoja, kun hero on
// WIDTH levyinen. Kaikki skaalautuu suhteessa leveyteen.
const WIDTH = 1705;
const IMAGE_HEIGHT = 596;

// Kuvan S-muotoinen alareuna (% kuvan korkeudesta / leveydestä): oikea reuna, kontrollipisteet, vasen reuna
const IMAGE_RIGHT_Y = 66;
const IMAGE_LEFT_Y = 96;
const CONTROL_1 = { x: 68, y: 58 };
const CONTROL_2 = { x: 20, y: 96 };

// Kuvan alle jäävän gradienttiraidan paksuus (px täydellä leveydellä) oikeassa ja vasemmassa reunassa
const STRIPE_RIGHT_PX = 18;
const STRIPE_LEFT_PX = 210;
// Kuinka paljon raita kaartuu: 1 = paksuus kasvaa tasaisesti, suurempi = raita pysyy pidempään
// ohuena oikealla ja levenee jyrkemmin vasemmalle
const STRIPE_BEND = 4;

const TOTAL_HEIGHT = (IMAGE_HEIGHT * IMAGE_LEFT_Y) / 100 + STRIPE_LEFT_PX;

// Piste px-koordinaatteina; offset siirtää pistettä alaspäin
const point = (xPct: number, yPct: number, offset = 0) =>
  `${(WIDTH * xPct) / 100},${((IMAGE_HEIGHT * yPct) / 100 + offset).toFixed(1)}`;

// Raidan paksuus kasvaa oikealta vasemmalle. Siirtämällä käyrän kontrollipisteitä paksuuden
// verran raidan alareuna seuraa kuvan alareunan muotoa.
const stripeOffset = (xPct: number) =>
  STRIPE_RIGHT_PX + (STRIPE_LEFT_PX - STRIPE_RIGHT_PX) * (1 - xPct / 100) ** STRIPE_BEND;

// Kuvan alareunan (offset = 0) tai raidan alareunan (offset = stripeOffset) yläpuolinen alue
const curvePath = (offset: (xPct: number) => number) =>
  `M0,0 H${WIDTH} L${point(100, IMAGE_RIGHT_Y, offset(100))} ` +
  `C${point(CONTROL_1.x, CONTROL_1.y, offset(CONTROL_1.x))} ` +
  `${point(CONTROL_2.x, CONTROL_2.y, offset(CONTROL_2.x))} ` +
  `${point(0, IMAGE_LEFT_Y, offset(0))} Z`;

const svgMask = (path: string, height: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${height.toFixed(1)}" preserveAspectRatio="none">` +
      `<path d="${path}" fill="black"/>` +
      '</svg>'
  )}")`;

const maskSx = (mask: string) => ({
  WebkitMaskImage: mask,
  WebkitMaskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskImage: mask,
  maskSize: '100% 100%',
  maskRepeat: 'no-repeat',
});

const IMAGE_MASK = svgMask(
  curvePath(() => 0),
  IMAGE_HEIGHT
);
const STRIPE_MASK = svgMask(curvePath(stripeOffset), TOTAL_HEIGHT);

// Tekstin yläetäisyys: täysi arvo heron täydellä leveydellä ja pienenee kapeammalla nopeammin kuin
// kuvan korkeus, niin että se on 0 jo TEXT_TOP_ZERO_WIDTH-levyisellä herolla. (Aito eksponenttikäyrä
// ei onnistu CSS:llä, koska pituutta ei voi muuttaa luvuksi pow()/exp()-funktioille.)
const TEXT_TOP_MAX_PX = 180;
const TEXT_TOP_ZERO_WIDTH = 800;
const TEXT_TOP_SLOPE = TEXT_TOP_MAX_PX / (HERO_MAX_WIDTH - TEXT_TOP_ZERO_WIDTH);
const TEXT_TOP_MARGIN = `clamp(15px, calc((100cqw - ${TEXT_TOP_ZERO_WIDTH}px) * ${TEXT_TOP_SLOPE.toFixed(4)}), ${TEXT_TOP_MAX_PX}px)`;

const HeroWrapper = styled(Box)({
  maxWidth: `${HERO_MAX_WIDTH}px`,
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
  color: 'white',
  '& h1': {
    fontSize: `clamp(30px, ${((64 / HERO_MAX_WIDTH) * 100).toFixed(2)}vw, 64px)`,
    marginTop: 0,
  },
  '& hr': {
    border: 'none',
    width: '65px',
    display: 'inline-block',
    height: '4px',
    backgroundColor: 'white',
    margin: '10px 0',
  },
  '& p': {
    fontSize: '18px',
    fontWeight: 600,
  },
});

export const UusiEtusivu = () => {
  return (
    <Box sx={{ width: '100%', minHeight: 0 }}>
      <HeroWrapper>
        {/* Gradienttiraita kuvan alla taustana: absoluuttisesti sijoitettu, joten se ei vie tilaa eikä
          työnnä sivun sisältöä alemmas. Kuva piirretään päälle, joten raitaa näkyy vain kuvan
          alareunan ja raidan alareunan välissä. */}
        <Box
          className="stripe-background"
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            aspectRatio: `${WIDTH} / ${TOTAL_HEIGHT}`,
            // Liukuu valkoiseksi jo ennen vasenta reunaa (% oikeasta reunasta laskien)
            background: `linear-gradient(to left, ${ophColors.grey100}, rgba(255, 255, 255, 0) 80%)`,
            ...maskSx(STRIPE_MASK),
          }}
        />
        <Box
          className="hero-image"
          sx={{
            // Normaalissa virrassa, joten hero on kuvan korkuinen. relative piirtää kuvan raidan päälle ja toimii tekstilaatikon sijoituskontekstina.
            position: 'relative',
            backgroundImage: `url(${HeroImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
            aspectRatio: `${WIDTH} / ${IMAGE_HEIGHT}`,
            // Ilman tätä aspectRatio on vain toivekorkeus ja sisältö voi venyttää laatikkoa kuvaa
            // korkeammaksi (aspect-ratio-laatikon oletus min-height: auto)
            minHeight: 0,
            ...maskSx(IMAGE_MASK),
          }}>
          <Box
            className="hero-content"
            sx={{
              // margin-/padding-%:t lasketaan aina vanhemman leveydestä. Absoluuttisesti sijoitetun
              // elementin top-% lasketaan sen sijaan vanhemman (hero-image) korkeudesta.
              position: 'absolute',
              // left/right 0 + maxWidth + auto-marginaalit keskittävät absoluuttisen laatikon
              left: 0,
              right: 0,
              maxWidth: `${CONTENT_MAX_WIDTH}px`,
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingX: 8,
            }}>
            {/* Teksti enintään sisältöpalstan puoleen väliin asti */}
            <Box
              sx={{
                maxWidth: '52%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginTop: TEXT_TOP_MARGIN,
              }}>
              <h1>Opintopolku</h1>
              <hr />
              <p>
                Kaikki Suomen koulutukset ja oppilaitokset yhdessä palvelussa. Opintopolku
                tarjoaa myös kielitutkintojen suorittamista sekä ulkomailla suoritettujen
                tutkintojen tunnustamista Suomessa.
              </p>
            </Box>
          </Box>
        </Box>
      </HeroWrapper>
      {/* Sivun sisältö: enintään CONTENT_MAX_WIDTH levyinen ja keskitetty, kuten heron teksti */}
      <Box
        className="page-content"
        sx={{
          // Piirretään raidan päälle (raita on absoluuttisesti sijoitettu ja jatkuu kuvan alle)
          position: 'relative',
          width: '100%',
          maxWidth: `${CONTENT_MAX_WIDTH}px`,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingX: 8,
          paddingY: 2,
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
        }}>
        Tekstiä tähän osioon...
      </Box>
    </Box>
  );
};
