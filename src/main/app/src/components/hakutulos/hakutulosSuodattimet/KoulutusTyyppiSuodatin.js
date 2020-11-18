import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Button,
  ButtonGroup,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  useTheme,
  makeStyles,
} from '@material-ui/core';
import { ExpandMore, IndeterminateCheckBoxOutlined } from '@material-ui/icons';
import { twoLevelFilterUpdateAndSearch } from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getKoulutustyyppiFilterProps,
} from '#/src/store/reducers/hakutulosSliceSelector';
import {
  SuodatinCheckbox,
  SuodatinExpansionPanel,
  SuodatinExpansionPanelDetails,
  SuodatinExpansionPanelSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import SummaryContent from './SummaryContent';
import { Localizer as l } from '#/src/tools/Utils';
import { FILTER_TYPES } from '#/src/constants';
import { colors } from '#/src/colors';

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
  buttonRoot: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  buttonActive: {
    backgroundColor: colors.green,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.green,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.green,
  },
}));

const KoulutustyyppiSuodatin = ({
  expanded,
  elevation,
  displaySelected,
  summaryHidden = false,
}) => {
  const classes = withStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    koulutustyyppi,
    koulutustyyppiMuu,
    checkedKoulutustyypit,
    checkedKoulutustyypitStr,
    checkedKoulutustyypitKeys,
  } = useSelector(getKoulutustyyppiFilterProps);
  const apiRequestParams = useSelector(getAPIRequestParams);

  const [isMuuSelected, setIsMuuSelected] = useState(false);
  const koulutustyyppiOrKoulutusTyyppiMuu = isMuuSelected
    ? koulutustyyppiMuu
    : koulutustyyppi;
  const handleKoulutustyyppiClick = (clickedFilterId, parentFilterId) => () => {
    dispatch(
      twoLevelFilterUpdateAndSearch({
        filterType: FILTER_TYPES.KOULUTUSTYYPPI,
        apiRequestParams,
        clickedFilterId,
        parentFilterId,
        history,
      })
    );
  };

  function isIndeterminate(koulutustyyppiEntry = []) {
    const alakooditKeys = _.keys(_.get(koulutustyyppiEntry, '[1].alakoodit'));
    const areAllAlakooditChecked = _.every(alakooditKeys, (id) =>
      _.includes(checkedKoulutustyypitKeys, id)
    );
    const areSomeAlakoodiChecked = _.some(alakooditKeys, (id) =>
      _.includes(checkedKoulutustyypitKeys, id)
    );
    return areSomeAlakoodiChecked && !areAllAlakooditChecked;
  }

  function getLocalizedKoulutustyyppi(alakoodiKey, alakoodiValue) {
    return l.localize(alakoodiValue) || t(`haku.${alakoodiKey}`);
  }

  return (
    <SuodatinExpansionPanel
      {...(summaryHidden && { className: classes.noBoxShadow })}
      elevation={elevation}
      data-cy="koulutustyyppi-filter"
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedKoulutustyypitStr}
            maxCharLengthBeforeChipWithNumber={16}
            filterName={t('haku.koulutustyyppi')}
            displaySelected={displaySelected}
          />
        </SuodatinExpansionPanelSummary>
      )}
      <SuodatinExpansionPanelDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container>
          <Grid item xs={12} style={{ padding: '20px 0' }}>
            <ButtonGroup fullWidth>
              <Button
                style={{ minWidth: '155px' }}
                className={!isMuuSelected ? classes.buttonActive : classes.buttonInactive}
                classes={{ root: classes.buttonRoot }}
                aria-selected={!isMuuSelected}
                onClick={() => setIsMuuSelected(false)}>
                {t('haku.tutkintoon-johtavat')}
              </Button>
              <Button
                className={isMuuSelected ? classes.buttonActive : classes.buttonInactive}
                classes={{ root: classes.buttonRoot }}
                aria-selected={isMuuSelected}
                onClick={() => setIsMuuSelected(true)}>
                {t('haku.muut')}
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <List style={{ width: '100%' }}>
              {koulutustyyppiOrKoulutusTyyppiMuu.map(
                ([koulutustyyppiKey, koulutustyyppiValue]) => {
                  const labelId = `educationtype-outerlist-label-${koulutustyyppiKey}`;
                  return (
                    <React.Fragment key={`fragment-${koulutustyyppiKey}`}>
                      <ListItem
                        key={koulutustyyppiKey}
                        id={koulutustyyppiKey}
                        dense
                        button
                        onClick={handleKoulutustyyppiClick(koulutustyyppiKey)}>
                        <ListItemIcon>
                          <SuodatinCheckbox
                            indeterminateIcon={<IndeterminateCheckBoxOutlined />}
                            indeterminate={isIndeterminate([
                              koulutustyyppiKey,
                              koulutustyyppiValue,
                            ])}
                            edge="start"
                            checked={checkedKoulutustyypit.some(
                              ({ id }) => id === koulutustyyppiKey
                            )}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemIcon>
                        <SuodatinListItemText
                          id={labelId}
                          primary={
                            <Grid container justify="space-between" wrap="nowrap">
                              <Grid item>{t(`haku.${koulutustyyppiKey}`)}</Grid>
                              <Grid item>{`(${koulutustyyppiValue?.count || 0})`}</Grid>
                            </Grid>
                          }
                        />
                      </ListItem>
                      {_.entries(_.get(koulutustyyppiValue, 'alakoodit')).map(
                        ([alakoodiKey, alakoodiValue]) => {
                          const labelId = `${koulutustyyppiKey}_${alakoodiKey}_label`;
                          return (
                            <ListItem
                              style={{ paddingLeft: theme.spacing(2.2) }}
                              key={`${koulutustyyppiKey}_${alakoodiKey}`}
                              id={`${koulutustyyppiKey}_${alakoodiKey}`}
                              dense
                              button
                              onClick={handleKoulutustyyppiClick(
                                alakoodiKey,
                                koulutustyyppiKey
                              )}>
                              <ListItemIcon>
                                <SuodatinCheckbox
                                  edge="start"
                                  checked={
                                    checkedKoulutustyypit.findIndex(
                                      ({ id }) => id === alakoodiKey
                                    ) !== -1
                                  }
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </ListItemIcon>
                              <SuodatinListItemText
                                id={labelId}
                                primary={
                                  <Grid container justify="space-between" wrap="nowrap">
                                    <Grid item>
                                      {getLocalizedKoulutustyyppi(
                                        alakoodiKey,
                                        alakoodiValue
                                      )}
                                    </Grid>
                                    <Grid item>{`(${alakoodiValue?.count || 0})`}</Grid>
                                  </Grid>
                                }
                              />
                            </ListItem>
                          );
                        }
                      )}
                    </React.Fragment>
                  );
                }
              )}
            </List>
          </Grid>
        </Grid>
      </SuodatinExpansionPanelDetails>
    </SuodatinExpansionPanel>
  );
};

export default KoulutustyyppiSuodatin;
