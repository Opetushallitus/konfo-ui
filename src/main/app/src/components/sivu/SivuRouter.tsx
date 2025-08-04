import { Box, Grid, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate } from 'react-router-dom';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useContentful } from '#/src/hooks/useContentful';
import { resolveNewSlug } from '#/src/tools/slugUtils';

import { Sivu } from './Sivu';
import { Heading } from '../Heading';

const NotFound = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation();

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {loading ? null : (
        <Grid item xs={12} sm={6} md={6} margin={1}>
          <Heading>{t('sisaltohaku.sivua-ei-löytynyt')}</Heading>
          <Typography>{t('sisaltohaku.etsimääsi-ei-löydy')}</Typography>
          <Box marginTop={2}>
            <Link href="/">{t('sisaltohaku.takaisin')}</Link>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export const SivuRouter = () => {
  const { id: slug, lng: lngParam } = useParams();
  const { data, slugsToIds, isLoading } = useContentful();
  const { sivu } = data;

  const maailmalleSuljettuSlugFi: string =
    'opintopolun-maailmalle-osio-poistuu-heinakuussa';
  const maailmalleSuljettuSlugSv: string =
    'studieinfos-ut-i-vaerlden-sidor-tas-bort-i-juli';

  const vanhatMaailmalleSivustoSlugs: Array<string> = [
    'miksi-maailmalle',
    'kansainvalinen-osaaminen',
    'kokemuksia-kansainvalisyydesta',
    'kansainvalisia-opintoja-ja-kokemuksia-madridissa',
    'vapaaehtoistyo-virossa-lisasi-vilin-hyvinvointia',
    'hyvin-suoritettu-ammatillinen-harjoittelu-saksassa-poiki-jatkopestin',
    'salibandya-kiinassa-ja-palloilua-kenguruiden-keskella-australiassa',
    'kielikahvila-on-rento-paikka-kartuttaa-kielitaitoa-ja-tutustua-uusiin-kulttuureihin',
    'kotimaassa-kansainvaliseksi-eveliina-nauttii-monikulttuurisista-kohtaamisista',
    'kiinnostus-historiaan-vei-uulan-antiikin-lahteille-valimerelle',
    'vapaaehtoistoissa-puolassa-ilman-yhteista-kielta',
    'vapaaehtoistyo-vietnamissa-johdatti-alman-vaihto-opiskelijaksi-saksaan',
    'opiskelu-ulkomailla',
    'opiskelijavaihdot-osana-tutkintoa',
    'toisen-asteen-opinnot-ulkomailla',
    'tutkinto-opiskelu-ulkomailla',
    'hakeminen-tutkinto-opiskelijaksi-ulkomaille',
    'ulkomailla-opiskelun-kustannukset-ja-rahoitus',
    'tietoa-korkeakouluopinnoista-maittain',
    'ammattiin-opiskelevien-tyopaikalla-tapahtuva-oppiminen-ja-vastavalmistuneiden-harjoittelu',
    'korkeakoulusta-haettava-harjoittelutuki',
    'korkeakouluopiskelijoiden-ja-vastavalmistuneiden-harjoitteluohjelmia',
    'muita-harjoittelumahdollisuuksia',
    'tyoskentely-ulkomailla',
    'muita-mahdollisuuksia-kansainvalistya',
    'vapaaehtoistyo',
    'Erasmus+-nuorisovaihdot-ja-DiscoverEU',
    'kansainvalisia-kokemuksia-alle-18-vuotiaana',
    'maailmalle-net',

    'varfor-ut-i-varlden',
    'internationella-kunskaper',
    'erfarenheter-av-internationalisering',
    'internationella-studier-och-erfarenheter-i-madrid',
    'volontararbetet-i-estland-okade-vilis-valmaende',
    'yrkespraktiken-i-tyskland-gav-flera-mojligheter',
    'innebandy-i-kina-och-bollspel-med-kangurur-i-australien',
    'pa-sprakcafeet-kan-man-forbattra-sin-sprakkunskap-och-bekanta-sig-med-nya-kulturer',
    'internationell-i-hemlandet-eveliina-tycker-om-att-traffa-manniskor-fran-olika-kulturer',
    'intresset-for-historia-forde-Uula-till-antikens-kallor-vid-Medelhavet',
    'som-frivilligarbetare-i-polen-utan-ett-gemensamt-sprak',
    'volontararbetet-i-vietnam-ledde-alma-till-utbytesstudier-i-tyskland',
    'studier-utomlands',
    'studentutbyte-som-en-del-av-examen',
    'andra-stadiets-studier-utomlands',
    'examensstudier-utomlands',
    'att-ansoka-om-plats-som-examensstuderande-utomlands',
    'kostnader-och-finansiering-av-studierna',
    'information-om-hogskolestudier-i-olika-lander',
    'yrkesstuderandes-studier-pa-en-arbetsplats-och-praktik-for-nyutexaminerade',
    'sok-praktikbidrag-hos-den-egna-hogskolan',
    'praktikprogram-for-hogskolestuderande-och-nyutexaminerade',
    'ovriga-mojligheter-till-praktik',
    'arbete-utomlands',
    'andra-mojligheter-att-bli-internationell',
    'volontararbete',
    'Erasmus+-ungdomsutbyte-och-DiscoverEU',
    'internationella-erfarenheter-for-unga-under-18-ar',
    'maailmalle-net-sv',
  ];

  if (isLoading) {
    return <LoadingCircle />;
  }
  if (slug && lngParam) {
    if (vanhatMaailmalleSivustoSlugs.includes(slug)) {
      return (
        <Navigate
          to={`/${lngParam}/sivu/${
            lngParam === 'sv' ? maailmalleSuljettuSlugSv : maailmalleSuljettuSlugFi
          }`}
          replace
        />
      );
    }
    const idInfo = slugsToIds?.[slug];
    if (idInfo?.language === lngParam) {
      if (sivu[slug]) {
        return <Sivu id={slug} />;
      } else {
        return <NotFound loading={isLoading} />;
      }
    } else {
      const newSlug = resolveNewSlug(slugsToIds, idInfo, lngParam);
      if (newSlug) {
        return <Navigate to={`/${lngParam}/sivu/${newSlug}`} replace />;
      }
    }
  }
  return <NotFound loading={isLoading} />;
};
