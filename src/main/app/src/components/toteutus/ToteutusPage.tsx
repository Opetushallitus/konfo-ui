import React, { useMemo } from 'react';

import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { colors } from '#/src/colors';
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
import { TextWithBackground } from '#/src/components/common/TextWithBackground';
import { useUrlParams } from '#/src/components/hakutulos/UseUrlParams';
import { getHakuParams, getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { getLanguage, localize, localizeLukiolinja } from '#/src/tools/localization';
import { getLocalizedOpintojenLaajuus, sanitizedHTMLParser } from '#/src/tools/utils';

import { useKoulutus } from '../koulutus/hooks';
import { Diplomit } from './Diplomit';
import { HakuKaynnissaCard } from './HakuKaynnissaCard';
import { useToteutus } from './hooks';
import { KielivalikoimaBox } from './KielivalikoimaBox';
import { Osaamisalat } from './Osaamisalat';
import { ToteutuksenYhteystiedot } from './ToteutuksenYhteystiedot';
import { ToteutusHakuEiSahkoista } from './ToteutusHakuEiSahkoista';
import { ToteutusHakukohteet } from './ToteutusHakukohteet';
import { ToteutusHakuMuu } from './ToteutusHakuMuu';
import { ToteutusInfoGrid } from './ToteutusInfoGrid';

const useStyles = makeStyles({
  root: { marginTop: '100px' },
});

export const ToteutusPage = () => {
  const classes = useStyles();
  const { oid } = useParams<{ oid: string }>();
  const { t } = useTranslation();
  const currentLanguage = getLanguage();
  const { isDraft } = useUrlParams();

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
    ammattinimikkeet,
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

  const haut = toteutus?.hakukohteet;

  const getAsiasanatForLanguage = (asiasanat: Array<any>, language: string) => {
    const getFirstNotEmpty = (
      asiasanat1: Array<any>,
      asiasanat2: Array<any>,
      asiasanat3: Array<any>
    ) => {
      const returnIfNotEmpty = (arr: Array<any>) => {
        if (arr?.length > 0) return arr;
      };
      return (
        returnIfNotEmpty(asiasanat1) ||
        returnIfNotEmpty(asiasanat2) ||
        returnIfNotEmpty(asiasanat3) ||
        []
      );
    };
    const filterAsiasanatForLang = (arr: Array<any>, language: string) => {
      return arr?.filter((asiasana: any) => asiasana.kieli === language);
    };

    const fi = filterAsiasanatForLang(asiasanat, 'fi');
    const sv = filterAsiasanatForLang(asiasanat, 'sv');
    const en = filterAsiasanatForLang(asiasanat, 'en');

    if ('en' === language) {
      return getFirstNotEmpty(en, fi, sv);
    } else if ('sv' === language) {
      return getFirstNotEmpty(sv, fi, en);
    } else {
      return getFirstNotEmpty(fi, sv, en);
    }
  };

  // NOTE: These ammattinimikkeet should be the freely written virkailija asiasana-ammattinimikkeet,
  // not the formal tutkintonimikkeet
  const asiasanat: Array<string> = getAsiasanatForLanguage(
    (ammattinimikkeet || []).concat(toteutus?.metadata?.asiasanat || []),
    currentLanguage
  )?.map((asiasana: any) => asiasana.arvo);

  const loading = koulutusLoading || toteutusLoading;

  const hasAnyHaku = _.some(haut, (v: any) => v.hakukohteet.length > 0);
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
              { name: localize(toteutus?.nimi) },
            ]}
          />
        </Box>
        <Typography style={{ marginTop: '20px' }} variant="h1">
          {localize(toteutus?.nimi)}
        </Typography>
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
        {!_.isEmpty(asiasanat) && (
          <Box mt={4}>
            <Grid alignItems="center" justify="center" container spacing={1}>
              {asiasanat.map((asiasana, i) => (
                <Grid item key={i}>
                  <TextWithBackground>{asiasana}</TextWithBackground>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
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
            hasHaku={hasAnyHaku}
          />
        </Box>
        {toteutus?.hakuAukiType && (
          <HakuKaynnissaCard
            title={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.haku-kaynnissa')
                : t('toteutus.ilmoittautuminen-kaynnissa')
            }
            text={
              toteutus.hakuAukiType === 'hakukohde'
                ? t('toteutus.katso-hakukohteet')
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
        {hasAnyHaku && <ToteutusHakukohteet haut={haut} />}
        {toteutus?.hasMuuHaku && <ToteutusHakuMuu data={toteutus?.muuHakuData} />}
        {toteutus?.hasEiSahkoistaHaku && (
          <ToteutusHakuEiSahkoista data={toteutus?.eiSahkoistaHakuData} />
        )}
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
              <Grid container alignItems="center">
                {yhteyshenkilot?.map((yhteyshenkilo: any, i: number, a: any) => (
                  <React.Fragment key={i}>
                    <Grid item>
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
                            <ExternalLink href={localize(yhteyshenkilo.wwwSivu)}>
                              {localize(yhteyshenkilo.wwwSivu)}
                            </ExternalLink>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    {i + 1 !== a.length && (
                      <Grid item>
                        <Box
                          mx={9}
                          style={{ height: '104px' }}
                          borderRight={`1px solid ${colors.lightGrey}`}
                        />
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
        {!_.isEmpty(toteutus?.oppilaitokset) && (
          <ToteutuksenYhteystiedot oids={toteutus!.oppilaitokset} />
        )}
      </Box>
    </ContentWrapper>
  );
};
