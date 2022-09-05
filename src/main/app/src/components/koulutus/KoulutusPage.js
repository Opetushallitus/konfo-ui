import React from 'react';

import { Box, Link as MuiLink, makeStyles, Typography } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import _ from 'lodash';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Accordion } from '#/src/components/common/Accordion';
import ContentWrapper from '#/src/components/common/ContentWrapper';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import { PageSection } from '#/src/components/common/PageSection';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { getLanguage, localize } from '#/src/tools/localization';
import { useUrlParams } from '#/src/tools/useUrlParams';
import { getLocalizedOpintojenLaajuus, sanitizedHTMLParser } from '#/src/tools/utils';

import { useKoulutus, useKoulutusJarjestajat } from './hooks';
import { KoulutusInfoGrid } from './KoulutusInfoGrid';
import { ToteutusList } from './ToteutusList';
import { TulevaJarjestajaList } from './TulevaJarjestajaList';

const useStyles = makeStyles((theme) => ({
  lisatietoa: { width: '50%' },
  alatText: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
    margin: 'auto',
    textAlign: 'center',
  },
  tutkintoHeader: {
    textAlign: 'center',
  },
  linkButton: {
    fontWeight: 600,
  },
}));

const findEperuste = (koulutus) => (id) =>
  _.head(koulutus.eperusteet.filter((e) => e.id === id));

const findTutkinnonOsa = (eperuste) => (id) =>
  _.head(eperuste.tutkinnonOsat.filter((t) => t.id === id));

const getKuvausHtmlSection = (t, captionKey, localizableText) =>
  localizableText ? '<h3>' + t(captionKey) + '</h3>' + localize(localizableText) : '';

const TutkinnonOsat = ({ koulutus }) => {
  const { t } = useTranslation();
  const createTutkinnonOsa = (tutkinnonOsa) =>
    sanitizedHTMLParser(
      getKuvausHtmlSection(
        t,
        'koulutus.ammattitaitovaatimukset',
        tutkinnonOsa.ammattitaitovaatimukset
      ) +
        getKuvausHtmlSection(
          t,
          'koulutus.ammattitaidonOsoitamistavat',
          tutkinnonOsa.ammattitaidonOsoittamistavat
        )
    );

  return koulutus?.tutkinnonOsat ? (
    <PageSection heading={t('koulutus.kuvaus')}>
      <Accordion
        items={koulutus?.tutkinnonOsat.map((tutkinnonOsa) => {
          const {
            tutkinnonosaId,
            tutkinnonosaViite,
            ePerusteId,
            opintojenLaajuus,
            opintojenLaajuusNumero,
            opintojenLaajuusyksikko,
            tutkinnonOsat: nimi,
          } = tutkinnonOsa;
          const eperuste = findEperuste(koulutus)(ePerusteId);
          const title = [
            `${localize(nimi)},`,
            localize(opintojenLaajuus) || opintojenLaajuusNumero,
            localize(opintojenLaajuusyksikko),
          ].join(' ');
          const foundTutkinnonOsa = findTutkinnonOsa(eperuste)(tutkinnonosaId);

          return {
            title,
            content: (
              <>
                {createTutkinnonOsa(foundTutkinnonOsa)}
                <MuiLink
                  target="_blank"
                  rel="noopener"
                  href={urls.url(
                    'eperusteet-service.eperuste.kuvaus',
                    getLanguage(),
                    ePerusteId,
                    tutkinnonosaViite
                  )}>
                  {t('koulutus.eperuste-linkki')}
                  <OpenInNewIcon />
                </MuiLink>
              </>
            ),
          };
        })}
      />
    </PageSection>
  ) : null;
};

const Kuvaus = ({ koulutus }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // NOTE: This uses HtmlTextBox which needs pure html
  const createKoulutusHtml = () =>
    koulutus?.suorittaneenOsaaminen || koulutus?.tyotehtavatJoissaVoiToimia
      ? getKuvausHtmlSection(
          t,
          'koulutus.suorittaneenOsaaminen',
          koulutus?.suorittaneenOsaaminen
        ) +
        getKuvausHtmlSection(
          t,
          'koulutus.tyotehtavatJoissaVoiToimia',
          koulutus?.tyotehtavatJoissaVoiToimia
        )
      : localize(koulutus?.kuvaus);
  return !_.isEmpty(koulutus?.kuvaus) ||
    koulutus?.suorittaneenOsaaminen ||
    koulutus?.tyotehtavatJoissaVoiToimia ? (
    <HtmlTextBox
      data-cy="kuvaus"
      heading={t('koulutus.kuvaus')}
      html={createKoulutusHtml()}
      className={classes.root}
      additionalContent={
        !_.isEmpty(koulutus?.linkkiEPerusteisiin) && (
          <ExternalLink
            target="_blank"
            rel="noopener"
            href={localize(koulutus?.linkkiEPerusteisiin)}
            className={classes.linkButton}
            data-cy="eperuste-linkki">
            {t('koulutus.eperuste-linkki')}
          </ExternalLink>
        )
      }
    />
  ) : null;
};

export const KoulutusPage = () => {
  const { isDraft } = useUrlParams();
  const classes = useStyles();
  const { oid } = useParams();
  const { t } = useTranslation();

  // TODO: There is absolutely no error handling atm.
  const { data: koulutus, isLoading: koulutusLoading } = useKoulutus({ oid, isDraft });

  const { data: tulevatJarjestajat } = useKoulutusJarjestajat({
    oid,
    isDraft,
    isTuleva: true,
  });

  const isLoading = koulutusLoading;

  const hakuUrl = useSelector(getHakuUrl);

  const koulutusAlat = koulutus?.koulutusAla?.map((ala) => localize(ala))?.join(' + ');

  const soraKuvaus = koulutus?.sorakuvaus;

  return isLoading ? (
    <LoadingCircle />
  ) : (
    <ContentWrapper>
      <Box width="100%" alignSelf="start">
        <Murupolku
          path={[
            { name: t('haku.otsikko'), link: hakuUrl },
            { name: localize(koulutus?.tutkintoNimi) },
          ]}
        />
      </Box>
      <Box mt={4}>
        {koulutusAlat && (
          <Typography className={classes.alatText} variant="h3" component="h3">
            {koulutusAlat}
          </Typography>
        )}
      </Box>
      <Box mt={1}>
        <Typography className={classes.tutkintoHeader} variant="h1" component="h1">
          {localize(koulutus?.tutkintoNimi)}
        </Typography>
      </Box>
      <Box mt={7.5}>
        <TeemakuvaImage imgUrl={koulutus?.teemakuva} altText="" />
      </Box>
      <PageSection heading={t('koulutus.tiedot')}>
        <KoulutusInfoGrid
          nimikkeet={koulutus?.tutkintoNimikkeet}
          koulutustyyppi={koulutus?.koulutusTyyppi}
          laajuus={getLocalizedOpintojenLaajuus(koulutus)}
          eqf={koulutus?.eqf}
          nqf={koulutus?.nqf}
        />
      </PageSection>
      <Kuvaus koulutus={koulutus} />
      <TutkinnonOsat koulutus={koulutus} />
      <Box id="tarjonta">
        <ToteutusList oid={oid} koulutustyyppi={koulutus?.koulutusTyyppi} />
      </Box>
      {tulevatJarjestajat?.length > 0 && (
        <Box id="tulevatJarjestajat">
          <TulevaJarjestajaList jarjestajat={tulevatJarjestajat} />
        </Box>
      )}
      {soraKuvaus && (
        <HtmlTextBox
          heading={t('koulutus.hakijan-terveydentila-ja-toimintakyky')}
          html={localize(soraKuvaus?.metadata?.kuvaus)}
          className={classes.root}
        />
      )}
    </ContentWrapper>
  );
};
