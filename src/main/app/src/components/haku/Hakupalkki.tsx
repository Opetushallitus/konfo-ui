import React, { useCallback, useState } from 'react';

import { Box, Hidden } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { useSearch } from './hakutulosHooks';
import { MobileFiltersOnTopMenu } from './MobileFiltersOnTopMenu';
import { RajaaPopoverButton, RajaimetPopover } from './RajaimetPopover';
import { SearchBox } from './SearchBox';

export const Hakupalkki = () => {
  const { t } = useTranslation();

  const { keyword, koulutusData, goToSearchPage, setKeyword, isFetching } = useSearch();
  const koulutusFilters = koulutusData?.filters;
  const isAtEtusivu = useIsAtEtusivu();

  const doSearch = useCallback(
    (phrase: string) => {
      setKeyword(phrase);
      goToSearchPage();
    },
    [setKeyword, goToSearchPage]
  );

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end" flexGrow={1}>
      <SearchBox
        key={keyword}
        keyword={keyword}
        doSearch={doSearch}
        rajaaButton={
          !isEmpty(koulutusFilters) && isAtEtusivu ? (
            <RajaaPopoverButton
              setAnchorEl={setAnchorEl}
              isPopoverOpen={isPopoverOpen}
              isLoading={isFetching}
            />
          ) : null
        }
      />
      {!isEmpty(koulutusFilters) && isAtEtusivu && (
        <RajaimetPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      )}
      {isAtEtusivu && (
        <Box
          display="flex"
          flexDirection="row-reverse"
          width="100%"
          justifyContent="space-between">
          <LocalizedLink
            component={RouterLink}
            to="/haku"
            sx={{
              marginTop: '10px',
              textDecoration: 'underline',
              color: 'white !important',
            }}>
            {t('jumpotron.naytakaikki')}
          </LocalizedLink>
          <Hidden mdUp>
            <MobileFiltersOnTopMenu />
          </Hidden>
        </Box>
      )}
    </Box>
  );
};
