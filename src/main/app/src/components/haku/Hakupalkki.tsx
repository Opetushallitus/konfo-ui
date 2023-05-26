import React, { useCallback } from 'react';

import { Box } from '@mui/material';

import { useSearch } from './hakutulosHooks';
import { SearchBox } from './SearchBox';

export const Hakupalkki = ({
  rajaaButton = null,
}: {
  rajaaButton?: JSX.Element | null;
}) => {
  const { keyword, goToSearchPage, setKeyword } = useSearch();

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
        key={keyword}
        keyword={keyword}
        doSearch={doSearch}
        rajaaButton={rajaaButton}
      />
    </Box>
  );
};
