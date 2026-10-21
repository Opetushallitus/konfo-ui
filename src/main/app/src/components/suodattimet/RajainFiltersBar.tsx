import React, { useState } from 'react';

import { Grid, Hidden } from '@mui/material';
import { size } from 'lodash';
import { match } from 'ts-pattern';

import { RajainValues } from '#/src/store/reducers/hakutulosSlice';
import { RajainName, TODOType } from '#/src/types/common';
import { RajainOrderItem, SetRajainValues } from '#/src/types/SuodatinTypes';

import { useSelectedFilters } from '../haku/hakutulosHooks';
import { SuodatinValinnat } from './hakutulosSuodattimet/SuodatinValinnat';
import { MobileFiltersOnTopMenu } from './toteutusSuodattimet/MobileFiltersOnTopMenu';

const SuodatinGridItem: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Grid item sx={{ minWidth: '250px' }} xs={6} lg={4}>
      {children}
    </Grid>
  );
};

const getRajainProps = ({
  id,
  setPreventClicks,
}: {
  id: string;
  setPreventClicks: React.Dispatch<React.SetStateAction<boolean>>;
}) =>
  match(id)
    .with('sijainti', () => ({
      onFocus: () => setPreventClicks(true),
      onHide: () => setPreventClicks(false),
    }))
    .otherwise(() => ({}));

type Props = {
  rajainOrder: Array<RajainOrderItem>;
  rajainOptions: Record<RajainName, TODOType>;
  rajainValues: Partial<RajainValues>;
  setRajainValues: SetRajainValues;
  clearRajainValues: () => void;
  allSelectedFilters: ReturnType<typeof useSelectedFilters>;
  loading: boolean;
  hitCount: number;
};

export const RajainFiltersBar = ({
  rajainOrder,
  rajainOptions,
  rajainValues,
  setRajainValues,
  clearRajainValues,
  allSelectedFilters,
  loading,
  hitCount,
}: Props) => {
  const [preventClicks, setPreventClicks] = useState(false);

  const someSelected = allSelectedFilters.flat.length > 0;

  return (
    <>
      <Hidden mdDown>
        {someSelected && (
          <div>
            <SuodatinValinnat
              allSelectedFilters={allSelectedFilters}
              setRajainValues={setRajainValues}
              clearRajainValues={clearRajainValues}
            />
          </div>
        )}
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          mb={2}
          spacing={2}
          sm={10}>
          {rajainOrder.map(({ Component, props, id }) => {
            const customProps = getRajainProps({ id, setPreventClicks });
            return (
              <SuodatinGridItem key={id}>
                <Component
                  elevation={2}
                  rajainOptions={rajainOptions}
                  rajainValues={rajainValues}
                  setRajainValues={setRajainValues}
                  loading={loading}
                  {...props}
                  {...customProps}
                />
              </SuodatinGridItem>
            );
          })}
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <MobileFiltersOnTopMenu
          rajainOrder={rajainOrder}
          rajainCount={size(allSelectedFilters?.flat)}
          loading={loading}
          hitCount={hitCount}
          clearFilterValues={clearRajainValues}
          setRajainValues={setRajainValues}
          rajainValues={rajainValues}
          rajainOptions={rajainOptions}
        />
      </Hidden>
      <div
        id="prevent-clicks"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          opacity: 0.5,
          zIndex: 1,
          display: preventClicks ? 'block' : 'none',
        }}
        onClick={(e) => {
          setPreventClicks(false);
          e.stopPropagation();
        }}></div>
    </>
  );
};
