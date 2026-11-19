import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '#/src/store';
import { getLanguage } from '#/src/tools/localization';
import { getPaginationPage } from '#/src/tools/utils';

// State data getters
const getPage = (state: RootState) =>
  getPaginationPage({
    offset: state.oppilaitos.offset,
    size: state.oppilaitos.size,
  });

const getSize = (state: RootState) => state.oppilaitos.size;

const getOffset = (state: RootState) => state.oppilaitos.offset;

const getOrder = (state: RootState) => state.oppilaitos.order;

const getTulevaPage = (state: RootState) =>
  getPaginationPage({
    offset: state.oppilaitos.tulevaOffset,
    size: state.oppilaitos.tulevaSize,
  });

const getTulevaSize = (state: RootState) => state.oppilaitos.tulevaSize;

const getTulevaOffset = (state: RootState) => state.oppilaitos.tulevaOffset;

export const getTarjontaPaginationProps = createSelector(
  [getPage, getSize, getOrder, getOffset],
  (page, size, order, offset) => ({
    page,
    size,
    order,
    offset,
  })
);

export const getTulevaTarjontaPaginationProps = createSelector(
  [getTulevaPage, getTulevaSize, getOrder, getTulevaOffset],
  (page, size, order, offset) => ({
    page,
    size,
    order,
    offset,
    lng: getLanguage(),
  })
);

export const getTarjontaRajainValues = (state: RootState) =>
  state.oppilaitos.rajainValues;
