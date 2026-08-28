import React, { useCallback } from 'react';

import { Box } from '@mui/material';

import { useSearch } from './hakutulosHooks';
import { SearchBox } from './SearchBox';

export const Hakupalkki = ({
  rajaaButton = null,
}: {
  rajaaButton?: React.JSX.Element | null;
}) => {
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
        rajaaButton={rajaaButton}
      />
    </Box>
  );
};
