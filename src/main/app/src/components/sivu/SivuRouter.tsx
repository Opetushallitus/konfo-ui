import React from 'react';

import { Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { findKey } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useContentful } from '#/src/hooks/useContentful';
import { SlugIdData, SlugsToIds } from '#/src/types/common';

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

/* Resolve new slug via id in case language is changed. Also tries to handle language changes
 * from fi/sv space to en space via optional Contentful field englishPageVersionId */
const resolveNewSlug = (
  slugsToIds: SlugsToIds,
  idInfo: SlugIdData,
  lngParam: string
): string | undefined => {
  const defaultSpaceLanguages = ['fi', 'sv'];
  const idLng = idInfo?.language;

  if (!idLng) {
    return undefined;
  }

  // Navigating from fi->sv or sv->fi
  if (defaultSpaceLanguages.includes(idLng) && defaultSpaceLanguages.includes(lngParam)) {
    return findKey(
      slugsToIds,
      (slugInfo) => slugInfo.id === idInfo?.id && slugInfo?.language === lngParam
    );
  }
  // Navigating from fi/sv -> en
  else if (
    defaultSpaceLanguages.includes(idLng) &&
    lngParam === 'en' &&
    idInfo?.englishPageVersionId
  ) {
    return findKey(
      slugsToIds,
      (slugInfo) =>
        slugInfo.id === idInfo?.englishPageVersionId && slugInfo?.language === lngParam
    );
  }
  // Navigating from en -> fi/sv
  else if (idLng === 'en' && defaultSpaceLanguages.includes(lngParam)) {
    return findKey(
      slugsToIds,
      (slugInfo) =>
        slugInfo.englishPageVersionId === idInfo?.id && slugInfo?.language === lngParam
    );
  } else {
    return undefined;
  }
};

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
