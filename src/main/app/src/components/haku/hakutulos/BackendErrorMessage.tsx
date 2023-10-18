import React from 'react';

import { Avatar, Button, Grid, Link, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const PREFIX = 'BackendErrorMessage';

const classes = {
  gridOuterContainerRoot: `${PREFIX}-gridOuterContainerRoot`,
  paperRoot: `${PREFIX}-paperRoot`,
  avatarRoot: `${PREFIX}-avatarRoot`,
  buttonRoot: `${PREFIX}-buttonRoot`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.gridOuterContainerRoot}`]: {
    paddingTop: theme.spacing(5),
  },

  [`& .${classes.paperRoot}`]: {
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

  [`& .${classes.avatarRoot}`]: {
    backgroundColor: colors.red,
    width: 60,
    height: 60,
  },

  [`& .${classes.buttonRoot}`]: {
    fontWeight: 600,
    fontSize: 16,
  },
}));

const refreshPage = () => {
  window.location.reload();
};

export const BackendErrorMessage = () => {
  const { t } = useTranslation();

  return (
    <StyledGrid
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
                <MaterialIcon icon="error_outline" fontSize="large" />
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
                onKeyDown={(event) => event.key === 'Enter' && refreshPage()}
                onClick={() => refreshPage()}>
                {t('haku.paivita-sivu')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Link underline="always" href="/" variant="body1">
          {t('haku.siirry-opintopolun-etusivulle')}
        </Link>
      </Grid>
    </StyledGrid>
  );
};
