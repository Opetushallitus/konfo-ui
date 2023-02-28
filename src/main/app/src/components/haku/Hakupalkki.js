import React, { useState } from 'react';

import {
  SearchOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
} from '@mui/icons-material';
import {
  Grid,
  Box,
  CircularProgress,
  Divider,
  Hidden,
  Paper,
  Popover,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Select, { components } from 'react-select';

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

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '34px',
    border: 0,
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: state.isFocused ? 0 : 0,
    },
    cursor: 'text',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    padding: '6px',
  }),
};

// const checkIsKeywordValid = (word) => _.size(word) === 0 || _.size(word) > 2;

const LoadingIndicator = () => <CircularProgress size={25} color="inherit" />;

export const Hakupalkki = () => {
  const { t } = useTranslation();

  const {
    keyword,
    // searchPhrase,
    koulutusData,
    autoCompleteOptions,
    goToSearchPage,
    setKeyword,
    // setSearchPhrase,
    isFetchingAutocompleteResults,
  } = useSearch();
  const koulutusFilters = koulutusData?.filters;
  const isAtEtusivu = useIsAtEtusivu();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isKeywordValid /* setIsKeywordValid */] = useState(true);
  // const [inputValue, setInputValue] = useState('');

  const handleDesktopBtnClick = (e) => {
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

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>{t('sisaltohaku.eituloksia')}</span>
      </components.NoOptionsMessage>
    );
  };

  return (
    <StyledBox display="flex" flexDirection="column" alignItems="flex-end" flexGrow={1}>
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const keywordValue = formData.get('keyword');
          console.log('!!!!!!!!!!!!!!!!!!!!!! onSubmit ' + keywordValue);
          console.log(formData);
          setKeyword(keywordValue ?? '');
          goToSearchPage();
        }}
        className={classes.inputRoot}
        elevation={4}>
        <Tooltip
          placement="bottom-start"
          open={!isKeywordValid}
          title={t('haku.syota-ainakin-kolme-merkkia')}>
          <Grid item style={{ width: '100%' }}>
            <Select
              components={{
                LoadingIndicator,
                NoOptionsMessage,
                DropdownIndicator: () => null,
              }}
              key={keyword}
              name="keyword"
              styles={customStyles}
              defaultValue={keyword}
              isLoading={isFetchingAutocompleteResults}
              options={autoCompleteOptions || []}
              className={classes.input}
              placeholder={t('haku.kehoite')}
              /*
              onInputChange={(newInputValue, { action }) => {
                console.log('!!!!!!!!!!!!!!!!!!!!!! onInputChange ' + newInputValue + '*');
                console.log(action);
                if (action === 'input-change') {
                  setInputValue(newInputValue);
                  setIsKeywordValid(checkIsKeywordValid(newInputValue));
                  if (_.size(newInputValue) > 2) {
                    setSearchPhrase(newInputValue);
                  } else if (_.size(searchPhrase) > 0) {
                    setSearchPhrase('');
                  }
                }
              }}
              */
              // onChange={(newValue) => {
              //  console.log('!!!!!!!!!!!!!!!!!!!!!! onChange ');
              //  console.log(newValue.label);
              //  setInputValue(newValue.label);
              //  setKeyword(newValue.label);
              //  goToSearchPage();
              // }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: colors.grey,
                  primary: colors.grey,
                },
              })}
            />
          </Grid>
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
