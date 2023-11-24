import { useState } from 'react';

import { Box, Button, useTheme } from '@mui/material';
import { omit } from 'lodash';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { searchKoulutukset } from '#/src/api/konfoApi';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useHakutulosWidth } from '#/src/store/reducers/appSlice';

import { BackendErrorMessage } from './hakutulos/BackendErrorMessage';
import {
  Koulutus,
  KoulutusKorttiTiivistetty,
} from './hakutulos/hakutulosKortit/KoulutusKortti';
import { useSyncHakutulosWidth } from './hakutulos/hooks';

const MAX_SIZE_FOR_INITIAL_QUERY = 10;

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
  const searchParmsWithKeyword =
    keywordAndParams.length > 1
      ? {
          ...qs.parse(keywordAndParams[1], { parseNumbers: true }),
          keyword: keywordAndParams[0],
        }
      : qs.parse(keywordAndParams[0], { parseNumbers: true });

  const completeSearchParams =
    size && size >= 0
      ? {
          ...searchParmsWithKeyword,
          size,
          page: 1,
        }
      : {
          ...omit(searchParmsWithKeyword, ['size', 'page']),
        };

  return useQuery<unknown, unknown, KoulutusQueryResult>(
    ['searchKoulutukset', { search: completeSearchParams }],
    ({ signal }) => searchKoulutukset(completeSearchParams, signal),
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );
};

export const EmbeddedHakutulosBox = (props: Props) => {
  const [size, setSize] = useState<number>(MAX_SIZE_FOR_INITIAL_QUERY);
  const { data, isLoading, status } = useKoulutusSearch({ ...props, size });

  const hakutulosRef = useSyncHakutulosWidth();
  const [hakutulosWidth] = useHakutulosWidth();

  const theme = useTheme();
  const isSmall = hakutulosWidth < theme.breakpoints.values['sm'];
  const { t } = useTranslation();

  const showMoreButton = (data?.total || 0) > MAX_SIZE_FOR_INITIAL_QUERY && size >= 0;
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
          <Box
            display={showMoreButton ? 'flex' : 'none'}
            justifyContent="center"
            sx={{ marginTop: `${theme.spacing(3)}` }}>
            <Button
              onClick={() => setSize(-1)}
              type="submit"
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
        </Box>
      )}
    </Box>
  );
};
