import React, { useMemo } from 'react';

import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { AccordionWithTitle } from '#/src/components/common/AccordionWithTitle';
import { ContentWithTopIcon } from '#/src/components/common/ContentWithTopIcon';
import ContentWrapper from '#/src/components/common/ContentWrapper';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import Murupolku from '#/src/components/common/Murupolku';
import Spacer from '#/src/components/common/Spacer';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import { useUrlParams } from '#/src/components/hakutulos/UseUrlParams';
import { Heading } from '#/src/components/Heading';
import { useOppilaitokset } from '#/src/components/oppilaitos/hooks';
import { useSideMenu } from '#/src/hooks';
import { getHakuParams, getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize, localizeLukiolinja } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus, sanitizedHTMLParser } from '#/src/tools/utils';
import { Hakutieto } from '#/src/types/ToteutusTypes';

import { useKoulutus } from '../koulutus/hooks';
import { Asiasanat } from './Asiasanat';
import { Diplomit } from './Diplomit';
import { HakuKaynnissaCard } from './HakuKaynnissaCard';
import { useToteutus } from './hooks';
import { KielivalikoimaBox } from './KielivalikoimaBox';
import { Osaamisalat } from './Osaamisalat';
import { ToteutuksenYhteystiedot } from './ToteutuksenYhteystiedot';
import { ToteutusHakutiedot } from './ToteutusHakutiedot';
import { ToteutusInfoGrid } from './ToteutusInfoGrid';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  oppilaitosHeadingSpan: {
    ...theme.typography.body1,
    marginTop: '20px',
    fontSize: '1.25rem',
    textAlign: 'center',
  },
  toteutusHeading: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
  },
  yhteystiedotLink: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '300px',
    width: '300px',
    display: 'inline-block',
  },
}));

export const ToteutusPage = () => {
  const classes = useStyles();
  const { oid } = useParams<{ oid: string }>();
  const { t } = useTranslation();
  const { isDraft } = useUrlParams();

  const { state: menuVisible } = useSideMenu();

  // TODO: There is absolutely no error handling atm.
  const { data: toteutus, isLoading: toteutusLoading } = useToteutus({
    oid,
    isDraft,
  });

  const koulutusOid = toteutus?.koulutusOid;
  const {
    kuvaus,
    painotukset = [],
    erityisetKoulutustehtavat = [],
    opetus = {},
    yhteyshenkilot = [],
    diplomit = [],
    kielivalikoima,
    ammatillinenPerustutkintoErityisopetuksena,
    jarjestetaanErityisopetuksena,
  } = toteutus?.metadata ?? {};

  const { data: koulutus, isLoading: koulutusLoading } = useKoulutus({
    oid: koulutusOid,
    isDraft,
  });

  const oppilaitokset = useOppilaitokset({
    isOppilaitosOsa: false,
    oids: toteutus?.oppilaitokset || [],
  });

  const hasOppilaitokset = oppilaitokset.length > 0;
  const oppilaitostenNimet = hasOppilaitokset
    ? oppilaitokset.map((oppilaitos) => `${localize(oppilaitos?.data?.nimi)}`).join(', ')
    : '';
  const oppilaitoksenNimiMurupolku = oppilaitostenNimet ? `${oppilaitostenNimet}, ` : '';

  const hakutiedot = toteutus?.hakutiedot;

  const loading =
    koulutusLoading ||
    toteutusLoading ||
    (hasOppilaitokset && _.some(oppilaitokset, 'isLoading'));

  const hasAnyHakukohde = _.some(hakutiedot, (v: Hakutieto) => v.hakukohteet.length > 0);
  const hakuUrl = useSelector(getHakuUrl);
  const { hakuParamsStr } = useSelector(getHakuParams);

  const combinedLisatiedot = useMemo(
    () => [...(koulutus?.lisatiedot || []), ...(opetus?.lisatiedot || [])],
    [koulutus?.lisatiedot, opetus?.lisatiedot]
  );

  const erityisopetusHeading = t('toteutus.erityisopetus-otsikko');
  let erityisopetusText = '';
  if (ammatillinenPerustutkintoErityisopetuksena) {
    erityisopetusText = t('toteutus.amm-erityisopetus-teksti');
  } else if (jarjestetaanErityisopetuksena) {
    erityisopetusText = t('toteutus.tuva-erityisopetus-teksti');
  }

  return loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <Box width="100%" alignSelf="start">
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl.url },
              {
                name: localize(koulutus?.tutkintoNimi),
                link: `/koulutus/${toteutus?.koulutusOid}?${hakuParamsStr}`,
              },
              { name: `${oppilaitoksenNimiMurupolku}${localize(toteutus?.nimi)}` },
            ]}
          />
        </Box>
        <Typography className={classes.oppilaitosHeadingSpan} variant="h2" component="h2">
          {oppilaitostenNimet}
        </Typography>
        <Heading className={classes.toteutusHeading} variant="h1">
          {localize(toteutus?.nimi)}
        </Heading>
        {erityisopetusHeading && erityisopetusText && (
          <ContentWithTopIcon>
            <Box mb={1}>
              <Typography component="div" variant="h5">
                {erityisopetusHeading}
              </Typography>
            </Box>
            <Typography>{erityisopetusText}</Typography>
          </ContentWithTopIcon>
        )}
        <Asiasanat toteutus={toteutus} />
        <Box mt={6}>
          <TeemakuvaImage
            imgUrl={toteutus?.teemakuva}
            altText={t('toteutus.toteutuksen-teemakuva')}
          />
        </Box>
        <Box mt={4}>
          <ToteutusInfoGrid
            laajuus={getLocalizedOpintojenLaajuus(koulutus)}
            opetus={opetus!}
            hasHaku={hasAnyHakukohde}
          />
        </Box>
        {toteutus?.hakuAukiType && (
          <HakuKaynnissaCard
            title={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.haku-kaynnissa')
                : toteutus?.metadata.hakutermi === 'hakeutuminen'
                ? t('toteutus.haku-kaynnissa')
                : t('toteutus.ilmoittautuminen-kaynnissa')
            }
            text={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.katso-hakukohteet')
                : toteutus?.metadata.hakutermi === 'hakeutuminen'
                ? t('toteutus.katso-hakeutumisen-ohjeet')
                : t('toteutus.katso-ilmoittautumisen-ohjeet')
            }
            link={
              <HashLink
                to="#haut"
                aria-label="anchor"
                smooth
                style={{ textDecoration: 'none' }}
              />
            }
            buttonText={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.nayta-hakukohteet')
                : t('toteutus.nayta-ohjeet')
            }
          />
        )}
        {kuvaus && (
          <HtmlTextBox
            heading={t('koulutus.kuvaus')}
            html={localize(kuvaus)}
            className={classes.root}
          />
        )}
        {!_.isEmpty(painotukset) && (
          <AccordionWithTitle
            titleTranslationKey="toteutus.painotukset"
            data={painotukset.map((painotus: any) => ({
              title: localizeLukiolinja(painotus.koodi),
              content: <LocalizedHTML data={painotus?.kuvaus} />,
            }))}
          />
        )}
        {!_.isEmpty(erityisetKoulutustehtavat) && (
          <AccordionWithTitle
            titleTranslationKey="toteutus.erityiset-koulutustehtavat"
            data={erityisetKoulutustehtavat.map((koulutustehtava: any) => ({
              title: localizeLukiolinja(koulutustehtava?.koodi),
              content: <LocalizedHTML data={koulutustehtava?.kuvaus} />,
            }))}
          />
        )}
        <KielivalikoimaBox kielivalikoima={kielivalikoima} />
        <Diplomit diplomit={diplomit} />
        <Osaamisalat toteutus={toteutus!} koulutus={koulutus} />
        <ToteutusHakutiedot toteutus={toteutus} />
        {combinedLisatiedot.length > 0 && (
          <AccordionWithTitle
            titleTranslationKey="koulutus.lisätietoa"
            data={combinedLisatiedot.map((lisatieto) => ({
              title: localize(lisatieto.otsikko),
              content: sanitizedHTMLParser(localize(lisatieto.teksti)),
            }))}
          />
        )}
        {yhteyshenkilot?.length > 0 && (
          <Box mt={12} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h2">{t('toteutus.yhteyshenkilot')}</Typography>
            <Spacer />
            <Box mt={5}>
              <Grid
                container
                direction="row"
                spacing={8}
                justifyContent="flex-start"
                alignItems="flex-start">
                {yhteyshenkilot?.map((yhteyshenkilo: any, i: number) => (
                  <Grid
                    item
                    key={i}
                    xs={12}
                    sm={menuVisible ? 12 : 6}
                    md={menuVisible ? 12 : 6}
                    lg={6}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography variant="h5">
                          {localize(yhteyshenkilo.nimi)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          {localize(yhteyshenkilo.titteli)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          {localize(yhteyshenkilo.sahkoposti)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          {localize(yhteyshenkilo.puhelinnumero)}
                        </Typography>
                      </Grid>
                      {!_.isEmpty(yhteyshenkilo.wwwSivu) && (
                        <Grid item>
                          <ExternalLink
                            className={classes.yhteystiedotLink}
                            href={localize(yhteyshenkilo.wwwSivu)}>
                            {localize(yhteyshenkilo.wwwSivu)}
                          </ExternalLink>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
        {!_.isEmpty(toteutus?.oppilaitokset) && (
          <ToteutuksenYhteystiedot
            oids={_fp.uniq(toteutus!.oppilaitokset.concat(toteutus!.organisaatiot))}
          />
        )}
      </Box>
    </ContentWrapper>
  );
};
