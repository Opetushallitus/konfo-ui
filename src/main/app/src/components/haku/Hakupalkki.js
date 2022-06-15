import React, { useState } from 'react';

import {
  Box,
  CircularProgress,
  Divider,
  Hidden,
  makeStyles,
  Paper,
  Popover,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import {
  SearchOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
} from '@material-ui/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';

import { HakupalkkiFilters } from './HakupalkkiFilters';
import { MobileFiltersOnTopMenu } from '../suodattimet/hakutulosSuodattimet/MobileFiltersOnTopMenu';
import { useSearch } from './hakutulosHooks';

const useStyles = makeStyles((theme) => ({
  box: {
    borderLeft: `2px solid ${colors.lightGrey}`,
    paddingLeft: '10px',
    marginLeft: '10px',
  },
  input: {
    borderRadius: 0,
    marginLeft: theme.spacing(3),
    flex: 1,
    color: colors.darkGrey,
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '27px',
  },
  searchButton: {
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
  mobileFilterButton: {
    color: colors.white,
    paddingLeft: 0,
    marginTop: '3px',
    fontWeight: 600,
  },
  mobileIconButton: {
    marginRight: theme.spacing(1),
  },
  expandButton: {
    height: '40px',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '16px',
    textAlign: 'center',
  },
  popoverRoot: {
    border: '10px solid black',
    background: 'rgba(0,0,0,0.5)',
    opacity: 1,
    transition: 'all 0.5s',
  },
  arrowBox: {
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
  },
  popoverPaper: {
    marginTop: '8px',
    paddingTop: '25px',
    background: 'transparent',
  },
  inputRoot: {
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
  link: {
    marginTop: '10px',
    textDecoration: 'underline',
    color: 'white !important',
  },
}));

const checkIsKeywordValid = (word) => _.size(word) === 0 || _.size(word) > 2;

export const Hakupalkki = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { keyword, koulutusData, goToSearchPage, setKeyword } = useSearch();

  const koulutusFilters = koulutusData?.filters;
  const isAtEtusivu = useIsAtEtusivu();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isKeywordValid, setIsKeywordValid] = useState(true);

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

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end" flexGrow={1}>
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const keywordValue = formData.get('keyword');
          setKeyword(keywordValue ?? '');
          goToSearchPage();
        }}
        className={classes.inputRoot}
        elevation={4}>
        <Tooltip
          placement="bottom-start"
          open={!isKeywordValid}
          title={t('haku.syota-ainakin-kolme-merkkia')}>
          <InputBase
            key={keyword}
            className={classes.input}
            name="keyword"
            defaultValue={keyword}
            onChange={(e) => {
              const inputKeyword = e.target.value;
              setIsKeywordValid(checkIsKeywordValid(inputKeyword));
            }}
            type="search"
            placeholder={t('haku.kehoite')}
            inputProps={{
              'aria-label': t('haku.kehoite'),
              autoComplete: 'off',
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
        <>
          <Hidden smDown>
            <Popover
              classes={{ paper: classes.popoverPaper, root: classes.popoverRoot }}
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
              <Box component="div" className={classes.arrowBox}>
                <HakupalkkiFilters />
              </Box>
            </Popover>
          </Hidden>
        </>
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
    </Box>
  );
};
