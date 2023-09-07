import React, { useCallback, useState } from 'react';

import { Box, Divider } from '@mui/material';
import { t } from 'i18next';

import { colors } from '#/src/colors';
import { FilterSearchResultsButton } from '#/src/components/common/FilterSearchResultsButton';
import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { RajainName } from '#/src/types/common';

import { MobileRajainDrawer } from '../../common/MobileRajainDrawer';
import { useToteutusRajainOrder } from '../../koulutus/useToteutusRajainOrder';

type Props = {
  koulutustyyppi: string;
  rajainCount: number;
  hitCount: number;
  loading: boolean;
  clearChosenFilters: VoidFunction;
  setFilters: (value: Partial<RajainValues>) => void;
  rajainValues: Partial<RajainValues>;
  rajainOptions: Record<RajainName, any>;
};

export const MobileFiltersOnTopMenu = ({
  koulutustyyppi,
  rajainCount,
  hitCount,
  loading,
  clearChosenFilters,
  setFilters,
  rajainValues,
  rajainOptions,
}: Props) => {
  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(
    () => setShowFilters(!showFilters),
    [showFilters]
  );

  const rajainOrder = useToteutusRajainOrder({ koulutustyyppi });

  return (
    <>
      {!showFilters && (
        <Box marginBottom={1}>
          <FilterSearchResultsButton
            inline={true}
            textColor={colors.brandGreen}
            chosenFilterCount={rajainCount}
            onClick={toggleShowFilters}>
            {t('haku.rajaa-tuloksia')}
          </FilterSearchResultsButton>
        </Box>
      )}
      <MobileRajainDrawer
        isOpen={showFilters}
        toggleOpen={toggleShowFilters}
        showResults={toggleShowFilters}
        clearRajainSelection={clearChosenFilters}
        rajainCount={rajainCount}
        resultCount={hitCount}>
        {rajainOrder.map(({ id, Component, props }) => {
          return (
            <>
              <Component
                key={id}
                expanded={false}
                rajainValues={rajainValues}
                rajainOptions={rajainOptions}
                setFilters={setFilters}
                loading={loading}
                {...props}
              />
              <Divider />
            </>
          );
        })}
      </MobileRajainDrawer>
    </>
  );
};
