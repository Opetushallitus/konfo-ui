import React from 'react';

import { Grid, Typography, ButtonGroup, Button, makeStyles } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { colors } from '#/src/colors';
import { setSort, setOrder } from '#/src/store/reducers/hakutulosSlice';
import { getMobileToggleOrderByButtonMenuProps } from '#/src/store/reducers/hakutulosSliceSelector';

const useStyles = makeStyles(() => ({
  buttonActive: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.brandGreen,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const MobileToggleOrderByButtonMenu = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mobileToggleOrderByButtonMenuProps = useSelector(
    getMobileToggleOrderByButtonMenuProps
  );
  const { isNameSort, isNameSortDesc, isScoreSort, order } =
    mobileToggleOrderByButtonMenuProps;

  const updateSortAndOrder = (newSort, newOrder) => {
    dispatch(setSort({ newSort }));
    dispatch(setOrder({ newOrder }));
  };

  const toggleToScoreSort = () => {
    if (!isScoreSort) {
      updateSortAndOrder('score', 'desc');
    }
  };

  const toggleToNameSort = () => updateSortAndOrder('name', 'asc');

  const toggleNameSortOrder = () =>
    updateSortAndOrder('name', order !== 'asc' ? 'asc' : 'desc');

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      style={{ padding: '12px 24px' }}>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" noWrap>
          {t('haku.jarjestys')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm style={{ padding: '20px 0' }}>
        <ButtonGroup fullWidth>
          <Button
            className={isScoreSort ? classes.buttonActive : classes.buttonInactive}
            onClick={toggleToScoreSort}>
            {t('haku.jarjesta_mobiili_osuvin')}
          </Button>
          <Button
            className={isNameSort ? classes.buttonActive : classes.buttonInactive}
            onClick={isNameSort ? toggleNameSortOrder : toggleToNameSort}
            endIcon={isNameSortDesc ? <ExpandLess /> : <ExpandMore />}>
            {isNameSortDesc
              ? t('haku.jarjesta_mobiili_aakkoset_o_a')
              : t('haku.jarjesta_mobiili_aakkoset_a_o')}
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default MobileToggleOrderByButtonMenu;
