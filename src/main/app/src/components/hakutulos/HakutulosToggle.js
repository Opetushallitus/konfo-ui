import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, useMediaQuery } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SchoolOutlined, HomeWorkOutlined } from '@material-ui/icons';
import qs from 'query-string';
import { styles } from '../../styles';
import { withTranslation } from 'react-i18next';
import { useStores } from '../../hooks';

const HakutulosToggle = observer((props) => {
  const { t, classes, history } = props;
  const { hakuStore } = useStores();
  const xs_600px_up = useMediaQuery('(min-width:600px)');

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const tab = hakuStore.toggle === 'koulutus' ? 0 : 1;
    setSelectedTab(tab);
  }, [hakuStore.toggle]);

  const handleSelectedTab = (event, newValue) => {
    setSelectedTab(newValue);
    const search = qs.parse(history.location.search);
    const toggleValue = newValue === 0 ? 'koulutus' : 'oppilaitos';
    search.toggle = toggleValue;
    hakuStore.setToggle(toggleValue);
    history.replace({ search: qs.stringify(search) });
  };

  return (
    <Tabs
      variant={xs_600px_up ? 'standard' : 'fullWidth'}
      value={selectedTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleSelectedTab}>
      <Tab
        icon={<SchoolOutlined className={classes.hakuTulosTabIconMargin} />}
        classes={{
          wrapper: classes.customWrapper,
          labelIcon: classes.customLabelIcon,
          root: classes.hakutulosToggleTabRoot,
        }}
        label={`${t('haku.koulutukset')} (${hakuStore.koulutusTotal})`}></Tab>
      <Tab
        icon={<HomeWorkOutlined className={classes.hakuTulosTabIconMargin} />}
        classes={{
          wrapper: classes.customWrapper,
          labelIcon: classes.customLabelIcon,
          root: classes.hakutulosToggleTabRoot,
        }}
        label={`${t('haku.oppilaitokset')} (${
          hakuStore.oppilaitosTotal
        })`}></Tab>
    </Tabs>
  );
});

const HakuTulosToggleWithStyles = withTranslation()(
  withStyles(styles)(HakutulosToggle)
);

export default withTranslation()(withRouter(HakuTulosToggleWithStyles));
