import { Box, Typography } from '@mui/material';
import { head, isEmpty } from 'lodash';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Accordion } from '#/src/components/common/Accordion';
import { ContentWrapper } from '#/src/components/common/ContentWrapper';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import { HtmlTextBox } from '#/src/components/common/HtmlTextBox';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { Murupolku } from '#/src/components/common/Murupolku';
import { PageSection } from '#/src/components/common/PageSection';
import { TeemakuvaImage } from '#/src/components/common/TeemakuvaImage';
import { NotFound } from '#/src/NotFound';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { styled } from '#/src/theme';
import { getLanguage, localize } from '#/src/tools/localization';
import { useUrlParams } from '#/src/tools/useUrlParams';
import { createOsaamismerkinKuvausHtml, sanitizedHTMLParser } from '#/src/tools/utils';
import { withDefaultProps } from '#/src/tools/withDefaultProps';

import { useKoulutus, useKoulutusJarjestajat } from './hooks';
import { KoulutusInfoGrid } from './KoulutusInfoGrid';
import { ToteutusList } from './ToteutusList';
import { TulevaJarjestajaList } from './TulevaJarjestajaList';

const KoulutusalatHeading = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  fontSize: '1.25rem',
  margin: 'auto',
  textAlign: 'center',
}));

const findEperuste = (koulutus) => (id) =>
  head(koulutus.eperusteet.filter((e) => e.id === id));

const findTutkinnonOsa = (eperuste) => (id) =>
  head(eperuste.tutkinnonOsat.filter((t) => t.id === id));

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
            opintojenLaajuusNumero || localize(opintojenLaajuus),
            localize(opintojenLaajuusyksikko),
          ].join(' ');
          const foundTutkinnonOsa = findTutkinnonOsa(eperuste)(tutkinnonosaId);

          return {
            title,
            content: (
              <>
                {createTutkinnonOsa(foundTutkinnonOsa)}
                <ExternalLink
                  href={urls.url(
                    'eperusteet-service.eperuste.kuvaus',
                    getLanguage(),
                    ePerusteId,
                    tutkinnonosaViite
                  )}>
                  {t('koulutus.eperuste-linkki')}
                </ExternalLink>
              </>
            ),
          };
        })}
      />
    </PageSection>
  ) : null;
};

const EPerusteLinkki = withDefaultProps(
  styled(ExternalLink)({
    fontWeight: 600,
  }),
  {
    'data-testid': 'eperuste-linkki',
  }
);

const OsaamismerkinKuvaus = ({ koulutus }) => {
  const { t } = useTranslation();
  const { osaamismerkki } = koulutus;
  const kuvaus = createOsaamismerkinKuvausHtml(t, osaamismerkki);
  const linkkiEPerusteisiin = urls.url(
    'eperusteet-service.osaamismerkki',
    getLanguage(),
    osaamismerkki?.id
  );

  return isEmpty(kuvaus) ? null : (
    <HtmlTextBox
      data-testid="kuvaus"
      heading={t('koulutus.kuvaus')}
      html={kuvaus}
      additionalContent={
        !isEmpty(linkkiEPerusteisiin) && (
          <EPerusteLinkki href={linkkiEPerusteisiin}>
            {t('koulutus.eperuste-linkki')}
          </EPerusteLinkki>
        )
      }
    />
  );
};

const Kuvaus = ({ koulutus }) => {
  const { t } = useTranslation();

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
  return !isEmpty(koulutus?.kuvaus) ||
    koulutus?.suorittaneenOsaaminen ||
    koulutus?.tyotehtavatJoissaVoiToimia ? (
    <HtmlTextBox
      data-testid="kuvaus"
      heading={t('koulutus.kuvaus')}
      html={createKoulutusHtml()}
      additionalContent={
        (!isEmpty(koulutus?.linkkiEPerusteisiin) && (
          <EPerusteLinkki href={localize(koulutus?.linkkiEPerusteisiin)}>
            {t('koulutus.eperuste-linkki')}
          </EPerusteLinkki>
        )) ||
        (koulutus?.ePerusteId && (
          <EPerusteLinkki
            href={urls.url(
              'eperusteet-service.eperuste.tiedot',
              getLanguage(),
              koulutus?.ePerusteId
            )}>
            {t('koulutus.eperuste-linkki')}
          </EPerusteLinkki>
        ))
      }
    />
  ) : null;
};

export const KoulutusPage = () => {
  const { isDraft } = useUrlParams();

  const { oid } = useParams();
  const { t } = useTranslation();

  const { data: koulutus, status } = useKoulutus({ oid, isDraft });

  const { data: tulevatJarjestajat } = useKoulutusJarjestajat({
    oid,
    isDraft,
    isTuleva: true,
  });

  const hakuUrl = useSelector(getHakuUrl);

  const koulutusAlat = koulutus?.koulutusAla?.map((ala) => localize(ala))?.join(' + ');

  const soraKuvaus = koulutus?.sorakuvaus;

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'error':
      return <NotFound />;
    case 'success':
      return (
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
              <KoulutusalatHeading variant="h3" component="h3">
                {koulutusAlat}
              </KoulutusalatHeading>
            )}
          </Box>
          <Box mt={1}>
            <Typography sx={{ textAlign: 'center' }} variant="h1" component="h1">
              {localize(koulutus?.tutkintoNimi)}
            </Typography>
          </Box>
          <Box mt={7.5}>
            <TeemakuvaImage imgUrl={koulutus?.teemakuva} altText="" />
          </Box>
          <PageSection heading={t('koulutus.tiedot')}>
            <KoulutusInfoGrid koulutus={koulutus} />
          </PageSection>
          <Kuvaus koulutus={koulutus} />
          <OsaamismerkinKuvaus koulutus={koulutus} />
          <TutkinnonOsat koulutus={koulutus} />
          <Box id="tarjonta">
            <ToteutusList oid={oid} koulutustyyppi={koulutus?.koulutustyyppi} />
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
            />
          )}
        </ContentWrapper>
      );
    default:
      return null;
  }
};
