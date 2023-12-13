import { Box, Grid, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate } from 'react-router-dom';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useContentful } from '#/src/hooks/useContentful';
import { resolveNewSlug } from '#/src/tools/slugUtils';

import { Sivu } from './Sivu';
import { Heading } from '../Heading';

const NotFound = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation();

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {loading ? null : (
        <Grid item xs={12} sm={6} md={6} margin={1}>
          <Heading>{t('sisaltohaku.sivua-ei-löytynyt')}</Heading>
          <Typography>{t('sisaltohaku.etsimääsi-ei-löydy')}</Typography>
          <Box marginTop={2}>
            <Link href="/">{t('sisaltohaku.takaisin')}</Link>
          </Box>
        </Grid>
      )}
    </Grid>
  );
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
        return <NotFound loading={isLoading} />;
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
