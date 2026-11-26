import { useCallback, useState } from 'react';

import { Box, Paper, SxProps, Theme, useMediaQuery } from '@mui/material';
import {
  OphButton,
  ophColors,
  OphLink,
  OphTypography,
} from '@opetushallitus/oph-design-system';
import { isEmpty } from 'lodash-es';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';

import EHoksIcon from '#/src/assets/images/palvelu-icons/ehoks.png';
import EPerusteetIcon from '#/src/assets/images/palvelu-icons/eperusteet.png';
import EuropassiIcon from '#/src/assets/images/palvelu-icons/europassi.png';
import OpetushallitusIcon from '#/src/assets/images/palvelu-icons/opetushallitus.png';
import OpintopolkuKnotIcon from '#/src/assets/images/palvelu-icons/opintopolku-knot-color.svg';
import OsaamispolkuIcon from '#/src/assets/images/palvelu-icons/osaamispolku.png';
import StudyInFinlandIcon from '#/src/assets/images/palvelu-icons/study-in-finland.png';
import HeroImageDesktop from '#/src/assets/images/herokuva_opintopolku_etusivu_desktop.jpg';
import HeroImageMobile from '#/src/assets/images/herokuva_opintopolku_etusivu_mobiili.jpg';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Hakupalkki } from '#/src/components/haku/Hakupalkki';
import { useAllSelectedFilters, useSearch } from '#/src/components/haku/hakutulosHooks';
import { RajaimetPopover } from '#/src/components/haku/RajaimetPopover';
import {
  RajaaButton,
  RajaimetDrawer,
} from '#/src/components/opintopolku-etusivu/OpintopolkuEtusivuRajaimet';
import { WithSideMargins } from '#/src/components/WithSideMargins';
import { styled } from '#/src/theme';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, useTheme } from '@mui/system';

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

const SectionHeading = styled(OphTypography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 400,
  marginBottom: theme.spacing(4),
}));

// Hakupalkki rajaa-painikkeella ja linkki kaikkiin hakutuloksiin (kuten nykyisen etusivun Jumpotronissa)
const EtusivuHaku = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = useCallback(() => setDrawerOpen((open) => !open), []);
  // Isoilla näytöillä rajaimet popoverissa, pienillä alhaalta avautuvassa laatikossa
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const { koulutusData, isFetching } = useSearch();
  const allSelectedFilters = useAllSelectedFilters();
  const selectedCount = allSelectedFilters?.flat?.length ?? 0;
  const hasFilters = !isEmpty(koulutusData?.filters);

  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {hasFilters && isMdUp && (
        <RajaimetPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      )}
      {hasFilters && !isMdUp && (
        <RajaimetDrawer
          isOpen={isDrawerOpen}
          toggleOpen={toggleDrawer}
          selectedCount={selectedCount}
        />
      )}
      <Stack>
        <SectionHeading component="h2">
          {t('opintopolku-etusivu.hae-otsikko')}
        </SectionHeading>
        <Hakupalkki
          variant="oph"
          // Isoilla näytöillä rajaa-painike hakukentän sisällä, pienillä linkin vieressä (alla)
          rajaaButton={
            hasFilters && isMdUp ? (
              <RajaaButton
                isOpen={isPopoverOpen}
                isLoading={isFetching}
                selectedCount={selectedCount}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              />
            ) : null
          }
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            marginTop: theme.spacing(1),
          }}>
          {isSmall ? (
            <OphLink component={RouterLink} to="/haku">
              {t('opintopolku-etusivu.nayta-kaikki')}
            </OphLink>
          ) : (
            <OphButton
              component={RouterLink}
              to="/haku"
              variant={isSmall ? 'text' : 'outlined'}>
              {t('opintopolku-etusivu.nayta-kaikki')}
            </OphButton>
          )}
          {hasFilters && !isMdUp && (
            <RajaaButton
              isOpen={isDrawerOpen}
              isLoading={isFetching}
              selectedCount={selectedCount}
              onClick={toggleDrawer}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

// Linkkinä toimivien laatikoiden yhteinen tyyli: ei linkin alleviivausta koko laatikolle, vaan
// otsikko alleviivataan, kun laatikon päällä on hiiri tai näppäimistön kohdistus
const LINK_PAPER_SX = {
  textDecoration: 'none',
  '&:hover h3, &:focus-visible h3': {
    textDecoration: 'underline',
  },
};

const KoulutustietoPaper = ({
  icon,
  heading,
  text,
  backgroundColor,
  to,
  sx,
}: {
  icon: MaterialIconName;
  heading: string;
  text: string;
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
    <MaterialIcon icon={icon} variant="outlined" aria-hidden sx={{ fontSize: '64px' }} />
    <PaperHeading color="inherit">{heading}</PaperHeading>
    <OphTypography sx={{ color: 'inherit' }}>{text}</OphTypography>
  </Paper>
);

const KOULUTUSTIETO_LINKS = {
  hakeutuminenKoulutukseen: '/',
  kielitutkinnot: '/kielitutkinnot',
  tutkintojenTunnustaminen: '/tutkintojen-tunnustaminen',
};

const Koulutustieto = () => {
  const { t } = useTranslation();

  return (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">
        {t('opintopolku-etusivu.koulutustieto.otsikko')}
      </SectionHeading>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 4,
        }}>
        <KoulutustietoPaper
          icon="school"
          heading={t(
            'opintopolku-etusivu.koulutustieto.hakeutuminen-koulutukseen-otsikko'
          )}
          text={t('opintopolku-etusivu.koulutustieto.hakeutuminen-koulutukseen-teksti')}
          backgroundColor={ophColors.green2}
          to={KOULUTUSTIETO_LINKS.hakeutuminenKoulutukseen}
          sx={{ gridColumn: '1 / -1' }}
        />
        <KoulutustietoPaper
          icon="language"
          heading={t('opintopolku-etusivu.koulutustieto.kielitutkinnot-otsikko')}
          text={t('opintopolku-etusivu.koulutustieto.kielitutkinnot-teksti')}
          backgroundColor={ophColors.cyan1}
          to={KOULUTUSTIETO_LINKS.kielitutkinnot}
        />
        <KoulutustietoPaper
          icon="home_work"
          heading={t(
            'opintopolku-etusivu.koulutustieto.tutkintojen-tunnustaminen-otsikko'
          )}
          text={t('opintopolku-etusivu.koulutustieto.tutkintojen-tunnustaminen-teksti')}
          backgroundColor={ophColors.cyan1}
          to={KOULUTUSTIETO_LINKS.tutkintojenTunnustaminen}
        />
      </Box>
    </Box>
  );
};

const PaperHeading = ({
  children,
  color,
  fontWeight = 600,
}: {
  children: React.ReactNode;
  color: string;
  fontWeight?: number;
}) => (
  <OphTypography component="h3" sx={{ fontSize: '24px', color, fontWeight }}>
    {children}
  </OphTypography>
);

const KirjautuneenPalvelut = () => {
  const { t } = useTranslation();

  return (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">
        {t('opintopolku-etusivu.kirjautuneen-palvelut.otsikko')}
      </SectionHeading>
      <Paper
        component="a"
        href={urls.url('oma-opintopolku')}
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
        <Box component="img" src={OpintopolkuKnotIcon} alt="" sx={{ height: '38px' }} />
        <PaperHeading color={ophColors.green2}>
          {t('opintopolku-etusivu.kirjautuneen-palvelut.oma-opintopolku-otsikko')}
        </PaperHeading>
        <OphTypography sx={{ color: 'inherit' }}>
          {t('opintopolku-etusivu.kirjautuneen-palvelut.oma-opintopolku-teksti')}
        </OphTypography>
      </Paper>
    </Box>
  );
};

const MUUT_PALVELUT = [
  { id: 'opetushallitus', icon: OpetushallitusIcon },
  { id: 'eperusteet', icon: EPerusteetIcon },
  { id: 'ehoks', icon: EHoksIcon },
  { id: 'osaamispolku', icon: OsaamispolkuIcon },
  { id: 'study-in-finland', icon: StudyInFinlandIcon },
  { id: 'europassi', icon: EuropassiIcon },
];

// Muut palvelut -osio: kuusi valkoista laatikkoa, isoilla näytöillä kolme rivissä. Kuvake otsikon
// vasemmalla puolella ja sisältö tasattu vasemmalle.
const MUUT_PALVELUT_MIN_WIDTH = '300px';

const MuutPalvelut = () => {
  const { t, i18n } = useTranslation();

  return (
    <Box component="section" sx={{ marginTop: 6 }}>
      <SectionHeading component="h2">
        {t('opintopolku-etusivu.muut-palvelut.otsikko')}
      </SectionHeading>
      <Box
        sx={{
          display: 'grid',
          // Laatikot rivittyvät käytettävissä olevan leveyden mukaan: jokainen vähintään
          // MUUT_PALVELUT_MIN_WIDTH levyinen (tai koko leveys, jos tilaa on vähemmän) ja enintään
          // kolme rivissä (1/3 leveydestä kahden 32px välin jälkeen)
          gridTemplateColumns: `repeat(auto-fill, minmax(max(min(100%, ${MUUT_PALVELUT_MIN_WIDTH}), calc((100% - 64px) / 3)), 1fr))`,
          gap: 4,
        }}>
        {MUUT_PALVELUT.map(({ id, icon }) => (
          <Paper
            key={id}
            component="a"
            // Osa osoitteista on kielikohtaisia, joten kieli välitetään parametrina ($1)
            href={urls.url(`muut-palvelut.${id}`, i18n.language)}
            sx={{
              position: 'relative',
              color: ophColors.grey900,
              ...LINK_PAPER_SX,
              borderRadius: '10px',
              // Laaja varjo, joka näkyy selvästi myös yläreunassa (ei siirretty alaspäin)
              boxShadow: '3px 3px 10px 4px rgba(0, 0, 0, 0.12)',
              paddingX: 2.5,
              paddingY: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              gap: 2,
            }}>
            <MaterialIcon
              icon="arrow_forward"
              aria-hidden
              sx={{ position: 'absolute', top: 30, right: 16, color: ophColors.grey500 }}
            />
            {/* Oikea reunus jättää tilaa nuolelle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingRight: 4 }}>
              <Box component="img" src={icon} alt="" sx={{ height: '40px' }} />
              <PaperHeading color="inherit" fontWeight={400}>
                {t(`opintopolku-etusivu.muut-palvelut.${id}-otsikko`)}
              </PaperHeading>
            </Box>
            <OphTypography sx={{ color: 'inherit' }}>
              {t(`opintopolku-etusivu.muut-palvelut.${id}-teksti`)}
            </OphTypography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

const HeroImageContent = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <HeroWrapper>
      {/* Kuva normaalissa virrassa koko heron levyisenä, joten hero on kuvan korkuinen ilman
            että kuvan mittoja tarvitsee tietää. Isolla näytöllä negatiivinen alamarginaali nostaa
            sivun sisällön kuvan alaosan (raidan) päälle. Pienen näytön kuvassa ei ole raitaa. */}
      <Box
        component="img"
        className="hero-image"
        src={isSmallScreen ? HeroImageMobile : HeroImageDesktop}
        alt=""
      />
      <Box className="hero-content">
        {/* Sivumarginaalit samoin kuin footerissa ja palveluissa */}
        <WithSideMargins>
          {/* Teksti enintään sisältöpalstan puoleen väliin asti */}
          <Box className="hero-text">
            <h1>Opintopolku</h1>
            <hr />
            <p>
              Kaikki Suomen koulutukset ja oppilaitokset yhdessä palvelussa. Opintopolku
              tarjoaa myös kielitutkintojen suorittamista sekä ulkomailla suoritettujen
              tutkintojen tunnustamista Suomessa.
            </p>
          </Box>
        </WithSideMargins>
      </Box>
    </HeroWrapper>
  );
};

export const OpintopolkuEtusivu = () => {
  return (
    <Box sx={{ width: '100%', minHeight: 0 }}>
      <HeroImageContent />
      {/* Sivun sisältö: sivumarginaalit samoin kuin footerissa ja palveluissa.
          position: relative on välttämätön: isolla näytöllä sisältö nousee hero-kuvan alaosan
          päälle, ja koska hero on sijoitettu (relative), se piirrettäisiin muuten sisällön päälle. */}
      <Box sx={{ position: 'relative', marginTop: 4 }}>
        <WithSideMargins>
          <EtusivuHaku />
          <Koulutustieto />
          <KirjautuneenPalvelut />
          <MuutPalvelut />
        </WithSideMargins>
      </Box>
    </Box>
  );
};
