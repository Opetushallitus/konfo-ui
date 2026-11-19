import { useCallback } from 'react';

import { Box } from '@mui/material';

import { useSearch } from './hakutulosHooks';
import { SearchBox, SearchBoxLayoutProps } from './SearchBox';

export const Hakupalkki = (layoutProps: SearchBoxLayoutProps) => {
  const { draftKeyword, goToSearchPage, setKeyword, setDraftKeyword } = useSearch();

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
        {...layoutProps}
      />
    </Box>
  );
};
