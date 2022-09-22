import React from 'react';

import { Grid, Card, CardHeader, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import Image from '#/src/assets/images/o-EDUCATION-facebook.jpg';
import { colors } from '#/src/colors';

import { Hakupalkki } from './haku/Hakupalkki';
import { ReactiveBorder } from './ReactiveBorder';

const PREFIX = 'Jumpotron';

const classes = {
  callToAction: `${PREFIX}-callToAction`,
  jumpotron: `${PREFIX}-jumpotron`,
  title: `${PREFIX}-title`,
  subheader: `${PREFIX}-subheader`,
  content: `${PREFIX}-content`,
};

const Root = styled('div')(({ theme }) => ({
  backgroundImage: `url(${Image})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'block',

  [`& .${classes.jumpotron}`]: {
    backgroundColor: colors.brandGreen,
    marginTop: '85px',
    [theme.breakpoints.down('lg')]: {
      minWidth: 600,
    },
    [theme.breakpoints.down('md')]: {
      minWidth: 200,
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 800,
    },
  },

  [`& .${classes.title}`]: {
    color: colors.white,
    fontSize: '40px',
    fontWeight: 'bold',
    letterSpacing: '-1.5px',
    lineHeight: '48px',
  },

  [`& .${classes.subheader}`]: {
    color: colors.white,
    fontSize: '16px',
    lineHeight: '27px',
  },

  [`& .${classes.content}`]: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export const Jumpotron = () => {
  const { t } = useTranslation();

  return (
    <Root className={classes.callToAction}>
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
    </Root>
  );
};
