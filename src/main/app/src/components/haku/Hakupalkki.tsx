import React, { useCallback, useLayoutEffect } from 'react';

import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { syncKeywordFromUrl } from '#/src/store/reducers/hakutulosSlice';
import { getLanguage } from '#/src/tools/localization';

import { useSearch } from './hakutulosHooks';
import { SearchBox } from './SearchBox';

export const Hakupalkki = ({
  rajaaButton = null,
}: {
  rajaaButton?: React.JSX.Element | null;
}) => {
  const { draftKeyword, goToSearchPage, setKeyword, setDraftKeyword } = useSearch();
  const { keyword: urlKeyword } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isHakuPage = pathname.startsWith(`/${getLanguage()}/haku`);

  useLayoutEffect(() => {
    if (isHakuPage) {
      dispatch(syncKeywordFromUrl({ keyword: urlKeyword ?? '' }));
    }
  }, [dispatch, isHakuPage, urlKeyword]);

  const doSearch = useCallback(
    (phrase: string) => {
      setKeyword(phrase);
      goToSearchPage();
    },
    [setKeyword, goToSearchPage]
  );

  return (
    <Box marginBottom={1}>
      <SearchBox
        draftKeyword={draftKeyword}
        doSearch={doSearch}
        setDraftKeyword={setDraftKeyword}
        rajaaButton={rajaaButton}
      />
    </Box>
  );
};
