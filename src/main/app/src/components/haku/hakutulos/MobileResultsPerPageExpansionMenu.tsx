import { Grid, Typography } from '@mui/material';
import { toString, min, max } from 'lodash';
import { useTranslation } from 'react-i18next';

import { SuodatinSlider } from '#/src/components/common/Filter/CustomizedMuiComponents';
import { PAGE_SIZE_OPTIONS } from '#/src/constants';

import { useSearch } from '../hakutulosHooks';

export const MobileResultsPerPageExpansionMenu = () => {
  const { t } = useTranslation();
  const { pagination, setPagination, resetPagination } = useSearch();

  const handleSliderValueChange = (_: unknown, newSize?: number | Array<number>) => {
    resetPagination();
    setPagination({ size: Array.isArray(newSize) ? newSize[0] : newSize });
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ padding: '12px 24px' }}>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" noWrap>
          {t('haku.tuloksia-per-sivu')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm>
        <SuodatinSlider
          value={pagination.size}
          track={false}
          min={min(PAGE_SIZE_OPTIONS)}
          max={max(PAGE_SIZE_OPTIONS)}
          marks={PAGE_SIZE_OPTIONS.map((size) => ({
            value: size,
            label: toString(size),
          }))}
          step={null}
          getAriaValueText={(value) => `${value}`}
          aria-label={t('haku.tuloksia-per-sivu')}
          onChange={handleSliderValueChange}
        />
      </Grid>
    </Grid>
  );
};
