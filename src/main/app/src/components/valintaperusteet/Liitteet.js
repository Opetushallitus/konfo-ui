import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '#/src/colors';
import Spacer from '#/src/components/common/Spacer';
import {
  formatDateString,
  Localizer as l,
  sanitizedHTMLParser,
  toId,
} from '#/src/tools/Utils';

const Osoite = ({ toimitusaika, sahkoposti, osoite, postinumero }) => {
  const { t } = useTranslation();
  return (
    <>
      <Grid item xs={12}>
        <Box m={1}>
          <Divider />
        </Box>
      </Grid>
      {postinumero && (
        <>
          <Grid item xs={2}></Grid>
          <Grid item xs={10}>
            <Box m={1}>
              <Typography variant="h5">{t('valintaperuste.toimituspaikka')}</Typography>
              <Typography variant="body1">
                {`${sahkoposti} - ${l.localizeOsoite(osoite, postinumero)}`}
              </Typography>
            </Box>
          </Grid>
        </>
      )}
      <Grid item xs={2}></Grid>
      <Grid item xs={10}>
        <Box m={1}>
          <Typography variant="h5">
            {t('valintaperuste.toimitettava-viimeistään')}
          </Typography>
          <Typography variant="body1">{formatDateString(toimitusaika)}</Typography>
        </Box>
      </Grid>
    </>
  );
};

const FileIcon = withStyles((theme) => ({
  root: {
    color: colors.green,
  },
}))(InsertDriveFileOutlinedIcon);

const Liite = ({ nimi, kuvaus }) => (
  <>
    <Grid item xs={2}>
      <Grid container alignItems="flex-start" justify="flex-end" direction="row">
        <Box m={1}>
          <FileIcon />
        </Box>
      </Grid>
    </Grid>
    <Grid item xs={10}>
      <Box m={1}>
        <Typography variant="h5">{l.localize(nimi)}</Typography>
        {sanitizedHTMLParser(l.localize(kuvaus))}
      </Box>
    </Grid>
  </>
);

const tyypeittain = (liitteet) =>
  _.sortBy(
    Object.entries(_.groupBy(liitteet || [], (liite) => l.localize(liite.tyyppi.nimi))),
    _.first
  );

export const LiitteetSisallysluettelo = (liitteet) => (Lnk) => {
  const tyyppiJaLiite = tyypeittain(liitteet);
  return tyyppiJaLiite?.map(([tyyppi]) => Lnk(tyyppi));
};

export const Liitteet = ({ liitteet }) => {
  const { t } = useTranslation();
  const tyyppiJaLiite = tyypeittain(liitteet);

  return (
    !_.isEmpty(tyyppiJaLiite) && (
      <>
        <Box py={2}>
          <Typography id={toId(t('valintaperuste.liitteet'))} variant="h2">
            {t('valintaperuste.liitteet')}
          </Typography>
          <Spacer />
        </Box>
        {tyyppiJaLiite.map(([tyyppi, liitteet]) => {
          const liiteAsOsoite = ({
            toimitusaika,
            toimitustapa,
            toimitusosoite: { sahkoposti, osoite: { osoite, postinumero } = {} } = {},
          }) => ({ toimitusaika, toimitustapa, sahkoposti, osoite, postinumero });

          const yhteisetOsoitteet = _.uniq(liitteet.map(liiteAsOsoite));
          const jaettuOsoite = yhteisetOsoitteet.length === 1;

          return (
            <div key={`liitteet-${tyyppi}`}>
              <Box py={2}>
                <Typography id={toId(tyyppi)} variant="h4">
                  {tyyppi}
                </Typography>
              </Box>
              <Card elevation={2}>
                <CardContent>
                  {liitteet.map((liite, index) => (
                    <Grid container key={`liite-${index}`}>
                      <Liite {...liite} />
                      {!jaettuOsoite && <Osoite {...liiteAsOsoite(liite)} />}
                    </Grid>
                  ))}
                  {jaettuOsoite && <Osoite {..._.first(yhteisetOsoitteet)} />}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </>
    )
  );
};
