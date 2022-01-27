import React, { useEffect, useState } from 'react';

import {
  Box,
  Grid,
  Hidden,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Murupolku from '#/src/components/common/Murupolku';
import { pageSizeArray, pageSortArray } from '#/src/constants';
import { useQueryParams } from '#/src/hooks';
import {
  clearPaging,
  searchAll,
  setSize,
  setOrder,
  setSort,
} from '#/src/store/reducers/hakutulosSlice';
import { getHakutulosProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { BackendErrorMessage } from './BackendErrorMessage';
import { HakutulosResults } from './HakutulosResults';
import { SuodatinValinnat } from './hakutulosSuodattimet/SuodatinValinnat';
import { HakutulosToggle } from './HakutulosToggle';
import { MobileFiltersOnTopMenu } from './MobileFiltersOnTopMenu';
import { Pagination } from './Pagination';
import { Suodatinpalkki } from './Suodatinpalkki';

const useStyles = makeStyles((theme) => ({
  toggleWrapper: {
    'min-width': 400,
    flex: '1 0 auto',
  },
  hakutulosSisalto: {
    maxWidth: 1600,
    margin: 'auto',
  },
  paperRoot: {
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
  boxRoot: {
    fontSize: 14,
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
  },
  select: {
    '&:before': {
      borderBottom: 'none',
    },
  },
  selectIcon: {
    fontSize: 20,
  },
  selectMenu: {
    overflow: 'inherit',
  },
  menuItemRoot: {
    paddingLeft: 12,
  },
  buttonRoot: {
    marginLeft: theme.spacing(1),
  },
  buttonLabel: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  murupolkuContainer: {
    margin: theme.spacing(5, 0, 7, 0),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(2, 0),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0),
    },
  },
}));

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

export const Hakutulos = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const hakutulosProps = useSelector(getHakutulosProps);
  const apiRequestParams = useQueryParams();
  const error = useSelector((state: any) => state.hakutulos.error);
  const status = useSelector((state: any) => state.hakutulos.status);
  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(0);
  const [pageSort, setPageSort] = useState('score_desc');

  useEffect(() => {
    setPageSize(hakutulosProps.size);
  }, [hakutulosProps.size]);

  const handlePageSortChange = (e: any) => {
    const newPageSort = e.target.value;
    const newOrder = newPageSort === 'name_asc' ? 'asc' : 'desc';
    const newSort = newPageSort === 'score_desc' ? 'score' : 'name';

    setPageSort(newPageSort);
    dispatch(setSort({ newSort }));
    dispatch(setOrder({ newOrder }));
    dispatch(searchAll({ ...apiRequestParams, order: newOrder, sort: newSort }));
  };
  const handlePageSizeChange = (e: any) => {
    const newSize = e.target.value;

    setPageSize(newSize);
    dispatch(clearPaging());
    dispatch(setSize({ newSize }));
    dispatch(searchAll({ ...apiRequestParams, size: newSize }));
  };

  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid className={classes.hakutulosSisalto} container>
      <Paper classes={{ root: classes.paperRoot }} id="hakutulos-content">
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
          alignItems="flex-start"
          spacing={2}
          style={{ marginBottom: theme.spacing(2) }}>
          <Hidden smDown>
            <Grid item lg={3} md={4} sm={12}>
              <Typography style={{ paddingTop: 10 }} variant="h5">
                {t('haku.rajaa-tuloksia')}
              </Typography>
            </Grid>
          </Hidden>
          <Grid
            item
            container
            lg={9}
            md={8}
            sm={12}
            justifyContent="space-between"
            alignItems="baseline">
            <Grid item lg={6} md={7} xs={12} className={classes.toggleWrapper}>
              <HakutulosToggle />
            </Grid>
            <Hidden smDown>
              <Grid item style={{ paddingTop: 6 }}>
                {/* NOTE Jostain syystä classes ei ole tyypitetty propsiksi mutta on kuitenkin oikeasti propsi */}
                <Box component="span" {...{ classes: { root: classes.boxRoot } }}>
                  {t('haku.tulokset-per-sivu')}
                </Box>
                <Select
                  IconComponent={ExpandMore}
                  className={classes.select}
                  style={{ marginRight: 4 }}
                  classes={{
                    icon: classes.selectIcon,
                    selectMenu: classes.selectMenu,
                  }}
                  value={pageSize}
                  onChange={handlePageSizeChange}>
                  {pageSizeArray.map((size) => (
                    <MenuItem
                      key={size}
                      classes={{ root: classes.menuItemRoot }}
                      value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
                {/* NOTE Jostain syystä classes ei ole tyypitetty propsiksi mutta on kuitenkin oikeasti propsi */}
                <Box component="span" {...{ classes: { root: classes.boxRoot } }}>
                  {t('haku.jarjesta')}
                </Box>
                <Select
                  IconComponent={ExpandMore}
                  className={classes.select}
                  style={{ marginRight: 4 }}
                  classes={{
                    icon: classes.selectIcon,
                    selectMenu: classes.selectMenu,
                  }}
                  value={pageSort}
                  onChange={handlePageSortChange}>
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
            </Hidden>
          </Grid>
        </Grid>
        <Grid item container spacing={2} wrap="nowrap">
          {mdUp ? <Suodatinpalkki /> : <MobileFiltersOnTopMenu />}
          <Grid item container direction="column" xs>
            <Grid item>
              <Hidden smDown>
                {hakutulosProps.isAnyFilterSelected && <SuodatinValinnat />}
              </Hidden>
              {status === 'loading' && <LoadingCircle />}
              {status === 'idle' && error && <BackendErrorMessage />}
              {status === 'idle' && !error && <HakutulosResults {...hakutulosProps} />}
            </Grid>
            <Grid item>
              <Pagination size={hakutulosProps.size} />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};
