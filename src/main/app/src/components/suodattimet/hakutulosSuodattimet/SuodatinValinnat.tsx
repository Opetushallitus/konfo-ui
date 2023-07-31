import React from 'react';

import { Button, Chip, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { getFilterStateChangesForDelete } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import { RajainBase, RajainItem } from '#/src/types/SuodatinTypes';

type ChosenFiltersProps = {
  filters: Array<RajainItem>;
  getHandleDelete: (entry: RajainItem) => VoidFunction;
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
            data-testid={`chip-${entry.id}`}
            key={`chip_${entry.id}`}
            sx={{
              marginBottom: 1,
              marginRight: 1,
              borderRadius: 2,
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
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
          startIcon={<MaterialIcon icon="clear" />}
          sx={{
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'underline',
            whiteSpace: 'nowrap',
            padding: '1px 5px',
          }}
          onClick={handleClearFilters}>
          {t('haku.poista-valitut-rajaimet')}
        </Button>
      </Grid>
    </Grid>
  );
};

export const SuodatinValinnat = ({
  allSelectedFilters,
  setFilters,
  clearFilters,
}: any) => {
  const { flat, withAlakoodit } = allSelectedFilters;

  const getHandleDelete = (item: RajainBase) => () => {
    const changes = getFilterStateChangesForDelete(withAlakoodit)(item);
    setFilters(changes);
  };

  return (
    <ChipList
      filters={flat}
      getHandleDelete={getHandleDelete}
      handleClearFilters={clearFilters}
    />
  );
};
