import { useCallback, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  newSearchAll,
  setOrder,
  setSize,
  setSort,
} from '#/src/store/reducers/hakutulosSlice';
import { getHakutulosProps } from '#/src/store/reducers/hakutulosSliceSelector';

export const useSearch = () => {
  const error = useSelector((state: any) => state.hakutulos.error);
  const status = useSelector((state: any) => state.hakutulos.status);
  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(0);
  const [pageSort, setPageSort] = useState('score_desc');

  const hakutulosProps = useSelector(getHakutulosProps);

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
      setPageSize(newSize);
      dispatch(setSize({ newSize }));
      dispatch(newSearchAll());
    },
    [dispatch, setPageSize]
  );

  return useMemo(
    () => ({
      pageSize,
      pageSort,
      error,
      status,
      hakutulosProps,
      changePageSort,
      changePageSize,
    }),
    [pageSize, pageSort, changePageSort, changePageSize, hakutulosProps, error, status]
  );
};
