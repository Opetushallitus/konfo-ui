import React, { useCallback, useState } from 'react';

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
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { size, isEmpty, omit } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { MobileFiltersOnTopMenu } from '../suodattimet/hakutulosSuodattimet/MobileFiltersOnTopMenu';
import { HakupalkkiFilters } from './HakupalkkiFilters';
import { useAutoComplete, useSearch } from './hakutulosHooks';

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

const checkIsKeywordValid = (word: string) => size(word) === 0 || size(word) > 2;

const SearchBox = ({
  keyword,
  doSearch,
  rajaaButton,
}: {
  keyword: string;
  doSearch: any;
  rajaaButton?: JSX.Element | null;
}) => {
  const { setSearchPhraseDebounced, isFetching, data } = useAutoComplete();

  const [inputValue, setInputValue] = useState<string>(() => keyword);
  const isKeywordValid = checkIsKeywordValid(inputValue);

  const { t } = useTranslation();

  return (
    <Paper
      component="form"
      onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const keywordValue = formData.get('keyword');
        doSearch(keywordValue);
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
          options={data?.hits ?? ([] as any)}
          filterOptions={(opt) => opt}
          noOptionsText={t('haku.ei-ehdotuksia')}
          loadingText={t('haku.lataus-käynnissä')}
          loading={isFetching}
          freeSolo={true}
          onInputChange={(_e, newInputValue) => {
            setInputValue(newInputValue);
            setSearchPhraseDebounced(newInputValue);
          }}
          renderOption={(props, option: any) => {
            return (
              <li {...props}>
                <Link
                  color="inherit"
                  to={`/koulutus/${option.id}`}
                  component={RouterLink}
                  underline="none">
                  {option.label}
                </Link>
              </li>
            );
          }}
          renderInput={(params) => {
            const { InputProps } = params;
            const rest = omit(params, ['InputProps', 'InputLabelProps']);
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
      {rajaaButton}
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
  );
};

export const Hakupalkki = () => {
  const { t } = useTranslation();

  const { keyword, koulutusData, goToSearchPage, setKeyword } = useSearch();
  const koulutusFilters = koulutusData?.filters;
  const isAtEtusivu = useIsAtEtusivu();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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

  const doSearch = useCallback(
    (phrase: string) => {
      setKeyword(phrase);
      goToSearchPage();
    },
    [setKeyword, goToSearchPage]
  );

  const id = isPopoverOpen ? 'filters-popover' : undefined;

  const ExpandIcon = () =>
    isPopoverOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />;

  const rajaaButton = isAtEtusivu ? (
    <Hidden smDown>
      <Box component="div" className={classes.box}>
        <Divider orientation="vertical" />
        <Button
          aria-describedby={id}
          endIcon={
            !isPopoverOpen || !isEmpty(koulutusFilters) ? (
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
  ) : null;

  return (
    <StyledBox display="flex" flexDirection="column" alignItems="flex-end" flexGrow={1}>
      <SearchBox keyword={keyword} doSearch={doSearch} rajaaButton={rajaaButton} />
      {!isEmpty(koulutusFilters) && (
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
