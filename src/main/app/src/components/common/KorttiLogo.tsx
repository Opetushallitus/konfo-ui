import React from 'react';

import { styled } from '@mui/material/styles';

import oppilaitos_img from '#/src/assets/images/logo-oppilaitos.png';
import koulutus_img from '#/src/assets/images/Opolkuhts.png';

const PREFIX = 'KoulutusKorttiLogo';

const classes = {
  oppilaitosKorttiLogo: `${PREFIX}-oppilaitosKorttiLogo`,
  koulutusKorttiLogo: `${PREFIX}-koulutusKorttiLogo`,
};

const Root = styled('img')(({ theme }) => {
  const common = {
    borderRadius: 0,
    [theme.breakpoints.up('sm')]: {
      float: 'right',
      maxWidth: '125px',
      maxHeight: '100px',
    },
  };

  return {
    [`&.${classes.oppilaitosKorttiLogo}`]: {
      [theme.breakpoints.up('xs')]: {
        maxWidth: theme.spacing(7),
        maxHeight: theme.spacing(7),
      },
      ...common,
      [theme.breakpoints.up('lg')]: {
        float: 'right',
        maxWidth: '150px',
        maxHeight: '120px',
      },
    },
    [`&.${classes.koulutusKorttiLogo}`]: {
      [theme.breakpoints.up('xs')]: {
        maxWidth: '100%',
        maxHeight: '150px',
      },
      ...common,
      [theme.breakpoints.up('lg')]: {
        float: 'right',
        maxWidth: '100%',
        maxHeight: '150px',
      },
      [theme.breakpoints.up('xl')]: {
        float: 'right',
        maxWidth: '250px',
        maxHeight: '150px',
      },
    },
  };
});

type Props = {
  alt: string;
  image?: string;
};

export const KoulutusKorttiLogo = ({ alt, image }: Props) => {
  return (
    <Root className={classes.koulutusKorttiLogo} alt={alt} src={image || koulutus_img} />
  );
};

export const OppilaitosKorttiLogo = ({ alt, image }: Props) => {
  return (
    <Root
      className={classes.oppilaitosKorttiLogo}
      alt={alt}
      src={image || oppilaitos_img}
    />
  );
};
