import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../hooks';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
  SuodatinCheckbox,
  SuodatinListItemText,
  SuodatinMobileChip,
} from './CustomizedMuiComponents';

const OpetusKieliSuodatin = ({ expanded, elevation, displaySelected }) => {
  const history = useHistory();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { hakuStore } = useStores();
  const { koulutusFilters, oppilaitosFilters, toggle, filter } = hakuStore;

  const [opetusKielet, setOpetusKielet] = useState([]);
  const [checkedOpetusKielet, setCheckedOpetusKielet] = useState([]);

  useEffect(() => {
    const _opetusKielet =
      toggle === 'koulutus'
        ? Object.entries(koulutusFilters.opetusKieli)
        : Object.entries(oppilaitosFilters.opetusKieli);

    const orderedOpetusKielet = _.orderBy(
      _opetusKielet,
      ['[1].count', `[1].nimi.[${i18n.language}]`],
      ['desc', 'asc']
    );
    const removedMuuKieli = _.remove(
      orderedOpetusKielet,
      (n) => n[0] === 'oppilaitoksenopetuskieli_9'
    );

    setOpetusKielet(_.concat(orderedOpetusKielet, removedMuuKieli));
    setCheckedOpetusKielet(filter.opetuskieli);
  }, [
    i18n.language,
    koulutusFilters.opetusKieli,
    location,
    filter.opetuskieli,
    oppilaitosFilters.opetusKieli,
    toggle,
  ]);

  const handleLanguageToggle = (opetuskieliObj) => () => {
    const opetuskieliFilterObj = {
      id: opetuskieliObj[0],
      name: opetuskieliObj[1]?.nimi,
    };
    const currentIndex = checkedOpetusKielet.findIndex(
      ({ id }) => id === opetuskieliFilterObj.id
    );
    const newCheckedOpetusKielet = [...checkedOpetusKielet];

    if (currentIndex === -1) {
      newCheckedOpetusKielet.push(opetuskieliFilterObj);
    } else {
      newCheckedOpetusKielet.splice(currentIndex, 1);
    }

    setCheckedOpetusKielet(newCheckedOpetusKielet);
    const search = qs.parse(history.location.search);
    search.opetuskieli = newCheckedOpetusKielet.map(({ id }) => id).join(',');
    search.kpage = 1;
    search.opage = 1;
    hakuStore.setOpetusKieliFilter(newCheckedOpetusKielet);
    hakuStore.clearOffsetAndPaging();
    history.replace({ search: qs.stringify(search) });
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const SelectedOpetusKielet = () => {
    let selectedOpetuskieletStr = _.map(
      checkedOpetusKielet,
      `name.${i18n.language}`
    );
    selectedOpetuskieletStr = _.map(selectedOpetuskieletStr, (val) =>
      _.capitalize(val)
    );
    selectedOpetuskieletStr = _.join(selectedOpetuskieletStr, ', ');
    if (_.inRange(_.size(selectedOpetuskieletStr), 0, 20)) {
      return selectedOpetuskieletStr;
    }
    return <SuodatinMobileChip label={_.size(checkedOpetusKielet)} />;
  };

  return (
    <SuodatinExpansionPanel elevation={elevation} defaultExpanded={expanded}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap">
          <Grid item>
            <Typography variant="subtitle1">{t('haku.opetuskieli')}</Typography>
          </Grid>
          {displaySelected && (
            <Grid item>
              <SelectedOpetusKielet />
            </Grid>
          )}
        </Grid>
      </SuodatinExpansionPanelSummary>
      <SuodatinExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {opetusKielet.map((opetuskieliArr) => {
            const labelId = `language-list-label-${opetuskieliArr[0]}`;
            return (
              <ListItem
                key={opetuskieliArr[0]}
                dense
                button
                onClick={handleLanguageToggle(opetuskieliArr)}
                disabled={opetuskieliArr[1].count === 0}>
                <ListItemIcon>
                  <SuodatinCheckbox
                    edge="start"
                    checked={
                      checkedOpetusKielet.find(
                        ({ id }) => id === opetuskieliArr[0]
                      ) !== undefined
                    }
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <SuodatinListItemText
                  id={labelId}
                  primary={
                    <Grid container justify="space-between" wrap="nowrap">
                      <Grid item>
                        {opetuskieliArr[1]?.nimi?.[i18n.language]}
                      </Grid>
                      <Grid item>{`(${opetuskieliArr[1]?.count})`}</Grid>
                    </Grid>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default observer(OpetusKieliSuodatin);
