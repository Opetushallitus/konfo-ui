import { Box, Button, Typography, useTheme } from '@mui/material';
import { last, omit } from 'lodash';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { searchKoulutukset } from '#/src/api/konfoApi';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useHakutulosWidth } from '#/src/store/reducers/appSlice';
import { getLanguage } from '#/src/tools/localization';

import { BackendErrorMessage } from './hakutulos/BackendErrorMessage';
import {
  Koulutus,
  KoulutusKorttiTiivistetty,
} from './hakutulos/hakutulosKortit/KoulutusKortti';
import { useSyncHakutulosWidth } from './hakutulos/hooks';

const MAX_SIZE_FOR_INITIAL_QUERY = 5;

type KoulutusQueryResult = {
  total: number;
  hits: Array<Koulutus>;
};

type Props = {
  searchParams: string;
  size?: number;
};

const useKoulutusSearch = ({ searchParams, size }: Props) => {
  const keywordAndParams = searchParams.split('?');
  const baseParams = {
    ...qs.parse(last(keywordAndParams) || '', { parseNumbers: true }),
    size,
    page: 1,
  };
  const searchParmsWithKeyword =
    keywordAndParams.length > 1
      ? {
          keyword: keywordAndParams[0],
          ...baseParams,
        }
      : baseParams;

  return useQuery<unknown, unknown, KoulutusQueryResult>(
    ['searchKoulutukset', { search: searchParmsWithKeyword }],
    ({ signal }) => searchKoulutukset(searchParmsWithKeyword, signal),
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );
};

const navigateToHakupage = ({ searchParams }: Props, navigate: NavigateFunction) => {
  const keywordAndParams = searchParams.split('?');
  const params = qs.parse(last(keywordAndParams) || '', { parseNumbers: true });
  const keyword = keywordAndParams.length > 1 ? keywordAndParams[0] : params['keyword'];
  const url = `/${getLanguage()}/haku${keyword ? '/' + keyword : ''}?${qs.stringify(
    omit(params, 'keyword'),
    {
      arrayFormat: 'comma',
    }
  )}`;
  navigate(url);
};

export const EmbeddedHakutulosBox = (props: Props) => {
  const { data, isLoading, status } = useKoulutusSearch({
    ...props,
    size: MAX_SIZE_FOR_INITIAL_QUERY,
  });

  const hakutulosRef = useSyncHakutulosWidth();
  const [hakutulosWidth] = useHakutulosWidth();

  const theme = useTheme();
  const isSmall = hakutulosWidth < theme.breakpoints.values['sm'];
  const { t } = useTranslation();
  const navigate = useNavigate();

  const showMoreButton = (data?.total || 0) > MAX_SIZE_FOR_INITIAL_QUERY;
  return (
    <Box
      sx={{ marginTop: `${theme.spacing(2)}`, marginBottom: `${theme.spacing(2)}` }}
      ref={hakutulosRef}>
      {isLoading && <LoadingCircle />}
      {!isLoading && status === 'error' && <BackendErrorMessage />}
      {!isLoading && status === 'success' && (
        <Box>
          {data?.hits.map((koulutus) => (
            <KoulutusKorttiTiivistetty
              key={koulutus.oid}
              koulutus={koulutus}
              isSmall={isSmall}
            />
          ))}
          {data?.total === 0 && (
            <Box display="flex" justifyContent="center">
              <Typography variant="h1">{t('haku.ei-hakutuloksia')}</Typography>
            </Box>
          )}
          {showMoreButton && (
            <Box
              display="flex"
              justifyContent="center"
              sx={{ marginTop: `${theme.spacing(3)}` }}>
              <Button
                onClick={() => navigateToHakupage(props, navigate)}
                variant="contained"
                color="secondary"
                sx={{
                  display: 'inline-flex',
                  flexShrink: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                {t('haku.nayta-kaikki-koulutukset')}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
