import { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { searchKoulutukset, searchOppilaitokset } from '#/src/api/konfoApi';
import {
  getCombinedQueryIsFetching,
  getCombinedQueryStatus,
} from '#/src/components/common/QueryResultWrapper';
import { FILTER_TYPES } from '#/src/constants';
import { useCurrentPage } from '#/src/store/reducers/appSlice';
import {
  setKoulutusOffset,
  setOppilaitosOffset,
  setSize,
  setSortOrder,
  setSelectedTab,
  setFilterSelectedValues,
  navigateToHaku,
  resetPagination,
  setSort,
  setOrder,
  clearSelectedFilters,
  setKeyword,
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
  getOrder,
  getSelectedTab,
  getSize,
  getSort,
  getSortOrder,
} from '#/src/store/reducers/hakutulosSliceSelector';
import { getFilterWithChecked, sortValues } from '#/src/tools/filters';
import { ValueOf } from '#/src/types/common';

const createSearchQueryHook =
  (key: string, fn: (x: any) => any) => (requestParams: any) =>
    useQuery([key, requestParams], () => fn(requestParams), {
      keepPreviousData: true,
    });

const useKoulutusSearch = createSearchQueryHook('searchKoulutukset', searchKoulutukset);

const useOppilaitosSearch = createSearchQueryHook(
  'searchOppilaitokset',
  searchOppilaitokset
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

  const dispatch = useDispatch();

  const pagination = useMemo(() => {
    switch (selectedTab) {
      case 'koulutus':
        return {
          size: pageSize,
          total: koulutusData?.total ?? 0,
          offset: koulutusOffset,
        };
      case 'oppilaitos':
        return {
          size: pageSize,
          total: oppilaitosData?.total ?? 0,
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

  const history = useHistory();
  const currentPage = useCurrentPage();

  const goToSearchPage = useCallback(
    () => dispatch(navigateToHaku({ history })),
    [dispatch, history]
  );

  const setPagination = useCallback(
    (newPagination) => {
      const { size, offset } = newPagination ?? {};
      dispatch(setSize({ newSize: size }));
      if (offset != null) {
        if (selectedTab === 'koulutus') {
          dispatch(setKoulutusOffset({ offset }));
        } else if (selectedTab === 'oppilaitos') {
          dispatch(setOppilaitosOffset({ offset }));
        }
      }
      if (currentPage === 'haku') {
        goToSearchPage();
      }
    },
    [dispatch, selectedTab, currentPage, goToSearchPage]
  );

  const setFilters = useCallback(
    (changes) => {
      dispatch(setFilterSelectedValues(changes));
      if (currentPage === 'haku') {
        goToSearchPage();
      }
    },
    [dispatch, currentPage, goToSearchPage]
  );

  const clearFilters = useCallback(() => {
    dispatch(clearSelectedFilters());
    dispatch(resetPagination());
    if (currentPage === 'haku') {
      goToSearchPage();
    }
  }, [dispatch, currentPage, goToSearchPage]);

  const setSelectedTabCb = useCallback(
    (tab) => dispatch(setSelectedTab({ newSelectedTab: tab })),
    [dispatch]
  );

  const resetPaginationCb = useCallback(() => dispatch(resetPagination), [dispatch]);

  const setKeywordCb = useCallback(
    (k) => dispatch(setKeyword({ keyword: k })),
    [dispatch]
  );

  return useMemo(
    () => ({
      keyword,
      setKeyword: setKeywordCb,
      isFetching,
      isAnyFilterSelected,
      status,
      koulutusData,
      oppilaitosData,
      pagination,
      setPagination,
      resetPagination: resetPaginationCb,
      setFilters,
      clearFilters,
      selectedTab,
      setSelectedTab: setSelectedTabCb,
      goToSearchPage,
    }),
    [
      keyword,
      setKeywordCb,
      isFetching,
      isAnyFilterSelected,
      status,
      pagination,
      setPagination,
      resetPaginationCb,
      oppilaitosData,
      koulutusData,
      setFilters,
      clearFilters,
      selectedTab,
      setSelectedTabCb,
      goToSearchPage,
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
  const koulutusFilters = koulutusData.filters;

  const allCheckedValues = useSelector(getFilters);

  const selectedFiltersWithAlakoodit = useMemo(
    () =>
      _fp.flow(
        _fp.pickBy((v) => (_fp.isArray(v) ? v.length > 0 : v)),
        _fp.keys,
        _fp.map((filterId) =>
          _fp.values(getFilterWithChecked(koulutusFilters, allCheckedValues, filterId))
        ),
        _fp.flatten,
        _fp.uniqBy('id')
      )(allCheckedValues),
    [koulutusFilters, allCheckedValues]
  );

  const selectedFiltersFlatList = useMemo(
    () =>
      selectedFiltersWithAlakoodit
        .map((v: any) => [v, ...(v.alakoodit || [])])
        .flat()
        .filter((v: any) => v.checked),
    [selectedFiltersWithAlakoodit]
  ); // Alakoodilistoissa voi olla valitsemattomia koodeja

  return {
    count: selectedFiltersFlatList.length,
    selectedFiltersFlatList,
    selectedFiltersWithAlakoodit,
  };
};

const useDispatchCb = (fn: (x: any) => any, options: { syncUrl?: boolean } = {}) => {
  const dispatch = useDispatch();
  const currentPage = useCurrentPage();
  const history = useHistory();
  return useCallback(
    (props) => {
      dispatch(fn(props));
      if (options?.syncUrl && currentPage === 'haku') {
        dispatch(navigateToHaku({ history }));
      }
    },
    [dispatch, fn, currentPage, options, history]
  );
};

export const useSearchSortOrder = () => {
  const sort = useSelector(getSort);
  const order = useSelector(getOrder);
  const sortOrder = useSelector(getSortOrder);

  const setSortCb = useDispatchCb(setSort, { syncUrl: true });
  const setOrderCb = useDispatchCb(setOrder, { syncUrl: true });
  const setSortOrderCb = useDispatchCb(setSortOrder, { syncUrl: true });

  return {
    sort,
    order,
    sortOrder,
    setSort: setSortCb,
    setOrder: setOrderCb,
    setSortOrder: setSortOrderCb,
  };
};