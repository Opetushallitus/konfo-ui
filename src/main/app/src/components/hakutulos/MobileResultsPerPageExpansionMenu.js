import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { SuodatinMobileSlider } from '#/src/components/common/Filter/CustomizedMuiComponents';
import { pageSizeArray } from '#/src/constants';
import { clearPaging, setSize } from '#/src/store/reducers/hakutulosSlice';

export const MobileResultsPerPageExpansionMenu = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { size } = useSelector(
    (state) => ({
      size: state.hakutulos.size,
    }),
    shallowEqual
  );
  const marks = pageSizeArray.map((_size) => ({
    value: _size,
    label: _.toString(_size),
  }));

  const valueText = (value) => value;

  const handleSliderValueChange = (e, newSize) => {
    dispatch(clearPaging());
    dispatch(setSize({ newSize }));
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      style={{ padding: '12px 24px' }}>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" noWrap>
          {t('haku.tuloksia-per-sivu')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm>
        <SuodatinMobileSlider
          defaultValue={size}
          track={false}
          min={_.min(pageSizeArray)}
          max={_.max(pageSizeArray)}
          marks={marks}
          step={null}
          getAriaValueText={valueText}
          aria-label={t('haku.tuloksia-per-sivu')}
          onChange={handleSliderValueChange}
        />
      </Grid>
    </Grid>
  );
};
