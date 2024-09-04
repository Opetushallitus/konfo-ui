import React, { useMemo } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { some, isEmpty, uniq } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Accordion } from '#/src/components/common/Accordion';
import { ContentWrapper } from '#/src/components/common/ContentWrapper';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import { HtmlTextBox } from '#/src/components/common/HtmlTextBox';
import { InfoBanner } from '#/src/components/common/InfoBanner';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Murupolku } from '#/src/components/common/Murupolku';
import { PageSection } from '#/src/components/common/PageSection';
import { TeemakuvaImage } from '#/src/components/common/TeemakuvaImage';
import { TextButtonLink } from '#/src/components/common/TextButtonLink';
import { Heading } from '#/src/components/Heading';
import { useOppilaitokset } from '#/src/components/oppilaitos/hooks';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { useSideMenu } from '#/src/hooks';
import { NotFound } from '#/src/NotFound';
import { getHakuParams, getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { styled } from '#/src/theme';
import { localize, localizeLukiolinja } from '#/src/tools/localization';
import { useUrlParams } from '#/src/tools/useUrlParams';
import { getLocalizedOpintojenLaajuus, sanitizedHTMLParser } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';
import { Hakutieto, OppilaitosOsa } from '#/src/types/ToteutusTypes';

import { Asiasanat } from './Asiasanat';
import { Diplomit } from './Diplomit';
import { HakuKaynnissaCard } from './HakuKaynnissaCard';
import { useToteutus } from './hooks';
import { KielivalikoimaBox } from './KielivalikoimaBox';
import { Opintojaksot } from './Opintojaksot';
import { Opintokokonaisuudet } from './Opintokokonaisuudet';
import { Osaamisalat } from './Osaamisalat';
import { ToteutuksenYhteystiedot } from './ToteutuksenYhteystiedot';
import { ToteutusHakutiedot } from './ToteutusHakutiedot';
import { ToteutusInfoGrid } from './ToteutusInfoGrid';
import { useKoulutus } from '../koulutus/hooks';
import { PisteContainer } from '../laskuri/PisteContainer';
import { showPisteLaskuri } from '../laskuri/PisteLaskuriUtil';

const InnerWrapper = styled('div')({
  maxWidth: '100vw',
  padding: '0 0.4rem',
});

const OppilaitosHeadingText = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  marginTop: '20px',
  fontSize: '1.25rem',
  textAlign: 'center',
}));

const OppilaitosHeadingLink = styled(TextButtonLink)({
  display: 'flex',
  fontSize: '1.25rem',
  textDecoration: 'none',
  textAlign: 'center',
  flexShrink: 0,
});

const ToteutusHeading = styled(Heading)({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
});

const YhteystiedotLink = styled(ExternalLink)({
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  maxWidth: '300px',
  width: '300px',
});

export const ToteutusPage = () => {
  const { oid } = useParams<{ oid: string }>();
  const { t } = useTranslation();
  const { isDraft } = useUrlParams();

  const { state: menuVisible } = useSideMenu();

  const { data: toteutus, status: toteutusStatus } = useToteutus({
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
    tyyppi,
  } = toteutus?.metadata ?? {};

  const { data: koulutus, status: koulutusStatus } = useKoulutus({
    oid: koulutusOid,
    isDraft,
  });

  const opintojaksot = toteutus?.liitetytOpintojaksot;
  const kuuluuOpintokokonaisuuksiin = toteutus?.kuuluuOpintokokonaisuuksiin;

  const oppilaitokset = useOppilaitokset({
    isOppilaitosOsa: false,
    oids: toteutus?.oppilaitokset || [],
  });

  const hasOppilaitokset = oppilaitokset.length > 0;
  const oppilaitosTiedot = oppilaitokset.map((oppilaitos) => {
    return { nimi: oppilaitos?.data?.nimi, oid: oppilaitos?.data?.oid };
  });
  const oppilaitosOid = isEmpty(oppilaitosTiedot) ? '' : oppilaitosTiedot[0].oid;

  const oppilaitostenNimet = isEmpty(oppilaitosTiedot)
    ? ''
    : oppilaitosTiedot
        .map(
          (oppilaitos: { nimi: Translateable; oid: string }) =>
            `${localize(oppilaitos.nimi)}`
        )
        .join(', ');
  const oppilaitoksenNimiMurupolku = oppilaitostenNimet ? `${oppilaitostenNimet}, ` : '';

  const hakutiedot = toteutus?.hakutiedot;

  const isAvoinKorkeakoulutus = toteutus?.metadata?.isAvoinKorkeakoulutus;

  const notFound = koulutusStatus === 'error' || toteutusStatus === 'error';

  const loading =
    !notFound &&
    (koulutusStatus === 'loading' ||
      toteutusStatus === 'loading' ||
      (hasOppilaitokset && some(oppilaitokset, 'isLoading')));

  const hasAnyHakukohde = some(hakutiedot, (v: Hakutieto) => v.hakukohteet.length > 0);
  const hakuUrl = useSelector(getHakuUrl);
  const { hakuParamsStr } = useSelector(getHakuParams);

  const combinedLisatiedot = useMemo(
    () => [...(koulutus?.lisatiedot || []), ...(opetus?.lisatiedot || [])],
    [koulutus?.lisatiedot, opetus?.lisatiedot]
  );

  const showLaskuri = showPisteLaskuri(
    toteutus,
    tyyppi,
    ammatillinenPerustutkintoErityisopetuksena
  );

  const erityisopetusHeading = t('toteutus.erityisopetus-otsikko');
  let erityisopetusText = '';
  if (ammatillinenPerustutkintoErityisopetuksena) {
    erityisopetusText = t('toteutus.amm-erityisopetus-teksti');
  } else if (jarjestetaanErityisopetuksena) {
    erityisopetusText = t('toteutus.tuva-erityisopetus-teksti');
  }
  const oppilaitosOsat: Array<OppilaitosOsa> =
    hasOppilaitokset && oppilaitokset[0]?.data?.osat;

  return notFound ? (
    <NotFound />
  ) : loading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <InnerWrapper>
        <Box width="100%" alignSelf="start">
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl },
              {
                name: localize(koulutus?.tutkintoNimi),
                link: `/koulutus/${toteutus?.koulutusOid}?${hakuParamsStr}`,
              },
              { name: `${oppilaitoksenNimiMurupolku}${localize(toteutus?.nimi)}` },
            ]}
          />
        </Box>
        {isEmpty(oppilaitosOid) ? (
          <OppilaitosHeadingText variant="h2">{oppilaitostenNimet}</OppilaitosHeadingText>
        ) : (
          <OppilaitosHeadingLink href={`/oppilaitos/${oppilaitosOid}`} target="_blank">
            {oppilaitostenNimet}
          </OppilaitosHeadingLink>
        )}
        <ToteutusHeading variant="h1">{localize(toteutus?.nimi)}</ToteutusHeading>
        {erityisopetusHeading && erityisopetusText && (
          <InfoBanner
            heading={erityisopetusHeading}
            bodytext={erityisopetusText}
            icon={<MaterialIcon icon="directions" variant="outlined" />}
          />
        )}
        <Asiasanat toteutus={toteutus} />
        <Box mt={6}>
          <TeemakuvaImage
            imgUrl={toteutus?.teemakuva}
            altText={t('toteutus.toteutuksen-teemakuva')}
          />
        </Box>
        <PageSection heading={t('koulutus.tiedot')}>
          <ToteutusInfoGrid
            laajuus={getLocalizedOpintojenLaajuus(toteutus, koulutus)}
            opetus={opetus!}
            hasHaku={hasAnyHakukohde}
            koulutustyyppi={koulutus?.koulutustyyppi}
            isAvoinKorkeakoulutus={isAvoinKorkeakoulutus}
            tunniste={toteutus?.metadata?.tunniste}
            opinnonTyyppi={toteutus?.metadata?.opinnonTyyppi}
            taiteenala={toteutus?.metadata?.taiteenala}
          />
        </PageSection>
        {toteutus?.hakuAuki && (
          <HakuKaynnissaCard
            title={
              toteutus?.metadata.hakutermi === 'ilmoittautuminen'
                ? t('toteutus.ilmoittautuminen-kaynnissa')
                : t('toteutus.haku-kaynnissa')
            }
            text={
              hasAnyHakukohde
                ? t('toteutus.katso-hakukohteet')
                : toteutus?.metadata.hakutermi === 'hakeutuminen'
                ? t('toteutus.katso-hakeutumisen-ohjeet')
                : t('toteutus.katso-ilmoittautumisen-ohjeet')
            }
            href="#haut"
            buttonText={
              hasAnyHakukohde
                ? t('toteutus.nayta-hakukohteet')
                : t('toteutus.nayta-ohjeet')
            }
          />
        )}
        {!isEmpty(kuvaus) && (
          <HtmlTextBox heading={t('koulutus.kuvaus')} html={localize(kuvaus)} />
        )}
        {!isEmpty(painotukset) && (
          <PageSection heading={t('toteutus.painotukset')}>
            <Accordion
              items={painotukset.map((painotus: any) => ({
                title: localizeLukiolinja(painotus.koodi),
                content: <LocalizedHTML data={painotus?.kuvaus} />,
              }))}
            />
          </PageSection>
        )}
        {!isEmpty(erityisetKoulutustehtavat) && (
          <PageSection heading={t('toteutus.erityiset-koulutustehtavat')}>
            <Accordion
              items={erityisetKoulutustehtavat.map((koulutustehtava: any) => ({
                title: localizeLukiolinja(koulutustehtava?.koodi),
                content: <LocalizedHTML data={koulutustehtava?.kuvaus} />,
              }))}
            />
          </PageSection>
        )}
        <KielivalikoimaBox kielivalikoima={kielivalikoima} />
        <Diplomit diplomit={diplomit} />
        <Osaamisalat toteutus={toteutus!} koulutus={koulutus} />
        {tyyppi === KOULUTUS_TYYPPI.KK_OPINTOKOKONAISUUS && !isEmpty(opintojaksot) && (
          <Opintojaksot opintojaksot={opintojaksot || []} />
        )}
        {tyyppi === KOULUTUS_TYYPPI.KK_OPINTOJAKSO &&
          !isEmpty(kuuluuOpintokokonaisuuksiin) && (
            <Opintokokonaisuudet
              opintokokonaisuudet={kuuluuOpintokokonaisuuksiin || []}
            />
          )}
        {showLaskuri && (
          <PisteContainer
            hakutiedot={toteutus?.hakutiedot || []}
            isLukio={toteutus?.koulutustyyppi === 'lk'}
          />
        )}
        <Box id="haut" display="flex" justifyContent="center">
          <ToteutusHakutiedot toteutus={toteutus} oppilaitosOsat={oppilaitosOsat} />
        </Box>
        {combinedLisatiedot.length > 0 && (
          <PageSection heading={t('koulutus.lisätietoa')}>
            <Accordion
              items={combinedLisatiedot.map((lisatieto) => ({
                title: localize(lisatieto.otsikko),
                content: sanitizedHTMLParser(localize(lisatieto.teksti)),
              }))}
            />
          </PageSection>
        )}
        {yhteyshenkilot?.length > 0 && (
          <PageSection heading={t('toteutus.yhteyshenkilot')}>
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
                      {!isEmpty(yhteyshenkilo.wwwSivu) && (
                        <Grid item>
                          <YhteystiedotLink href={localize(yhteyshenkilo.wwwSivu)}>
                            {localize(yhteyshenkilo.wwwSivuTeksti) ||
                              localize(yhteyshenkilo.wwwSivu)}
                          </YhteystiedotLink>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </PageSection>
        )}
        {!isEmpty(toteutus?.oppilaitokset) && (
          <ToteutuksenYhteystiedot
            oids={uniq(toteutus!.oppilaitokset.concat(toteutus!.organisaatiot))}
            tarjoajat={toteutus?.tarjoajat}
          />
        )}
      </InnerWrapper>
    </ContentWrapper>
  );
};
