import React from 'react';

import { Grid, Card, CardHeader, CardContent, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Image from '../assets/images/o-EDUCATION-facebook.jpg';
import { colors } from '../colors';
import { Hakupalkki } from './haku/Hakupalkki';
import { ReactiveBorder } from './ReactiveBorder';

const useStyles = makeStyles((theme) => ({
  callToAction: {
    backgroundImage: `url(${Image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'block',
  },
  jumpotron: {
    backgroundColor: colors.brandGreen,
    marginTop: '85px',
    [theme.breakpoints.down('lg')]: {
      'min-width': 600,
    },
    [theme.breakpoints.down('md')]: {
      'min-width': 200,
    },
    [theme.breakpoints.up('lg')]: {
      'min-width': 800,
    },
  },
  title: {
    color: colors.white,
    fontFamily: 'Open Sans',
    fontSize: '40px',
    fontWeight: 'bold',
    letterSpacing: '-1.5px',
    lineHeight: '48px',
  },
  subheader: {
    color: colors.white,
    fontFamily: 'Open Sans',
    fontSize: '16px',
    lineHeight: '27px',
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export const Jumpotron = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.callToAction}>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center">
        <Grid item xs={12} sm={12} md={10} lg={8}>
          <ReactiveBorder>
            <Card className={classes.jumpotron}>
              <ReactiveBorder>
                <CardHeader
                  disableTypography={true}
                  title={<h1 className={classes.title}>{t('jumpotron.otsikko')}</h1>}
                  subheader={
                    <p className={classes.subheader}>{t('jumpotron.esittely')}</p>
                  }
                />
                <CardContent className={classes.content}>
                  <Hakupalkki />
                </CardContent>
              </ReactiveBorder>
            </Card>
          </ReactiveBorder>
        </Grid>
      </Grid>
    </div>
  );
};
