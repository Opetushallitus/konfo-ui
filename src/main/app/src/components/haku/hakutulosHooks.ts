import { useCallback, useMemo, useState } from 'react';

import { debounce } from '@mui/material';
import {
  flow,
  pickBy,
  map,
  uniqBy,
  flatten,
  size,
  isEqual,
  keys,
  omit,
  forEach,
  some,
} from 'lodash';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { match, P } from 'ts-pattern';

import {
  searchKoulutukset,
  searchOppilaitokset,
  autoCompleteSearch,
} from '#/src/api/konfoApi';
import {
  getCombinedQueryIsFetching,
  getCombinedQueryStatus,
} from '#/src/components/common/QueryResultWrapper/queryResultUtils';
import { RAJAIN_TYPES } from '#/src/constants';
import { useLanguageState } from '#/src/hooks';
import { useAppDispatch, useAppSelector } from '#/src/hooks/reduxHooks';
import { useCurrentPage } from '#/src/store/reducers/appSlice';
import {
  setKoulutusOffset,
  setOppilaitosOffset,
  setSize,
  setSortOrder,
  setSelectedTab,
  setRajainValues as setReduxRajainValues,
  navigateToHaku,
  resetPagination,
  setSort,
  setOrder,
  clearRajainValues as clearReduxRajainValues,
  setKeyword,
  RajainValues,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getRajainValues,
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
import {
  sortValues,
  getRajainOptions,
  isRajainActive,
  getRajainValueInUIFormat,
} from '#/src/tools/filters';
import { RajainName, ReduxTodo, ValueOf } from '#/src/types/common';
import { isCompositeRajainId } from '#/src/types/SuodatinTypes';

import { RajainOptions } from '../koulutus/ToteutusList';

type Pagination = {
  size?: number;
  total?: number;
  offset?: number;
};

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

const useAutoCompleteQuery = (requestParams: any) =>
  useQuery(
    ['autoCompleteSearch', requestParams],
    () => autoCompleteSearch(requestParams),
    {
      enabled: size(requestParams.searchPhrase) >= 3,
    }
  );

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

const isOnPageWithHaku = (currentPage: string) =>
  ['', 'haku', 'ohjaava-haku'].includes(currentPage);

export const useSearch = () => {
  const keyword = useSelector(getKeyword);
  const isAnyRajainSelected = useSelector(getIsAnyFilterSelected);
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

  const clearRajainValues = useCallback(() => {
    dispatch(clearReduxRajainValues());
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

  const setRajainValues = useCallback(
    (changes: any) => {
      dispatch(setReduxRajainValues(changes));
      if (currentPage === 'haku') {
        goToSearchPage();
      }
    },
    [dispatch, goToSearchPage, currentPage]
  );

  const rajainOptions =
    selectedTab === 'koulutus' ? koulutusData?.filters : oppilaitosData?.filters;

  const rajainValues = useSelector(getRajainValues);

  return {
    keyword,
    setKeyword: setKeywordCb,
    isFetching,
    isAnyRajainSelected,
    status,
    koulutusData,
    oppilaitosData,
    pagination,
    setPagination,
    resetPagination: resetPaginationCb,
    setRajainValues,
    clearRajainValues,
    selectedTab,
    setSelectedTab: setSearchTab,
    goToSearchPage,
    rajainOptions,
    rajainValues,
  };
};

export const useFilterProps = (id: ValueOf<typeof RAJAIN_TYPES>) => {
  const { koulutusData, oppilaitosData } = useSearch();

  const { searchTab: selectedTab } = useSearchTab();

  const usedFilters =
    selectedTab === 'koulutus' ? koulutusData?.filters : oppilaitosData?.filters;

  const allFilters = useSelector(getRajainValues);

  return useMemo(
    () => getRajainValueInUIFormat(usedFilters, allFilters, id),
    [usedFilters, allFilters, id]
  );
};

export const useRajainOptionsForKysymys = (
  rajainId: ValueOf<typeof RAJAIN_TYPES>,
  isRajainWithRange: boolean = false
) => {
  const { koulutusData } = useSearch();
  const filters = koulutusData?.filters;
  return isRajainWithRange
    ? { [rajainId]: filters?.[rajainId] }
    : sortValues(getRajainOptions(filters, rajainId));
};

export const useSelectedFilters = (
  rajainOptions: RajainOptions,
  rajainValues: Partial<RajainValues>
) => {
  const selectedFiltersWithAlakoodit = useMemo(() => {
    const compositeFilters = keys(rajainOptions).filter((k) => isCompositeRajainId(k));
    const compositeFlattened: Record<
      string,
      Array<string> | boolean | Record<string, number>
    > = {};
    forEach(compositeFilters, (v) => {
      for (const subKey in rajainOptions[v]) {
        compositeFlattened[subKey] = rajainOptions[v][subKey];
      }
    });
    const withCompositeFlattened = {
      ...omit(rajainOptions, compositeFilters),
      ...compositeFlattened,
    };

    return flow(
      (vals) =>
        pickBy(vals, (v, k) =>
          match(v)
            .with(P.array(P.string), (arr) => arr.length > 0)
            .with(
              {
                [`${k}_min`]: P.number,
                [`${k}_max`]: P.number,
              },
              (obj) => some(Object.values(obj), (nbr) => nbr > 0)
            )
            .with({ [`${k}_max`]: P.select(P.number) }, (nbr) => nbr > 0)
            .otherwise((bool) => bool === true)
        ),
      Object.keys,
      (ks: Array<RajainName>) =>
        map(ks, (filterId) =>
          Object.values(
            getRajainValueInUIFormat(
              withCompositeFlattened as any,
              rajainValues,
              filterId
            )
          )
        ),
      flatten,
      (flatted) => uniqBy(flatted, 'id')
    )(rajainValues);
  }, [rajainOptions, rajainValues]);

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
  const koulutusRajainOptions = koulutusData.filters;

  const rajainValues = useSelector(getRajainValues, isEqual);

  return useSelectedFilters(koulutusRajainOptions, rajainValues);
};

const useDispatchCb = (fn: (x: any) => any, options: { syncUrl?: boolean } = {}) => {
  const dispatch = useAppDispatch();
  const currentPage = useCurrentPage();
  const navigate = useNavigate();
  return useCallback(
    (props: unknown) => {
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

export const useSearchTab = () => {
  const searchTab = useSelector(getSelectedTab);
  const dispatch = useAppDispatch();

  const setSearchTab = useCallback(
    (tab: 'koulutus' | 'oppilaitos') => dispatch(setSelectedTab({ newSelectedTab: tab })),
    [dispatch]
  );

  return {
    searchTab,
    setSearchTab,
  };
};

export const useHakuUrl = (keyword: string, tab: 'koulutus' | 'oppilaitos') => {
  const { hakuParams } = useAppSelector(getHakuParams);
  const [lng] = useLanguageState();

  return createHakuUrl(keyword, { ...hakuParams, tab }, lng as string);
};
