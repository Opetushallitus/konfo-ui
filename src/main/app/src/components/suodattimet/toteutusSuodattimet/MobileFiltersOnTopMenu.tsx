import React, { useCallback, useState } from 'react';

import { Box, Divider } from '@mui/material';
import { t } from 'i18next';

import { colors } from '#/src/colors';
import { FilterSearchResultsButton } from '#/src/components/common/FilterSearchResultsButton';
import { MobileRajainDrawer } from '#/src/components/common/MobileRajainDrawer';
import { useToteutusRajainOrder } from '#/src/hooks/useToteutusRajainOrder';
import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { RajainName } from '#/src/types/common';
import { SetRajainValues } from '#/src/types/SuodatinTypes';

type Props = {
  koulutustyyppi?: string;
  rajainCount: number;
  hitCount: number;
  loading: boolean;
  clearFilterValues: () => void;
  setRajainValues: SetRajainValues;
  rajainValues: Partial<RajainValues>;
  rajainOptions: Record<RajainName, any>;
};

export const MobileFiltersOnTopMenu = ({
  koulutustyyppi,
  rajainCount,
  hitCount,
  loading,
  clearFilterValues,
  setRajainValues,
  rajainValues,
  rajainOptions,
}: Props) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const onToggleDrawer = useCallback(() => setDrawerOpen(!isDrawerOpen), [isDrawerOpen]);

  const rajainOrder = useToteutusRajainOrder({ koulutustyyppi });

  return (
    <>
      {!isDrawerOpen && (
        <Box marginBottom={1}>
          <FilterSearchResultsButton
            inline={true}
            textColor={colors.brandGreen}
            selectedRajainCount={rajainCount}
            onClick={onToggleDrawer}>
            {t('haku.rajaa-tuloksia')}
          </FilterSearchResultsButton>
        </Box>
      )}
      <MobileRajainDrawer
        isOpen={isDrawerOpen}
        toggleOpen={onToggleDrawer}
        showResults={onToggleDrawer}
        clearRajainValues={clearFilterValues}
        rajainCount={rajainCount}
        resultCount={hitCount}>
        {rajainOrder.map(({ id, Component, props }) => {
          return (
            <React.Fragment key={id}>
              <Component
                key={id}
                expanded={false}
                rajainValues={rajainValues}
                rajainOptions={rajainOptions}
                setRajainValues={setRajainValues}
                loading={loading}
                {...props}
              />
              <Divider />
            </React.Fragment>
          );
        })}
      </MobileRajainDrawer>
    </>
  );
};
