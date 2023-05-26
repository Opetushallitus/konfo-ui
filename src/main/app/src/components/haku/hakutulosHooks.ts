import { useCallback, useMemo, useState } from 'react';

import { debounce } from '@mui/material';
import { flow, pickBy, map, uniqBy, flatten, size } from 'lodash';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  searchKoulutukset,
  searchOppilaitokset,
  autoCompleteSearch,
} from '#/src/api/konfoApi';
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
  getAutocompleteRequestParams,
} from '#/src/store/reducers/hakutulosSliceSelector';
import { getFilterWithChecked, sortValues } from '#/src/tools/filters';
import { ValueOf } from '#/src/types/common';

const createSearchQueryHook =
  (key: string, fn: (x: any, signal: any) => any) => (requestParams: any) =>
    useQuery([key, requestParams], ({ signal }) => fn(requestParams, signal), {
      keepPreviousData: true,
    });

const useKoulutusSearch = createSearchQueryHook('searchKoulutukset', searchKoulutukset);

const useOppilaitosSearch = createSearchQueryHook(
  'searchOppilaitokset',
  searchOppilaitokset
);

const useAutoCompleteQuery = (requestParams: any) => {
  return useQuery(
    ['autoCompleteSearch', requestParams],
    () => autoCompleteSearch(requestParams),
    {
      enabled: size(requestParams.searchPhrase) >= 3,
    }
  );
};

export const useAutoComplete = () => {
  const autoCompleteRequestParams = useSelector(getAutocompleteRequestParams);

  const [searchPhrase, setSearchPhrase] = useState<string>();

  const { data, isFetching, status } = useAutoCompleteQuery({
    ...autoCompleteRequestParams,
    searchPhrase,
  });

  const setSearchPhraseDebounced = useMemo(
    () => debounce(setSearchPhrase, 300),
    [setSearchPhrase]
  );

  return useMemo(
    () => ({
      setSearchPhraseDebounced: setSearchPhraseDebounced,
      status,
      isFetching,
      data,
    }),
    [setSearchPhraseDebounced, isFetching, data, status]
  );
};

export const useSearchOperations = () => {};

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

  const navigate = useNavigate();
  const currentPage = useCurrentPage();

  const goToSearchPage = useCallback(
    () => dispatch(navigateToHaku({ navigate })),
    [dispatch, navigate]
  );

  const setPagination = useCallback(
    (newPagination) => {
      const { size: _size, offset } = newPagination ?? {};
      dispatch(setSize({ newSize: _size }));
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
      setFilters: (changes: any) => {
        dispatch(setFilterSelectedValues(changes));
        if (currentPage === 'haku') {
          goToSearchPage();
        }
      },
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
      clearFilters,
      selectedTab,
      setSelectedTabCb,
      goToSearchPage,
      dispatch,
      currentPage,
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

export const useSelectedFilters = (availableFilters: any, checkedFilters: any) => {
  const selectedFiltersWithAlakoodit = useMemo(
    () =>
      flow(
        (vals) => pickBy(vals, (v) => (Array.isArray(v) ? v.length > 0 : v)),
        Object.keys,
        (ks) =>
          map(ks, (filterId) =>
            Object.values(
              getFilterWithChecked(availableFilters, checkedFilters, filterId)
            )
          ),
        flatten,
        (flatted) => uniqBy(flatted, 'id')
      )(checkedFilters),
    [availableFilters, checkedFilters]
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
    flat: selectedFiltersFlatList,
    withAlakoodit: selectedFiltersWithAlakoodit,
  };
};

export const useAllSelectedFilters = () => {
  const { koulutusData } = useSearch();
  const koulutusFilters = koulutusData.filters;

  const allCheckedValues = useSelector(getFilters);

  return useSelectedFilters(koulutusFilters, allCheckedValues);
};

const useDispatchCb = (fn: (x: any) => any, options: { syncUrl?: boolean } = {}) => {
  const dispatch = useDispatch();
  const currentPage = useCurrentPage();
  const navigate = useNavigate();
  return useCallback(
    (props) => {
      dispatch(fn(props));
      if (options?.syncUrl && currentPage === 'haku') {
        dispatch(navigateToHaku({ navigate }));
      }
    },
    [dispatch, fn, currentPage, options, navigate]
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
