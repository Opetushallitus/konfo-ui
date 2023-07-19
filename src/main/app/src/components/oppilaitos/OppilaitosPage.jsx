import {
  OpenInNew as OpenInNewIcon,
  SportsSoccer as SportsSoccerIcon,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { isEmpty, size } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ContentWrapper from '#/src/components/common/ContentWrapper';
import HtmlTextBox from '#/src/components/common/HtmlTextBox';
import { InfoBanner } from '#/src/components/common/InfoBanner';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import { PageSection } from '#/src/components/common/PageSection';
import TeemakuvaImage from '#/src/components/common/TeemakuvaImage';
import { NotFound } from '#/src/NotFound';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize } from '#/src/tools/localization';
import { useUrlParams } from '#/src/tools/useUrlParams';
import { condArray } from '#/src/tools/utils';

import { hasYhteystiedot } from './hasYhteystiedot';
import { useOppilaitos } from './hooks';
import { OppilaitosinfoGrid } from './OppilaitosinfoGrid';
import OppilaitosOsaList from './OppilaitosOsaList';
import { TarjontaList } from './TarjontaList';
import { TietoaOpiskelusta } from './TietoaOpiskelusta';
import { TulevaTarjontaList } from './TulevaTarjontaList';
import { Yhteystiedot } from './Yhteystiedot';

const PREFIX = 'OppilaitosPage';

const classes = {
  title: `${PREFIX}-title`,
  alatText: `${PREFIX}-alatText`,
  button: `${PREFIX}-button`,
};

const AdditionalStylesFn = ({ theme }) => ({
  [`& .${classes.title}`]: { marginTop: 40 },

  [`& .${classes.alatText}`]: {
    ...theme.typography.body1,
    fontSize: '1.25rem',
  },

  [`& .${classes.button}`]: {
    marginTop: 20,
    fontWeight: 600,
  },
});

export const OppilaitosPage = (props) => {
  const { oid } = useParams();
  const { t } = useTranslation();
  const isOppilaitosOsa = props.oppilaitosOsa;
  const { isDraft } = useUrlParams();

  const { data: entity = {}, status } = useOppilaitos({
    oid,
    isOppilaitosOsa,
    isDraft,
  });

  const {
    esittelyHtml,
    oppilaitosOsat,
    tietoaOpiskelusta,
    jarjestaaUrheilijanAmmKoulutusta,
  } = entity;

  const hakuUrl = useSelector(getHakuUrl);

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'error':
      return <NotFound />;
    case 'success':
      return (
        <ContentWrapper additionalStylesFn={AdditionalStylesFn}>
          <Box width="100%" alignSelf="start">
            <Murupolku
              path={[
                { name: t('haku.otsikko'), link: hakuUrl },
                ...condArray(isOppilaitosOsa, {
                  name: localize(entity?.oppilaitos),
                  link: `/oppilaitos/${entity?.oppilaitos?.oid}`,
                }),
                ...condArray(isOppilaitosOsa && entity?.parentToimipisteOid, {
                  name: localize(
                    entity?.oppilaitosOsat?.find(
                      (o) => o.oid === entity?.parentToimipisteOid
                    )
                  ),
                  link: `/oppilaitososa/${entity?.parentToimipisteOid}`,
                }),
                {
                  name: localize(entity),
                },
              ]}
            />
          </Box>
          <Box className={classes.title}>
            <Typography variant="h1" component="h1">
              {localize(entity)}
            </Typography>
          </Box>
          {jarjestaaUrheilijanAmmKoulutusta && (
            <InfoBanner
              heading={t('oppilaitos.jarjestaa-urheilijan-amm-koulutusta-otsikko')}
              bodytext={t('oppilaitos.jarjestaa-urheilijan-amm-koulutusta-teksti')}
              icon={<SportsSoccerIcon />}
            />
          )}
          <Box mt={7.5}>
            <TeemakuvaImage
              imgUrl={entity?.teemakuva}
              altText={t('oppilaitos.oppilaitoksen-teemakuva')}
            />
          </Box>
          <PageSection heading={t('oppilaitos.perustiedot')}>
            <OppilaitosinfoGrid
              opiskelijoita={entity?.metadata?.opiskelijoita ?? ''}
              toimipisteita={
                isOppilaitosOsa ? undefined : entity?.metadata?.toimipisteita
              }
              kotipaikat={entity?.kotipaikat}
              opetuskieli={entity?.opetuskieli ?? []}
              tutkintoonJohtavat={entity?.koulutusohjelmatLkm?.tutkintoonJohtavat ?? ''}
              tutkintoonJohtamattomat={
                entity?.koulutusohjelmatLkm?.eiTutkintoonJohtavat ?? ''
              }
            />
          </PageSection>
          {entity?.metadata?.wwwSivu && (
            <Button
              className={classes.button}
              target="_blank"
              href={localize(entity.metadata.wwwSivu?.url)}
              variant="contained"
              size="medium"
              color="primary">
              {isEmpty(entity.metadata.wwwSivu.nimi)
                ? t('oppilaitos.oppilaitoksen-www-sivut')
                : localize(entity.metadata.wwwSivu)}
              <OpenInNewIcon fontSize="small" />
            </Button>
          )}
          {esittelyHtml && (
            <HtmlTextBox heading={t('oppilaitos.esittely')} html={esittelyHtml} />
          )}
          <TarjontaList oid={oid} isOppilaitosOsa={isOppilaitosOsa} />
          <TulevaTarjontaList oid={oid} isOppilaitosOsa={isOppilaitosOsa} />
          {size(tietoaOpiskelusta) > 0 && (
            <TietoaOpiskelusta
              heading={t('oppilaitos.tietoa-opiskelusta')}
              tietoaOpiskelusta={tietoaOpiskelusta}
            />
          )}
          {isOppilaitosOsa || isEmpty(oppilaitosOsat) ? null : (
            <OppilaitosOsaList
              oppilaitosOsat={oppilaitosOsat}
              title={t('oppilaitos.tutustu-toimipisteisiin')}
            />
          )}
          {hasYhteystiedot(entity?.metadata) && (
            <Yhteystiedot
              id={localize(entity)}
              heading={t('oppilaitos.yhteystiedot')}
              matchTarjoajat={false}
              {...entity.metadata}
            />
          )}
        </ContentWrapper>
      );
    default:
      return null;
  }
};
