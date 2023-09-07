import React from 'react';

import { Grid, Typography, ButtonGroup, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

import { useSearchSortOrder } from '../hakutulosHooks';

const PREFIX = 'MobileToggleOrderByButtonMenu';

const classes = {
  buttonActive: `${PREFIX}-buttonActive`,
  buttonInactive: `${PREFIX}-buttonInactive`,
};

const StyledGrid = styled(Grid)(() => ({
  [`& .${classes.buttonActive}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },

  [`& .${classes.buttonInactive}`]: {
    backgroundColor: colors.white,
    color: colors.brandGreen,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const SortOrderButton = ({ isActive, onClick, endIcon, children }) => {
  return (
    <Button
      className={isActive ? classes.buttonActive : classes.buttonInactive}
      onClick={onClick}
      endIcon={endIcon}>
      {children}
    </Button>
  );
};

export const MobileToggleOrderByButtonMenu = () => {
  const { t } = useTranslation();

  const { sort, order, sortOrder, setSortOrder } = useSearchSortOrder();

  const updateSortAndOrder = (newSort, newOrder) => {
    setSortOrder(`${newSort}_${newOrder}`);
  };

  const toggleToNameSort = () => updateSortAndOrder('name', 'asc');

  const toggleNameSortOrder = () =>
    updateSortAndOrder('name', order === 'asc' ? 'desc' : 'asc');

  return (
    <StyledGrid
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
    </StyledGrid>
  );
};
