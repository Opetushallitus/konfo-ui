import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  component: {
    textAlign: 'center',
    paddingTop: '132px',
    paddingBottom: '132px',
  },
});

export const NotFound = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.component}>
      <Grid container direction="column" justify="center" alignItems="center" spacing={5}>
        <Grid item>
          <Typography variant="h1" component="h1" color="secondary">
            {t('ei-loydy.404')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h1" component="h1">
            {t('ei-loydy.sivua-ei-löytynyt')}
          </Typography>
          <Typography variant={'body1'} paragraph>
            {t('ei-loydy.linkki-on-virheellinen')}
          </Typography>
        </Grid>
        <Grid item>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                aria-label={t('ei-loydy.etusivulle')}
                color="primary"
                href={'/konfo'}>
                {t('ei-loydy.etusivulle')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                aria-label={t('ei-loydy.takaisin')}
                onClick={() => window.history.back()}>
                {t('ei-loydy.takaisin')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
