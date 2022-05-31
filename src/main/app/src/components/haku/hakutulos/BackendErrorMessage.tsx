import React from 'react';

import { Avatar, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';

const useStyles = makeStyles((theme) => ({
  gridOuterContainerRoot: {
    paddingTop: theme.spacing(5),
  },
  paperRoot: {
    width: '80%',
    borderTop: `5px solid ${colors.red}`,
    boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
    margin: 'auto',
    padding: theme.spacing(5),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3),
      width: '90%',
    },
  },
  avatarRoot: {
    backgroundColor: colors.red,
    width: 60,
    height: 60,
  },
  buttonRoot: {
    fontWeight: 600,
    fontSize: 16,
  },
}));

const refreshPage = () => {
  window.location.reload();
};

export const BackendErrorMessage = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid
      container
      classes={{ root: classes.gridOuterContainerRoot }}
      spacing={4}
      alignItems="center"
      direction="column">
      <Grid item style={{ width: '100%' }}>
        <Paper classes={{ root: classes.paperRoot }}>
          <Grid container spacing={4} direction="column" alignItems="center">
            <Grid item>
              <Avatar classes={{ root: classes.avatarRoot }}>
                <ErrorOutline fontSize="large" />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                {t('haku.tapahtui-tekninen-virhe')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                {t('haku.odota-hetki-ja-kokeile-suorita-toiminto-uudestaan')}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                classes={{ root: classes.buttonRoot }}
                variant="contained"
                color="secondary"
                onKeyPress={(event) => event.key === 'Enter' && refreshPage()}
                onClick={() => refreshPage()}>
                {t('haku.paivita-sivu')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <LocalizedLink underline="always" component={RouterLink} to="/" variant="body1">
          {t('haku.siirry-opintopolun-etusivulle')}
        </LocalizedLink>
      </Grid>
    </Grid>
  );
};
