import { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { searchKoulutukset, searchOppilaitokset } from '#/src/api/konfoApi';
import {
  getCombinedQueryIsFetching,
  getCombinedQueryStatus,
} from '#/src/components/common/QueryResultWrapper';
import { FILTER_TYPES } from '#/src/constants';
import {
  setKoulutusOffset,
  setOppilaitosOffset,
  setSize,
  setSortOrder,
  setSelectedTab,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getFilters,
  getIsAnyFilterSelected,
  getKeyword,
  getKoulutusOffset,
  getKoulutusPage,
  getOppilaitosOffset,
  getOppilaitosPage,
  getSelectedTab,
  getSize,
  getSortOrder,
} from '#/src/store/reducers/hakutulosSliceSelector';
import { getFilterWithChecked, sortValues } from '#/src/tools/filters';
import { ValueOf } from '#/src/types/common';

const useKoulutusSearch = (requestParams: any) =>
  useQuery(['searchKoulutukset', requestParams], () => searchKoulutukset(requestParams), {
    keepPreviousData: true,
  });
const useOppilaitosSearch = (requestParams: any) =>
  useQuery(
    ['searchOppilaitokset', requestParams],
    () => searchOppilaitokset(requestParams),
    {
      keepPreviousData: true,
    }
  );

export const useSearch = () => {
  const keyword = useSelector(getKeyword);
  const isAnyFilterSelected = useSelector(getIsAnyFilterSelected);
  const pageSize = useSelector(getSize);
  const selectedTab = useSelector(getSelectedTab);
  const koulutusOffset = useSelector(getKoulutusOffset);
  const oppilaitosOffset = useSelector(getOppilaitosOffset);

  const requestParams = useSelector(getAPIRequestParams);

  const koulutusPage = useSelector(getKoulutusPage);
  const oppilaitosPage = useSelector(getOppilaitosPage);

  const koulutusQueryResult = useKoulutusSearch({ page: koulutusPage, ...requestParams });

  const { data: koulutusData = {} } = koulutusQueryResult;

  const oppilaitosQueryResult = useOppilaitosSearch({
    page: oppilaitosPage,
    ...requestParams,
  });

  const { data: oppilaitosData } = oppilaitosQueryResult;

  const status = getCombinedQueryStatus([koulutusQueryResult, oppilaitosQueryResult]);
  const isFetching = getCombinedQueryIsFetching([
    koulutusQueryResult,
    oppilaitosQueryResult,
  ]);

  const pageSort = useSelector(getSortOrder);

  const dispatch = useDispatch();

  const changePageSort = useCallback(
    (e) => {
      const newPageSort = e.target.value;

      dispatch(setSortOrder(newPageSort));
    },
    [dispatch]
  );

  const changePageSize = useCallback(
    (e) => {
      const newSize = e.target.value;
      dispatch(setSize({ newSize }));
    },
    [dispatch]
  );

  const pagination = useMemo(() => {
    switch (selectedTab) {
      case 'koulutus':
        return {
          size: pageSize,
          total: koulutusData.total,
          offset: koulutusOffset,
        };
      case 'oppilaitos':
        return {
          size: pageSize,
          total: oppilaitosData.total,
          offset: oppilaitosOffset,
        };
      default:
        return {
          size: pageSize,
          total: 0,
          offset: 0,
        };
    }
  }, [
    koulutusData,
    oppilaitosData,
    koulutusOffset,
    oppilaitosOffset,
    selectedTab,
    pageSize,
  ]);

  const setPagination = useCallback(
    (pagination) => {
      const { size, offset } = pagination ?? {};
      dispatch(setSize({ newSize: size }));
      if (selectedTab === 'koulutus') {
        dispatch(setKoulutusOffset({ offset }));
      } else if (selectedTab === 'oppilaitos') {
        dispatch(setOppilaitosOffset({ offset }));
      }
    },
    [dispatch, selectedTab]
  );

  const setFilters = useCallback(({ changes }) => {}, []);

  const setSelectedTabCb = useCallback(
    (tab) => dispatch(setSelectedTab({ newSelectedTab: tab })),
    [dispatch]
  );

  return useMemo(
    () => ({
      keyword,
      isFetching,
      isAnyFilterSelected,
      pageSize,
      pageSort,
      status,
      koulutusData,
      oppilaitosData,
      changePageSort,
      changePageSize,
      pagination,
      setPagination,
      setFilters,
      selectedTab,
      setSelectedTab: setSelectedTabCb,
    }),
    [
      keyword,
      isFetching,
      isAnyFilterSelected,
      pageSize,
      pageSort,
      changePageSort,
      changePageSize,
      status,
      pagination,
      setPagination,
      oppilaitosData,
      koulutusData,
      setFilters,
      selectedTab,
      setSelectedTabCb,
    ]
  );
};

export const useFilterProps = (id: ValueOf<typeof FILTER_TYPES>) => {
  const { koulutusData, oppilaitosData } = useSearch();
  const selectedTab = useSelector(getSelectedTab);

  const usedFilters =
    selectedTab === 'koulutus' ? koulutusData?.filters : oppilaitosData?.filters;

  const allFilters = useSelector(getFilters);

  return useMemo(
    () => sortValues(getFilterWithChecked(usedFilters, allFilters, id)),
    [usedFilters, allFilters, id]
  );
};

export const useAllSelectedFilters = () => {
  const { koulutusData } = useSearch();
  const koulutusFilters = koulutusData?.filters;

  const allCheckedValues = useSelector(getFilters);

  const selectedFiltersWithAlakoodit = _fp.flow(
    _fp.pickBy((v) => (_fp.isArray(v) ? v.length > 0 : v)),
    _fp.keys,
    _fp.map((filterId) =>
      _fp.values(getFilterWithChecked(koulutusFilters, allCheckedValues, filterId))
    ),
    _fp.flatten,
    _fp.uniqBy('id')
  )(allCheckedValues);

  const selectedFiltersFlatList = selectedFiltersWithAlakoodit
    .map((v: any) => [v, ...(v.alakoodit || [])])
    .flat()
    .filter((v: any) => v.checked); // Alakoodilistoissa voi olla valitsemattomia koodeja

  return {
    count: selectedFiltersFlatList.length,
    selectedFiltersFlatList,
    selectedFiltersWithAlakoodit,
  };
};
