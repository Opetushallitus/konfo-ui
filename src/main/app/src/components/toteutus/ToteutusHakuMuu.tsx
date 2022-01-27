import React from 'react';

import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { AccordionText } from '#/src/components/common/AccordionText';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Spacer from '#/src/components/common/Spacer';
import { localize } from '#/src/tools/localization';
import { useOsoitteet } from '#/src/tools/useOppilaitosOsoite';
import { formatDateRange, formatDateString } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

const useStyles = makeStyles((theme) => ({
  hakuName: {
    ...theme.typography.h5,
    fontWeight: 'bold',
    color: colors.black,
  },
  valueText: {
    fontWeight: 'bold',
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

type Props = { data: any };

export const ToteutusHakuMuu = ({ data: muuHaku }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const oppilaitosOids = muuHaku.tarjoajat.map(
    (tarjoaja: { oid: string }) => tarjoaja.oid
  );
  const osoitteet = useOsoitteet(oppilaitosOids, true);
  const yhteystiedot = getTarjoajaYhteystiedot(osoitteet, muuHaku.tarjoajat);

  return (
    <Box
      id="haut"
      mt={7}
      style={{ width: '100%' }}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">
        {muuHaku.hakutermi === 'hakeutuminen'
          ? t('toteutus.hakeudu-koulutukseen')
          : t('toteutus.ilmoittaudu-koulutukseen')}
      </Typography>
      <Spacer />
      <Grid
        container
        item
        alignContent="center"
        justifyContent="center"
        alignItems="center"
        xs={12}
        style={{ maxWidth: '800px' }}>
        {!yhteystiedot ? (
          <LoadingCircle />
        ) : (
          <Paper style={{ padding: '30px', width: '100%' }}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography className={classes.hakuName}>
                  {localize(muuHaku.nimi)}
                </Typography>
              </Grid>
              <Grid item container direction="row">
                <Grid item xs md={4}>
                  <Typography noWrap variant="body1">
                    {t(
                      muuHaku.hakuaika?.paattyy
                        ? 'koulutus.hakuaika:'
                        : 'toteutus.haku-alkaa:'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" className={classes.valueText}>
                    {muuHaku.hakuaika?.formatoituPaattyy
                      ? formatDateRange(
                          muuHaku.hakuaika?.formatoituAlkaa,
                          muuHaku.hakuaika?.formatoituPaattyy
                        )
                      : formatDateString(muuHaku.hakuaika?.formatoituAlkaa)}
                  </Typography>
                </Grid>
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
                <Grid key={index} container item direction="row">
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
                    {muuHaku.hakutermi === 'hakeutuminen'
                      ? t('toteutus.hakeudu-koulutukseen')
                      : t('toteutus.ilmoittaudu-koulutukseen')}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Grid>
    </Box>
  );
};
