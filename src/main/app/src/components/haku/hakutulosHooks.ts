import { useCallback, useMemo, useState } from 'react';

import { debounce } from '@mui/material';
import { flow, pickBy, map, uniqBy, flatten, size, isEqual } from 'lodash';
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
} from '#/src/components/common/QueryResultWrapper/queryResultUtils';
import { FILTER_TYPES } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
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
  getHakuParams,
  createHakuUrl,
} from '#/src/store/reducers/hakutulosSliceSelector';
import { ReduxTodo, ValueOf } from '#/src/types/common';

type Pagination = {
  size?: number;
  total?: number;
  offset?: number;
};
import { isRajainActive, getRajainValueInUIFormat } from '#/src/tools/filters';

const createSearchQueryHook =
  (key: string, fn: (x: any, signal: any) => any, defaultOptions: any = {}) =>
  (requestParams: any, options: any = {}) =>
    useQuery([key, requestParams], ({ signal }) => fn(requestParams, signal), {
      ...defaultOptions,
      ...options,
    });

const useKoulutusSearch = createSearchQueryHook('searchKoulutukset', searchKoulutukset, {
  keepPreviousData: true,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});

const useOppilaitosSearch = createSearchQueryHook(
  'searchOppilaitokset',
  searchOppilaitokset,
  {
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }
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
  const keyword = useSelector(getKeyword);

  const [searchPhrase, setSearchPhrase] = useState<string>(() => keyword);

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

const isOnPageWithHaku = (currentPage: string) => ['', 'haku'].includes(currentPage);

export const useSearch = () => {
  const keyword = useSelector(getKeyword);
  const isAnyFilterSelected = useSelector(getIsAnyFilterSelected);
  const pageSize = useSelector(getSize);
  const koulutusOffset = useSelector(getKoulutusOffset);
  const oppilaitosOffset = useSelector(getOppilaitosOffset);

  const requestParams = useSelector(getAPIRequestParams);

  const koulutusPage = useSelector(getKoulutusPage);
  const oppilaitosPage = useSelector(getOppilaitosPage);

  const currentPage = useCurrentPage();

  const { searchTab: selectedTab, setSearchTab } = useSearchTab();

  const koulutusQueryResult = useKoulutusSearch(
    { page: koulutusPage, ...requestParams },
    {
      enabled: isOnPageWithHaku(currentPage),
    }
  );

  const { data: koulutusData = {} } = koulutusQueryResult;

  const oppilaitosQueryResult = useOppilaitosSearch(
    {
      page: oppilaitosPage,
      ...requestParams,
    },
    {
      enabled: isOnPageWithHaku(currentPage),
    }
  );

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

  const goToSearchPage = useCallback(
    () => dispatch(navigateToHaku({ navigate }) as ReduxTodo),
    [dispatch, navigate]
  );

  const setPagination = useCallback(
    (newPagination?: Pagination) => {
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

  const resetPaginationCb = useCallback(() => dispatch(resetPagination), [dispatch]);

  const setKeywordCb = useCallback(
    (k: string) => dispatch(setKeyword({ keyword: k })),
    [dispatch]
  );

  const setFilters = useCallback(
    (changes: any) => {
      dispatch(setFilterSelectedValues(changes));
      if (currentPage === 'haku') {
        goToSearchPage();
      }
    },
    [dispatch, goToSearchPage, currentPage]
  );

  return {
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
    setSelectedTab: setSearchTab,
    goToSearchPage,
  };
};

export const useFilterProps = (id: ValueOf<typeof FILTER_TYPES>) => {
  const { koulutusData, oppilaitosData } = useSearch();

  const { searchTab: selectedTab } = useSearchTab();

  const usedFilters =
    selectedTab === 'koulutus' ? koulutusData?.filters : oppilaitosData?.filters;

  const allFilters = useSelector(getFilters);

  return useMemo(
    () => getRajainValueInUIFormat(usedFilters, allFilters, id),
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
              getRajainValueInUIFormat(availableFilters, checkedFilters, filterId)
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
        .filter((v: any) => isRajainActive(v)),
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

  const allCheckedValues = useSelector(getFilters, isEqual);

  return useSelectedFilters(koulutusFilters, allCheckedValues);
};

const useDispatchCb = (fn: (x: any) => any, options: { syncUrl?: boolean } = {}) => {
  const dispatch = useDispatch();
  const currentPage = useCurrentPage();
  const navigate = useNavigate();
  return useCallback(
    (props: unknown) => {
      dispatch(fn(props));
      if (options?.syncUrl && currentPage === 'haku') {
        dispatch(navigateToHaku({ navigate }) as ReduxTodo);
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

export const useSearchTab = () => {
  const searchTab = useSelector(getSelectedTab);
  const dispatch = useDispatch();

  const setSearchTab = useCallback(
    (tab: string) => dispatch(setSelectedTab({ newSelectedTab: tab })),
    [dispatch]
  );

  return {
    searchTab,
    setSearchTab,
  };
};

export const useHakuUrl = (keyword: string, tab: string) => {
  const { hakuParams } = useSelector(getHakuParams);
  const [lng] = useLanguageState();

  return createHakuUrl(keyword, { ...hakuParams, tab }, lng as string);
};
