import React, { useMemo, useState, useEffect } from 'react';

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
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import {
  newSearchAll,
  setKeyword,
  clearPaging,
  searchAndMoveToHaku,
} from '#/src/store/reducers/hakutulosSlice';
import { getHakupalkkiProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { useOnEtusivu } from '#/src/tools/useOnEtusivu';

import { MobileFiltersOnTopMenu } from '../hakutulos/MobileFiltersOnTopMenu';
import { useUrlParams } from '../hakutulos/useUrlParams';
import { HakupalkkiFilters } from './HakupalkkiFilters';

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
    fontFamily: 'Open Sans',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '27px',
  },
  searchButton: {
    color: colors.white,
    borderRadius: '2px',
    height: '40px',
    width: '114px',
    fontFamily: 'Open Sans',
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
    fontFamily: 'Open Sans',
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

export const Hakupalkki = () => {
  const history = useHistory();
  const { search } = useUrlParams();
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { koulutusFilters } = useSelector(getHakupalkkiProps);
  const { isAtEtusivu } = useOnEtusivu();

  const [anchorEl, setAnchorEl] = useState(null);
  const [writtenKeyword, setWrittenKeyword] = useState(search?.keyword);
  const isKeywordValid = useMemo(
    () => !_.inRange(_.size(writtenKeyword), 1, 3),
    [writtenKeyword]
  );

  useEffect(() => {
    if (isAtEtusivu) {
      dispatch(setKeyword({ keyword: '' }));
      dispatch(clearPaging());
    }
  }, [isAtEtusivu, dispatch]);

  const handleDesktopBtnClick = (e) => {
    dispatch(newSearchAll());
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

  const doSearch = (event) => {
    event.preventDefault();
    dispatch(setKeyword({ keyword: writtenKeyword || '' }));
    dispatch(searchAndMoveToHaku({ history }));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end" flexGrow={1}>
      <Paper
        component="form"
        onSubmit={doSearch}
        className={classes.inputRoot}
        elevation={4}>
        <Tooltip
          placement="bottom-start"
          open={!isKeywordValid}
          title={t('haku.syota-ainakin-kolme-merkkia')}>
          <InputBase
            defaultValue={isAtEtusivu ? '' : writtenKeyword}
            className={classes.input}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && isKeywordValid) {
                doSearch(event);
              }
            }}
            onChange={(event) => {
              setWrittenKeyword(event.target.value);
            }}
            type="search"
            placeholder={t('haku.kehoite')}
            inputProps={{
              'aria-label': t('haku.kehoite'),
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
          <LocalizedLink component={RouterLink} to="/haku/" className={classes.link}>
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
