import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { SuodatinMobileSlider } from '#/src/components/common/Filter/CustomizedMuiComponents';
import { pageSizeArray } from '#/src/constants';

import { useSearch } from '../hakutulosHooks';

export const MobileResultsPerPageExpansionMenu = () => {
  const { t } = useTranslation();
  const { pagination, setPagination, resetPagination } = useSearch();
  const size = pagination.size;
  const marks = pageSizeArray.map((_size) => ({
    value: _size,
    label: _.toString(_size),
  }));

  const handleSliderValueChange = (e, newSize) => {
    resetPagination();
    setPagination({ size: newSize });
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
          value={size}
          track={false}
          min={_.min(pageSizeArray)}
          max={_.max(pageSizeArray)}
          marks={marks}
          step={null}
          getAriaValueText={(value) => value}
          aria-label={t('haku.tuloksia-per-sivu')}
          onChange={handleSliderValueChange}
        />
      </Grid>
    </Grid>
  );
};
