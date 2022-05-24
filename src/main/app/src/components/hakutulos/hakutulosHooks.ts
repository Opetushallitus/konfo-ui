import { useCallback, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  newSearchAll,
  setKoulutusOffset,
  setOppilaitosOffset,
  setOrder,
  setSize,
  setSort,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getHakutulosPagination,
  getHakutulosProps,
} from '#/src/store/reducers/hakutulosSliceSelector';

export const useSearch = () => {
  const error = useSelector((state: any) => state.hakutulos.error);
  const status = useSelector((state: any) => state.hakutulos.status);
  const paginationProps = useSelector(getHakutulosPagination);
  const hakutulosProps = useSelector(getHakutulosProps);

  const pageSize = hakutulosProps.size;

  const dispatch = useDispatch();

  const [pageSort, setPageSort] = useState('score_desc');

  const changePageSort = useCallback(
    (e) => {
      const newPageSort = e.target.value;
      const newOrder = newPageSort === 'name_asc' ? 'asc' : 'desc';
      const newSort = newPageSort === 'score_desc' ? 'score' : 'name';

      setPageSort(newPageSort);
      dispatch(setSort({ newSort }));
      dispatch(setOrder({ newOrder }));
      dispatch(newSearchAll());
    },
    [dispatch, setPageSort]
  );

  const changePageSize = useCallback(
    (e) => {
      const newSize = e.target.value;
      dispatch(setSize({ newSize }));
      dispatch(newSearchAll());
    },
    [dispatch]
  );

  const doSearch = useCallback(() => dispatch(newSearchAll()), [dispatch]);

  const pagination = useMemo(() => {
    switch (hakutulosProps.selectedTab) {
      case 'koulutus':
        return {
          size: pageSize,
          total: paginationProps.koulutusTotal,
          offset: paginationProps.koulutusOffset,
        };
      case 'oppilaitos':
        return {
          size: pageSize,
          total: paginationProps.oppilaitosTotal,
          offset: paginationProps.oppilaitosOffset,
        };
      default:
        return {
          size: pageSize,
          total: 0,
          offset: 0,
        };
    }
  }, [hakutulosProps, paginationProps, pageSize]);

  const setPagination = useCallback(
    (pagination) => {
      const { size, offset } = pagination ?? {};
      dispatch(setSize({ newSize: size }));
      if (hakutulosProps.selectedTab === 'koulutus') {
        dispatch(setKoulutusOffset({ offset }));
      } else if (hakutulosProps.selectedTab === 'oppilaitos') {
        dispatch(setOppilaitosOffset({ offset }));
      }
      dispatch(newSearchAll({ clearPaging: false }));
    },
    [dispatch, hakutulosProps]
  );

  return useMemo(
    () => ({
      pageSize,
      pageSort,
      error,
      status,
      hakutulosProps,
      paginationProps,
      changePageSort,
      changePageSize,
      doSearch,
      pagination,
      setPagination,
    }),
    [
      pageSize,
      pageSort,
      changePageSort,
      changePageSize,
      hakutulosProps,
      paginationProps,
      error,
      status,
      doSearch,
      pagination,
      setPagination,
    ]
  );
};
