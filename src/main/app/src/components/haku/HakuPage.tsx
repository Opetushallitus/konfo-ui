import React, { useEffect, useLayoutEffect } from 'react';

import { ExpandMore } from '@mui/icons-material';
import { Box, Grid, MenuItem, Paper, Select, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useMeasure, useWindowSize } from 'react-use';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import { Pagination } from '#/src/components/common/Pagination';
import { pageSizeArray, pageSortArray } from '#/src/constants';
import { useSideMenu } from '#/src/hooks';
import { useHakutulosWidth } from '#/src/store/reducers/appSlice';
import { urlParamsChanged } from '#/src/store/reducers/hakutulosSlice';
import { useUrlParams } from '#/src/tools/useUrlParams';

import { BackendErrorMessage } from './hakutulos/BackendErrorMessage';
import { HakutulosResults } from './hakutulos/HakutulosResults';
import { HakutulosTabs } from './hakutulos/HakutulosTabs';
import { Suodatinpalkki } from './hakutulos/Suodatinpalkki';
import { useAllSelectedFilters, useSearch, useSearchSortOrder } from './hakutulosHooks';
import { MobileFiltersOnTopMenu } from './MobileFiltersOnTopMenu';
import { SuodatinValinnat } from '../suodattimet/hakutulosSuodattimet/SuodatinValinnat';

const PREFIX = 'HakuPage';

const classes = {
  toggleWrapper: `${PREFIX}-toggleWrapper`,
  hakutulosSisalto: `${PREFIX}-hakutulosSisalto`,
  paperRoot: `${PREFIX}-paperRoot`,
  boxRoot: `${PREFIX}-boxRoot`,
  select: `${PREFIX}-select`,
  selectIcon: `${PREFIX}-selectIcon`,
  selectMenu: `${PREFIX}-selectMenu`,
  menuItemRoot: `${PREFIX}-menuItemRoot`,
  buttonRoot: `${PREFIX}-buttonRoot`,
  buttonLabel: `${PREFIX}-buttonLabel`,
  murupolkuContainer: `${PREFIX}-murupolkuContainer`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  maxWidth: 1600,
  margin: 'auto',
  [`& .${classes.toggleWrapper}`]: {
    minWidth: 400,
    flex: '1 0 auto',
  },

  [`& .${classes.paperRoot}`]: {
    width: '100%',
    boxShadow: 'none',
    [theme.breakpoints.up(1920)]: {
      padding: theme.spacing(1, 11),
    },
    [theme.breakpoints.between('xl', 'xxl')]: {
      padding: theme.spacing(1, 11),
    },
    [theme.breakpoints.down('xl')]: {
      padding: theme.spacing(1, 2),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1, 1),
    },
  },

  [`& .${classes.boxRoot}`]: {
    fontSize: 14,
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
  },

  [`& .${classes.select}`]: {
    '&:before': {
      borderBottom: 'none',
    },
  },

  [`& .${classes.selectIcon}`]: {
    fontSize: 20,
  },

  [`& .${classes.selectMenu}`]: {
    overflow: 'inherit !important',
  },

  [`& .${classes.menuItemRoot}`]: {
    paddingLeft: 12,
  },

  [`& .${classes.buttonRoot}`]: {
    marginLeft: theme.spacing(1),
  },

  [`& .${classes.buttonLabel}`]: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const useSyncedHakuParams = () => {
  const { search } = useUrlParams();
  const { keyword } = useParams<any>();

  const dispatch = useDispatch();

  // Kun URL:n search-parametrit muuttuu, synkataan muutokset reduxiin
  useEffect(() => {
    dispatch(urlParamsChanged({ keyword, search }));
  }, [dispatch, search, keyword]);
};

const getPageSortTranslationKey = (sort: string) => {
  switch (sort) {
    case 'score_desc':
      return 'haku.jarjesta_osuvin';
    case 'name_desc':
      return 'haku.jarjesta_aakkoset_o_a';
    case 'name_asc':
      return 'haku.jarjesta_aakkoset_a_o';
    default:
      return '';
  }
};

const RajainValinnat = () => {
  const allSelectedFilters = useAllSelectedFilters();
  const { setFilters, clearFilters } = useSearch();

  return (
    <SuodatinValinnat
      allSelectedFilters={allSelectedFilters}
      setFilters={setFilters}
      clearFilters={clearFilters}
    />
  );
};

const useContentWidth = () => {
  const { width: windowWidth } = useWindowSize();
  const { width: sideMenuWidth } = useSideMenu();

  return Math.round(windowWidth - sideMenuWidth);
};

const useSyncHakutulosWidth = () => {
  const [hakutulosRef, { width: realHakutulosWidth }] = useMeasure();

  const [, setHakutulosWidth] = useHakutulosWidth();
  useLayoutEffect(() => {
    setHakutulosWidth(Math.round(realHakutulosWidth));
  }, [realHakutulosWidth, setHakutulosWidth]);

  return hakutulosRef;
};

export const HakuPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  useSyncedHakuParams();

  const {
    selectedTab,
    status,
    keyword,
    isAnyFilterSelected,
    pagination,
    setPagination,
    koulutusData,
    oppilaitosData,
    isFetching,
  } = useSearch();

  const { sortOrder, setSortOrder } = useSearchSortOrder();

  const scrollTargetId = 'hakutulos-content';

  const hakutulosRef = useSyncHakutulosWidth();
  const [hakutulosWidth] = useHakutulosWidth();
  const isHakutulosSmUp = hakutulosWidth >= theme.breakpoints.values['sm'];
  const contentWidth = useContentWidth();
  const isContentMdUp = contentWidth >= theme.breakpoints.values['md'];

  return (
    <StyledGrid className={classes.hakutulosSisalto} container>
      <Paper classes={{ root: classes.paperRoot }} id={scrollTargetId}>
        <h1 style={{ display: 'none' }}>{t('haku.otsikko')}</h1>
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          className={classes.murupolkuContainer}>
          <Murupolku path={[{ name: t('haku.otsikko') }]} />
        </Grid>
        <Grid
          container
          alignItems="flex-end"
          spacing={2}
          style={{ marginBottom: theme.spacing(2) }}>
          {isContentMdUp && (
            <Grid item lg={3} md={4} sm={12}>
              <Typography style={{ paddingTop: 10 }} variant="h5">
                {t('haku.rajaa-tuloksia')}
              </Typography>
            </Grid>
          )}
          <Grid
            item
            container
            lg={9}
            md={8}
            sm={12}
            justifyContent="space-between"
            alignItems="baseline">
            <Grid item lg={6} md={7} xs={12} className={classes.toggleWrapper}>
              <HakutulosTabs />
            </Grid>
            {isContentMdUp && (
              <Grid item style={{ paddingTop: 6 }}>
                <Box component="span" className={classes.boxRoot}>
                  {t('haku.tulokset-per-sivu')}
                </Box>
                <Select
                  IconComponent={ExpandMore}
                  className={classes.select}
                  style={{ marginRight: 4 }}
                  classes={{
                    icon: classes.selectIcon,
                    select: classes.selectMenu,
                  }}
                  variant="standard"
                  value={pagination.size}
                  onChange={(e) => setPagination({ size: e.target.value })}>
                  {pageSizeArray.map((size) => (
                    <MenuItem
                      key={size}
                      classes={{ root: classes.menuItemRoot }}
                      value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
                <Box component="span" className={classes.boxRoot}>
                  {t('haku.jarjesta')}
                </Box>
                <Select
                  IconComponent={ExpandMore}
                  className={classes.select}
                  style={{ marginRight: 4 }}
                  classes={{
                    icon: classes.selectIcon,
                    select: classes.selectMenu,
                  }}
                  variant="standard"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}>
                  {pageSortArray.map((sort) => (
                    <MenuItem
                      key={sort}
                      classes={{ root: classes.menuItemRoot }}
                      value={sort}>
                      {t(getPageSortTranslationKey(sort))}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item container spacing={2} wrap="nowrap">
          {isContentMdUp ? <Suodatinpalkki /> : <MobileFiltersOnTopMenu />}
          <Grid item container direction="column" xs ref={hakutulosRef as any}>
            <Grid item>
              {isHakutulosSmUp && isAnyFilterSelected && <RajainValinnat />}
              {isFetching && <LoadingCircle />}
              {!isFetching && status === 'error' && <BackendErrorMessage />}
              {!isFetching && status === 'success' && (
                <HakutulosResults
                  keyword={keyword}
                  selectedTab={selectedTab}
                  koulutusHits={koulutusData?.hits}
                  oppilaitosHits={oppilaitosData?.hits}
                />
              )}
            </Grid>
            <Grid item>
              <Pagination
                total={pagination.total}
                pagination={pagination}
                setPagination={setPagination}
                scrollTargetId={scrollTargetId}
              />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </StyledGrid>
  );
};
