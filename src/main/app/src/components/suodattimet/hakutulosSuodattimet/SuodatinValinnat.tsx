import React from 'react';

import { Clear } from '@mui/icons-material';
import { Button, Chip, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { getFilterStateChangesForDelete } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { FilterValue } from '#/src/types/SuodatinTypes';

import { useAllSelectedFilters, useSearch } from '../../haku/hakutulosHooks';

const PREFIX = 'ChipList';

const classes = {
  chipRoot: `${PREFIX}-chipRoot`,
  chipLabel: `${PREFIX}-chipLabel`,
  clearButtonLabel: `${PREFIX}-clearButtonLabel`,
  clearButtonSizeSmall: `${PREFIX}-clearButtonSizeSmall`,
};

const Root = styled('div')(() => ({
  [`& .${classes.chipRoot}`]: {
    marginBottom: 5,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
    border: 'none',
  },

  [`& .${classes.chipLabel}`]: {
    fontSize: 12,
    fontWeight: 600,
  },

  [`& .${classes.clearButtonLabel}`]: {
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'underline',
    whiteSpace: 'nowrap',
  },

  [`& .${classes.clearButtonSizeSmall}`]: {
    padding: '1px 5px',
  },
}));

type ChosenFiltersProps = {
  filters: Array<FilterValue>;
  getHandleDelete: (entry: FilterValue) => VoidFunction;
  handleClearFilters: VoidFunction;
};

export const ChipList = ({
  getHandleDelete,
  handleClearFilters,
  filters,
}: ChosenFiltersProps) => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      wrap="nowrap"
      justifyContent="space-between"
      style={{ paddingBottom: '5px' }}>
      <Grid item style={{ paddingTop: '5px' }}>
        {filters.map((entry) => (
          <Chip
            size="small"
            data-cy={`chip-${entry.id}`}
            key={`chip_${entry.id}`}
            classes={{
              root: classes.chipRoot,
              label: classes.chipLabel,
            }}
            // NOTE: Some filters are not koodisto values and must be translated
            label={localize(entry) || t(`haku.${entry.id}`)}
            onDelete={getHandleDelete(entry)}
          />
        ))}
      </Grid>
      <Grid item>
        <Button
          size="small"
          startIcon={<Clear />}
          classes={{
            text: classes.clearButtonLabel,
            sizeSmall: classes.clearButtonSizeSmall,
          }}
          onClick={handleClearFilters}>
          {t('haku.poista-valitut-rajaimet')}
        </Button>
      </Grid>
    </Grid>
  );
};

export const SuodatinValinnat = () => {
  const { selectedFiltersFlatList, selectedFiltersWithAlakoodit } =
    useAllSelectedFilters();

  const { setFilters, clearFilters } = useSearch();

  const getHandleDelete = (item: FilterValue) => () => {
    const changes = getFilterStateChangesForDelete(selectedFiltersWithAlakoodit)(item);
    setFilters(changes);
  };

  return (
    <Root>
      <ChipList
        filters={selectedFiltersFlatList}
        getHandleDelete={getHandleDelete}
        handleClearFilters={clearFilters}
      />
    </Root>
  );
};
