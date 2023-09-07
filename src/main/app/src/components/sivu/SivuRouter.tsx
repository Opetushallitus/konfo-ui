import React from 'react';

import { Grid, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { resolveNewSlug } from '#/src/tools/slugUtils';

import { Sivu } from './Sivu';

const PREFIX = 'SivuRouter';

const classes = {
  notFound: `${PREFIX}-notFound`,
  header1: `${PREFIX}-header1`,
  component: `${PREFIX}-component`,
};

const NotFound = ({ loading }: { loading: boolean }) => {
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
  const { sivu } = data;

  if (isLoading) {
    return <LoadingCircle />;
  }
  if (slug && lngParam) {
    const idInfo = slugsToIds?.[slug];
    if (idInfo?.language === lngParam) {
      if (sivu[slug]) {
        return <Sivu id={slug} />;
      } else {
        return <StyledNotFound loading={isLoading} />;
      }
    } else {
      const newSlug = resolveNewSlug(slugsToIds, idInfo, lngParam);
      if (newSlug) {
        return <Navigate to={`/${lngParam}/sivu/${newSlug}`} replace />;
      }
    }
  }
  return <NotFound loading={isLoading} />;
};
