import React from 'react';

import { SchoolOutlined, HomeWorkOutlined } from '@mui/icons-material';
import { Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { useSearch } from '../hakutulosHooks';

const PREFIX = 'HakutulosTabs';

const classes = {
  tabIconMargin: `${PREFIX}-tabIconMargin`,
  tabWrapper: `${PREFIX}-tabWrapper`,
  tabLabelIcon: `${PREFIX}-tabLabelIcon`,
  tabRoot: `${PREFIX}-tabRoot`,
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
  [`& .${classes.tabIconMargin}`]: {
    marginBottom: '0 !important',
    marginRight: theme.spacing(2),
    verticalAlign: 'bottom',
  },

  [`& .${classes.tabWrapper}`]: {
    flexDirection: 'row',
    textTransform: 'capitalize',
    textAlign: 'left',
  },

  [`& .${classes.tabLabelIcon}`]: {
    minHeight: '50px',
    paddingLeft: 0,
    paddingRight: theme.spacing(3),
  },

  [`& .${classes.tabRoot}`]: {
    display: 'inline',
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

  const theme = useTheme();
  const muiScreenSizeMinMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <StyledTabs
      variant={muiScreenSizeMinMd ? 'standard' : 'fullWidth'}
      value={selectedTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={(_e, newSelectedTab: string) => {
        setSelectedTab(newSelectedTab);
      }}>
      <Tab
        value="koulutus"
        icon={<SchoolOutlined className={classes.tabIconMargin} />}
        classes={{
          wrapped: classes.tabWrapper,
          labelIcon: classes.tabLabelIcon,
          root: classes.tabRoot,
        }}
        label={`${t('haku.koulutukset')} (${koulutusTotal ?? 0})`}
      />
      <Tab
        value="oppilaitos"
        icon={<HomeWorkOutlined className={classes.tabIconMargin} />}
        classes={{
          wrapped: classes.tabWrapper,
          labelIcon: classes.tabLabelIcon,
          root: classes.tabRoot,
        }}
        label={`${t('haku.oppilaitokset')} (${oppilaitosTotal ?? 0})`}
      />
    </StyledTabs>
  );
};
