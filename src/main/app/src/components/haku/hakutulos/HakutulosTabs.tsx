import React from 'react';

import { Tabs, Tab, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { SchoolOutlined, HomeWorkOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import { useSearch } from '../hakutulosHooks';

const useStyles = makeStyles((theme) => ({
  tabIconMargin: {
    marginBottom: '0 !important',
    marginRight: theme.spacing(2),
  },
  tabWrapper: {
    flexDirection: 'row',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  tabLabelIcon: {
    minHeight: '50px',
    paddingLeft: 0,
    paddingRight: theme.spacing(3),
  },
  tabRoot: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '0.9rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1rem',
    },
  },
}));

export const HakutulosTabs = () => {
  const { t } = useTranslation();
  const { selectedTab, setSelectedTab, koulutusData, oppilaitosData } = useSearch();

  const koulutusTotal = koulutusData?.total;
  const oppilaitosTotal = oppilaitosData?.total;

  const classes = useStyles();
  const theme = useTheme();
  const muiScreenSizeMinMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Tabs
      variant={muiScreenSizeMinMd ? 'standard' : 'fullWidth'}
      value={selectedTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={(ignored: any, newSelectedTab: string) => {
        setSelectedTab(newSelectedTab);
      }}>
      <Tab
        value="koulutus"
        icon={<SchoolOutlined className={classes.tabIconMargin} />}
        classes={{
          wrapper: classes.tabWrapper,
          labelIcon: classes.tabLabelIcon,
          root: classes.tabRoot,
        }}
        label={`${t('haku.koulutukset')} (${koulutusTotal ?? 0})`}></Tab>
      <Tab
        value="oppilaitos"
        icon={<HomeWorkOutlined className={classes.tabIconMargin} />}
        classes={{
          wrapper: classes.tabWrapper,
          labelIcon: classes.tabLabelIcon,
          root: classes.tabRoot,
        }}
        label={`${t('haku.oppilaitokset')} (${oppilaitosTotal ?? 0})`}></Tab>
    </Tabs>
  );
};
