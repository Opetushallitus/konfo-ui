import { createSelector } from '@reduxjs/toolkit';

import { getLanguage } from '#/src/tools/localization';
import { getPaginationPage } from '#/src/tools/utils';

// State data getters
const getPage = (state) =>
  getPaginationPage({
    offset: state.oppilaitos.offset,
    size: state.oppilaitos.size,
  });

const getSize = (state) => state.oppilaitos.size;

const getOffset = (state) => state.oppilaitos.offset;

const getOrder = (state) => state.oppilaitos.order;

const getTulevaPage = (state) =>
  getPaginationPage({
    offset: state.oppilaitos.tulevaOffset,
    size: state.oppilaitos.tulevaSize,
  });

const getTulevaSize = (state) => state.oppilaitos.tulevaSize;

const getTulevaOffset = (state) => state.oppilaitos.tulevaOffset;

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
