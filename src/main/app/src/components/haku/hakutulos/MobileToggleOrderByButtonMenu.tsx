import { Grid, Typography, ButtonGroup, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { HakutulosSlice } from '#/src/store/reducers/hakutulosSlice';
import { styled } from '#/src/theme';

import { useSearchSortOrder } from '../hakutulosHooks';

const SortOrderButton = styled(Button)<{ isActive: boolean }>(({ isActive }) => ({
  backgroundColor: colors.white,
  color: colors.brandGreen,
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  ...(isActive
    ? {
        backgroundColor: colors.brandGreen,
        color: colors.white,
        '&:hover': {
          backgroundColor: colors.brandGreen,
        },
      }
    : {}),
}));

export const MobileToggleOrderByButtonMenu = () => {
  const { t } = useTranslation();

  const { sort, order, sortOrder, setSortOrder } = useSearchSortOrder();

  const updateSortAndOrder = (
    newSort: HakutulosSlice['sort'],
    newOrder: HakutulosSlice['order']
  ) => {
    setSortOrder(`${newSort}_${newOrder}`);
  };

  const toggleToNameSort = () => updateSortAndOrder('name', 'asc');

  const toggleNameSortOrder = () =>
    updateSortAndOrder('name', order === 'asc' ? 'desc' : 'asc');

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
          <SortOrderButton
            isActive={sort === 'score'}
            onClick={() => updateSortAndOrder('score', 'asc')}>
            {t('haku.jarjesta_mobiili_osuvin')}
          </SortOrderButton>
          <SortOrderButton
            isActive={sort === 'name'}
            onClick={sort === 'name' ? toggleNameSortOrder : toggleToNameSort}
            endIcon={
              <MaterialIcon
                icon={sortOrder === 'name_desc' ? 'expand_less' : 'expand_more'}
              />
            }>
            {sortOrder === 'name_desc'
              ? t('haku.jarjesta_mobiili_aakkoset_o_a')
              : t('haku.jarjesta_mobiili_aakkoset_a_o')}
          </SortOrderButton>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};
