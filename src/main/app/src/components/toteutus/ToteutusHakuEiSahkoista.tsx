import React from 'react';

import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { IconBackground } from '#/src/components/common/IconBackground';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { Toteutus } from '#/src/types/ToteutusTypes';

const useStyles = makeStyles((theme) => ({
  hakuName: {
    ...theme.typography.h4,
    fontWeight: 'bold',
    color: colors.black,
  },
  paper: { padding: '30px', width: '100%' },
}));

type Props = {
  toteutus?: Toteutus;
};

export const ToteutusHakuEiSahkoista = ({ toteutus }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const hakeuduTaiIlmoittauduHeading =
    toteutus?.metadata?.hakutermi === 'hakeutuminen'
      ? t('toteutus.hakeudu-koulutukseen')
      : t('toteutus.ilmoittaudu-koulutukseen');

  const toteutusMetadata = toteutus?.metadata;

  return (
    <PageSection heading={hakeuduTaiIlmoittauduHeading} maxWidth="800px">
      <Paper className={classes.paper}>
        <Grid
          container
          direction="column"
          spacing={2}
          alignContent="center"
          justifyContent="center"
          alignItems="center">
          <IconBackground>
            <DescriptionOutlinedIcon style={{ fontSize: 40, color: colors.white }} />
          </IconBackground>
          <Grid item>
            <Typography className={classes.hakuName}>
              {t('toteutus.ei-sahkoista-hakua')}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" component="div">
              {sanitizedHTMLParser(localize(toteutusMetadata?.lisatietoaHakeutumisesta))}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </PageSection>
  );
};
