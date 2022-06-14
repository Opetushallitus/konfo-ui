import React, { useMemo } from 'react';

import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { AccordionText } from '#/src/components/common/AccordionText';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { useOsoitteet } from '#/src/tools/useOppilaitosOsoite';
import { formatDateString } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';
import { Hakuaika } from '#/src/types/HakukohdeTypes';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { HakutietoTable } from './HakutietoTable';
import { selectMuuHaku } from './hooks';
import { formatAloitus } from './utils';

const useStyles = makeStyles((theme) => ({
  hakuName: {
    ...theme.typography.h5,
    fontWeight: 'bold',
    color: colors.black,
  },
  valueText: {
    fontWeight: 'bold',
  },
  paper: {
    width: '100%',
    maxWidth: '800px',
    padding: '30px',
  },
}));

const getTarjoajaYhteystiedot = (
  osoitteet: Array<{ oppilaitosOid: string; yhteystiedot: string }>,
  tarjoajat: Array<{ oid: string; nimi: Translateable }>
) =>
  osoitteet.map((osoite) => {
    const tarjoajaNimi = tarjoajat.find(
      (tarjoaja) => tarjoaja.oid === osoite.oppilaitosOid
    )?.nimi;
    return `${localize(tarjoajaNimi)} · ${osoite.yhteystiedot}`;
  });

type Props = { toteutus?: Toteutus };

const AlkamiskausiRivi = ({ alkamiskausi }: any) => {
  const { t } = useTranslation();

  const { alkaaText, alkaaModalText, paattyyText } = formatAloitus(alkamiskausi || {}, t);
  return (
    <HakutietoTable
      items={[
        alkaaText && {
          size: paattyyText ? 6 : 12,
          heading: t('toteutus.koulutus-alkaa:'),
          content: [alkaaText],
          modalText: alkaaModalText,
        },
        paattyyText && {
          size: 6,
          heading: t('toteutus.koulutus-paattyy:'),
          content: [paattyyText],
        },
      ]}
    />
  );
};

const HakuaikaRivi = ({
  hakuaika,
  hakutermi,
}: {
  hakuaika: Hakuaika;
  hakutermi: string;
}) => {
  const { t } = useTranslation();
  return (
    <HakutietoTable
      items={[
        {
          size: hakuaika?.formatoituPaattyy ? 6 : 12,
          heading:
            hakutermi === 'hakeutuminen'
              ? t('toteutus.haku-alkaa:')
              : t('toteutus.ilmoittautuminen-alkaa:'),
          content: [formatDateString(hakuaika.formatoituAlkaa)],
        },
        hakuaika?.formatoituPaattyy && {
          size: 6,
          heading:
            hakutermi === 'hakeutuminen'
              ? t('toteutus.haku-paattyy:')
              : t('toteutus.ilmoittautuminen-paattyy:'),
          content: [
            hakuaika.paattyy ? formatDateString(hakuaika.formatoituPaattyy) : '-', // This is needed for the alkuu & paattyy to be rendered on the same row
          ],
        },
      ]}
    />
  );
};

export const ToteutusHakuMuu = ({ toteutus }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const muuHaku = useMemo(() => selectMuuHaku(toteutus), [toteutus]);

  const oppilaitosOids = muuHaku.tarjoajat.map(
    (tarjoaja: { oid: string }) => tarjoaja.oid
  );
  const { osoitteet, isLoading } = useOsoitteet(oppilaitosOids, true);
  const yhteystiedot = getTarjoajaYhteystiedot(osoitteet, muuHaku.tarjoajat);

  const hakeuduTaiIlmoittauduTrans =
    muuHaku.hakutermi === 'hakeutuminen'
      ? t('toteutus.hakeudu-koulutukseen')
      : t('toteutus.ilmoittaudu-koulutukseen');

  const alkamiskausi = muuHaku?.opetus?.koulutuksenAlkamiskausi;

  return (
    <PageSection heading={hakeuduTaiIlmoittauduTrans}>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Paper className={classes.paper}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography className={classes.hakuName}>
                {localize(muuHaku.nimi)}
              </Typography>
            </Grid>
            <Grid item>
              <HakuaikaRivi hakuaika={muuHaku?.hakuaika} hakutermi={muuHaku.hakutermi} />
            </Grid>
            <Grid item>
              <AlkamiskausiRivi alkamiskausi={alkamiskausi} />
            </Grid>
            {muuHaku.aloituspaikat && (
              <Grid item container direction="row">
                <Grid item xs md={4}>
                  <Typography noWrap variant="body1">
                    {t('toteutus.opiskelupaikkoja:')}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" noWrap className={classes.valueText}>
                    {muuHaku.aloituspaikat}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {yhteystiedot?.map((osoite, index) => (
              <Grid key={index} container item direction="row" wrap="nowrap">
                <PublicIcon style={{ marginRight: '10px' }} />
                <Typography variant="body1">{osoite}</Typography>
              </Grid>
            ))}
            {muuHaku.lisatietoaHakeutumisesta && (
              <Grid item>
                <AccordionText
                  title={
                    muuHaku.hakutermi === 'hakeutuminen'
                      ? t('toteutus.lisatietoa-hakeutumisesta')
                      : t('toteutus.lisatietoa-ilmoittautumisesta')
                  }
                  text={localize(muuHaku.lisatietoaHakeutumisesta)}
                />
              </Grid>
            )}
            {muuHaku.lisatietoaValintaperusteista && (
              <Grid item>
                <AccordionText
                  title={t('toteutus.lisatietoa-valintaperusteista')}
                  text={localize(muuHaku.lisatietoaValintaperusteista)}
                />
              </Grid>
            )}
            {/* TODO: insert SORA-kuvaus here when it can be fetched from backend
                <Grid item>
                <AccordionText
                title={'toteutus.hakijan-terveydentila-ja-toimintakyky'}
                text="TODO"
                />
                </Grid>
              )} */}
            <Grid item>
              <Button
                variant="contained"
                size="large"
                color="primary"
                target="_blank"
                href={localize(muuHaku.hakulomakeLinkki)}
                disabled={!muuHaku.isHakuAuki}>
                <Typography style={{ color: colors.white }} variant="body1">
                  {hakeuduTaiIlmoittauduTrans}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </PageSection>
  );
};
