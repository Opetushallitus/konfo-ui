import { Box, Typography } from '@mui/material';
import { TFunction } from 'i18next';
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
import {
  createOsaamismerkinKuvausHtml,
  createHtmlListElement,
  sanitizedHTMLParser,
} from '#/src/tools/utils';
import { withDefaultProps } from '#/src/tools/withDefaultProps';
import { KoulutusExtendedData, TODOType, Translateable } from '#/src/types/common';

import { useKoulutus, useKoulutusJarjestajat } from './hooks';
import { KoulutusInfoGrid } from './KoulutusInfoGrid';
import { ToteutusList } from './ToteutusList';
import { TulevaJarjestajaList } from './TulevaJarjestajaList';
import { Osaamistavoitteet } from '../common/Osaamistavoitteet';

const KoulutusalatHeading = styled(Typography)<{ component?: string }>(({ theme }) => ({
  ...theme.typography.body1,
  fontSize: '1.25rem',
  margin: 'auto',
  textAlign: 'center',
}));

const findEperuste = (koulutus: KoulutusExtendedData) => (id: number) =>
  head(koulutus.eperusteet.filter((e: TODOType) => e.id === id));

const findTutkinnonOsa = (eperuste: TODOType) => (id: number) =>
  head(eperuste.tutkinnonOsat.filter((t: TODOType) => t.id === id));

const getKuvausHtmlSection = (
  t: TFunction,
  captionKey: string,
  localizableText: Translateable
) =>
  localizableText ? '<h3>' + t(captionKey) + '</h3>' + localize(localizableText) : '';

const TutkinnonOsat = ({ koulutus }: { koulutus?: KoulutusExtendedData }) => {
  const { t } = useTranslation();
  const createTutkinnonOsa = (tutkinnonOsa: TODOType) =>
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
        items={koulutus?.tutkinnonOsat.map((tutkinnonOsa: TODOType) => {
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

const OsaamismerkinKuvaus = ({ koulutus }: { koulutus?: KoulutusExtendedData }) => {
  const { t } = useTranslation();
  const { osaamismerkki } = koulutus ?? {};
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

const Kuvaus = ({ koulutus }: { koulutus?: KoulutusExtendedData }) => {
  const { t } = useTranslation();
  const koulutuksenTyotehtavat = koulutus?.tyotehtavatJoissaVoiToimia;
  const koulutuksenKuvaus = koulutus?.kuvaus;
  const osaamisalat = koulutus?.kuvaus?.osaamisalat;
  const osaamisalatHtml = createHtmlListElement(
    osaamisalat,
    'haku.amm-osaamisalat',
    'nimi',
    t
  );

  // NOTE: This uses HtmlTextBox which needs pure html
  const createKoulutusHtml = () =>
    koulutuksenTyotehtavat
      ? getKuvausHtmlSection(
          t,
          'koulutus.tyotehtavatJoissaVoiToimia',
          koulutuksenTyotehtavat
        ) + osaamisalatHtml
      : localize(koulutuksenKuvaus);

  return !isEmpty(koulutuksenKuvaus) || koulutuksenTyotehtavat ? (
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

  const { data: koulutus, status } = useKoulutus({
    oid,
    isDraft,
    osaamisalakuvaukset: true,
  });

  const { data: tulevatJarjestajat } = useKoulutusJarjestajat({
    oid,
    isTuleva: true,
  });

  const hakuUrl = useSelector(getHakuUrl);

  const koulutusalat = koulutus?.koulutusala?.map((ala) => localize(ala))?.join(' + ');

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
            {koulutusalat && (
              <KoulutusalatHeading variant="h3" component="h3">
                {koulutusalat}
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
          <Osaamistavoitteet
            osaamistavoitteet={koulutus?.osaamistavoitteet}
            suorittaneenOsaaminen={koulutus?.suorittaneenOsaaminen}
          />
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
