import React from 'react';

import { Grid, Typography } from '@mui/material';
import { toString, min, max } from 'lodash';
import { useTranslation } from 'react-i18next';

import { SuodatinSlider } from '#/src/components/common/Filter/CustomizedMuiComponents';
import { PAGE_SIZE_OPTIONS } from '#/src/constants';

import { useSearch } from '../hakutulosHooks';

export const MobileResultsPerPageExpansionMenu = () => {
  const { t } = useTranslation();
  const { pagination, setPagination, resetPagination } = useSearch();
  const size = pagination.size;
  const marks = PAGE_SIZE_OPTIONS.map((_size) => ({
    value: _size,
    label: toString(_size),
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
        <SuodatinSlider
          value={size}
          track={false}
          min={min(PAGE_SIZE_OPTIONS)}
          max={max(PAGE_SIZE_OPTIONS)}
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
