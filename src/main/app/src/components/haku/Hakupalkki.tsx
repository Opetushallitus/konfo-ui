import React, { useMemo, useState } from 'react';

import {
  SearchOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
} from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Divider,
  Hidden,
  Paper,
  Popover,
  Tooltip,
  IconButton,
  Button,
  Autocomplete,
  InputBase,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { MobileFiltersOnTopMenu } from '../suodattimet/hakutulosSuodattimet/MobileFiltersOnTopMenu';
import { HakupalkkiFilters } from './HakupalkkiFilters';
import { useSearch } from './hakutulosHooks';

const PREFIX = 'Hakupalkki';

const classes = {
  box: `${PREFIX}-box`,
  input: `${PREFIX}-input`,
  searchButton: `${PREFIX}-searchButton`,
  mobileFilterButton: `${PREFIX}-mobileFilterButton`,
  mobileIconButton: `${PREFIX}-mobileIconButton`,
  expandButton: `${PREFIX}-expandButton`,
  inputRoot: `${PREFIX}-inputRoot`,
  link: `${PREFIX}-link`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.box}`]: {
    borderLeft: `2px solid ${colors.lightGrey}`,
    paddingLeft: '10px',
    marginLeft: '10px',
  },

  [`& .${classes.input}`]: {
    borderRadius: 0,
    marginLeft: theme.spacing(2),
    flex: 1,
    color: colors.darkGrey,
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '27px',
  },

  [`& .${classes.searchButton}`]: {
    color: colors.white,
    borderRadius: '2px',
    height: '40px',
    width: '114px',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '16px',
    textAlign: 'center',
    marginRight: '20px',
    marginLeft: '20px',
  },

  [`& .${classes.mobileFilterButton}`]: {
    color: colors.white,
    paddingLeft: 0,
    marginTop: '3px',
    fontWeight: 600,
  },

  [`& .${classes.mobileIconButton}`]: {
    marginRight: theme.spacing(1),
  },

  [`& .${classes.expandButton}`]: {
    height: '40px',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '16px',
    textAlign: 'center',
  },

  [`& .${classes.inputRoot}`]: {
    [theme.breakpoints.up('md')]: {
      height: '73px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '58px',
    },
    paddingLeft: '15px',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #B2B2B2',
    borderRadius: '2px',
  },

  [`& .${classes.link}`]: {
    marginTop: '10px',
    textDecoration: 'underline',
    color: 'white !important',
  },
}));

const ArrowBox = styled(Box)(() => ({
  position: 'relative',
  background: colors.white,
  border: `4px solid ${colors.white}`,
  borderRadius: '4px',
  '&:after, &:before': {
    bottom: '100%',
    left: '50%',
    border: 'solid transparent',
    content: '" "',
    height: 0,
    width: 0,
    position: 'absolute',
    pointerEvents: 'none',
  },

  '&:after': {
    borderColor: 'rgba(136, 183, 213, 0)',
    borderBottomColor: colors.white,
  },
  '&:before': {
    borderColor: 'rgba(194, 225, 245, 0)',
    borderBottomColor: colors.white,
    borderWidth: '25px',
    marginLeft: '-25px',
  },
}));

const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    marginTop: '8px',
    paddingTop: '25px',
    background: 'transparent',
  },
}));

const checkIsKeywordValid = (word: string) => _.size(word) === 0 || _.size(word) > 2;

export const Hakupalkki = () => {
  const { t } = useTranslation();

  const {
    keyword,
    searchPhrase,
    koulutusData,
    autoCompleteOptions,
    goToSearchPage,
    setKeyword,
    setSearchPhrase,
    isFetchingAutocompleteResults,
  } = useSearch();
  const koulutusFilters = koulutusData?.filters;
  const isAtEtusivu = useIsAtEtusivu();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [inputValue, setInputValue] = useState(() => keyword);

  const handleDesktopBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    window.scrollTo({
      top: 250,
      left: 0,
      behavior: 'smooth',
    });
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  const ExpandIcon = () =>
    isPopoverOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />;
  const id = isPopoverOpen ? 'filters-popover' : undefined;

  const isKeywordValid = checkIsKeywordValid(inputValue);
  const setSearchPhraseDelayed = useMemo(
    () => debounce(setSearchPhrase, 200),
    [setSearchPhrase]
  );

  return (
    <StyledBox display="flex" flexDirection="column" alignItems="flex-end" flexGrow={1}>
      <Paper
        component="form"
        onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const keywordValue = formData.get('keyword');
          setKeyword(keywordValue ?? '');
          goToSearchPage();
        }}
        className={classes.inputRoot}
        elevation={4}>
        <Tooltip
          placement="bottom-start"
          open={!isKeywordValid}
          title={t('haku.syota-ainakin-kolme-merkkia') || ''}>
          <Autocomplete
            fullWidth={true}
            key={keyword}
            defaultValue={keyword}
            options={autoCompleteOptions ?? []}
            filterOptions={(opt) => opt}
            noOptionsText={t('sisaltohaku.eituloksia')}
            loading={isFetchingAutocompleteResults}
            freeSolo={true}
            onInputChange={(_e, newInputValue) => {
              setInputValue(newInputValue);
              if (_.size(newInputValue) > 2) {
                setSearchPhraseDelayed(newInputValue);
              } else if (_.size(searchPhrase) > 0) {
                setSearchPhrase('');
              }
            }}
            onChange={(_e, value, reason) => {
              if (reason === 'selectOption') {
                setKeyword(value.label);
                goToSearchPage();
              }
            }}
            renderInput={(params) => {
              const { InputProps, ...rest } = params;
              return (
                <InputBase
                  data-cy="autocomplete-input"
                  sx={{
                    borderRadius: 0,
                    flex: 1,
                    width: '100%',
                  }}
                  type="text"
                  name="keyword"
                  placeholder={t('haku.kehoite')}
                  {...InputProps}
                  {...rest}
                />
              );
            }}
          />
        </Tooltip>
        {isAtEtusivu && (
          <Hidden smDown>
            <Box component="div" className={classes.box}>
              <Divider orientation="vertical" />
              <Button
                aria-describedby={id}
                endIcon={
                  !isPopoverOpen || !_.isEmpty(koulutusFilters) ? (
                    <ExpandIcon />
                  ) : (
                    <CircularProgress size={25} color="inherit" />
                  )
                }
                onClick={handleDesktopBtnClick}
                className={classes.expandButton}
                aria-label={t('haku.rajaa')}>
                {t('haku.rajaa')}
              </Button>
            </Box>
          </Hidden>
        )}
        <Hidden smDown>
          <Button
            startIcon={<SearchOutlined />}
            disabled={!isKeywordValid}
            type="submit"
            variant="contained"
            color="secondary"
            className={classes.searchButton}
            aria-label={t('haku.etsi')}>
            {t('haku.etsi')}
          </Button>
        </Hidden>
        <Hidden mdUp>
          <IconButton
            disabled={!isKeywordValid}
            type="submit"
            className={classes.mobileIconButton}
            aria-label={t('haku.etsi')}>
            <SearchOutlined />
          </IconButton>
        </Hidden>
      </Paper>
      {!_.isEmpty(koulutusFilters) && (
        <Hidden smDown>
          <StyledPopover
            id={id}
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}>
            <ArrowBox component="div">
              <HakupalkkiFilters />
            </ArrowBox>
          </StyledPopover>
        </Hidden>
      )}
      {isAtEtusivu && (
        <Box
          display="flex"
          flexDirection="row-reverse"
          width="100%"
          justifyContent="space-between">
          <LocalizedLink component={RouterLink} to="/haku" className={classes.link}>
            {t('jumpotron.naytakaikki')}
          </LocalizedLink>
          <Hidden mdUp>
            <MobileFiltersOnTopMenu />
          </Hidden>
        </Box>
      )}
    </StyledBox>
  );
};
