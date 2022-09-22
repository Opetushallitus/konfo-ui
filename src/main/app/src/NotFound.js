import React from 'react';

import { Grid, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const PREFIX = 'NotFound';

const classes = {
  component: `${PREFIX}-component`,
};

const Root = styled('div')({
  textAlign: 'center',
  paddingTop: '132px',
  paddingBottom: '132px',
});

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Root className={classes.component}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={5}>
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
            justifyContent="center"
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
    </Root>
  );
};
