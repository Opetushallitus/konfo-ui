import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { styled } from '#/src/theme';

const Root = styled('div')({
  textAlign: 'center',
  paddingTop: '132px',
  paddingBottom: '132px',
});

export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Root>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={5}>
        <Grid>
          <Typography variant="h1" component="h1" color="secondary">
            {t('ei-loydy.404')}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="h1" component="h1">
            {t('ei-loydy.sivua-ei-löytynyt')}
          </Typography>
          <Typography variant="body1" component="p" marginBottom={2}>
            {t('ei-loydy.linkki-on-virheellinen')}
          </Typography>
        </Grid>
        <Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}>
            <Grid>
              <Button
                variant="contained"
                aria-label={t('ei-loydy.etusivulle')}
                color="primary"
                href="/">
                {t('ei-loydy.etusivulle')}
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                color="primary"
                aria-label={t('ei-loydy.takaisin')}
                onClick={() => navigate(-1)}>
                {t('ei-loydy.takaisin')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Root>
  );
};
