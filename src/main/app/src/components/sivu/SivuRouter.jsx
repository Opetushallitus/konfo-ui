import React from 'react';

import { Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { findKey } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useContentful } from '#/src/hooks/useContentful';

import { Sivu } from './Sivu';
import { SivuKooste } from './SivuKooste';

const PREFIX = 'SivuRouter';

const classes = {
  notFound: `${PREFIX}-notFound`,
  header1: `${PREFIX}-header1`,
  component: `${PREFIX}-component`,
};

const NotFound = ({ loading }) => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className={classes.component}>
      {loading ? null : (
        <Grid item xs={12} sm={6} md={6} className={classes.notFound}>
          <h1 className={classes.header1}>{t('sisaltohaku.sivua-ei-löytynyt')}</h1>
          <p>{t('sisaltohaku.etsimääsi-ei-löydy')}</p>
          <Link href="/">{t('sisaltohaku.takaisin')}</Link>
        </Grid>
      )}
    </Grid>
  );
};

const StyledNotFound = styled(NotFound)({
  [`& .${classes.notFound}`]: {
    textAlign: 'center',
  },
  [`& .${classes.header1}`]: {
    fontSize: '40px',
    lineHeight: '48px',
    marginTop: '15px',
    marginBottom: '30px',
    fontWeight: '700',
    color: colors.black,
  },
  [`& .${classes.component}`]: {
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '32px',
    '&:last-child': {
      paddingBottom: '32px',
    },
    fontSize: '16px',
    lineHeight: '27px',
    color: colors.darkGrey,
  },
});

export const SivuRouter = () => {
  const { id: slug, lng: lngParam } = useParams();
  const { data, slugsToIds, isLoading } = useContentful();
  const { sivu, sivuKooste } = data;
  const idInfo = slugsToIds?.[slug];

  if (isLoading) {
    return <LoadingCircle />;
  }
  if (idInfo?.language === lngParam) {
    if (sivu[slug]) {
      return <Sivu id={slug} />;
    } else if (sivuKooste?.[slug]) {
      return <SivuKooste id={slug} />;
    } else {
      return <StyledNotFound loading={isLoading} />;
    }
  } else {
    const newSlug = findKey(
      slugsToIds,
      (slugInfo) => slugInfo.id === idInfo?.id && slugInfo?.language === lngParam
    );
    if (newSlug) {
      return <Navigate to={`/${lngParam}/sivu/${newSlug}`} replace />;
    } else {
      return <NotFound loading={isLoading} />;
    }
  }
};
