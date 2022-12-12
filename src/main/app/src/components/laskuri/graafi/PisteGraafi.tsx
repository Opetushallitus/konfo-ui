import React from 'react';

import { Box } from '@mui/material';
import {
  VictoryGroup,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from 'victory';

import { colors } from '#/src/colors';
import { Hakukohde } from '#/src/types/HakukohdeTypes';

import { HakupisteLaskelma, ENSISIJAINEN_SCORE_BONUS } from '../Keskiarvo';
import {
  GRAAFI_MAX_YEAR,
  GRAAFI_MIN_YEAR,
  usePisteHistoria,
  PisteData,
} from './GraafiUtil';

type Props = {
  hakukohde: Hakukohde;
  tulos: HakupisteLaskelma | null;
  isLukio?: boolean;
};

const PisteGraafiLukio = ({ hakukohde, tulos }: Props) => {
  const { data, years, labels }: PisteData = usePisteHistoria(hakukohde);

  return (
    <Box>
      <VictoryChart
        maxDomain={{ y: 10, x: GRAAFI_MAX_YEAR + 1 }}
        minDomain={{ y: 4, x: GRAAFI_MIN_YEAR }}
        width={920}
        theme={VictoryTheme.material}>
        <VictoryAxis
          tickValues={years}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { stroke: colors.invisible },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={[4, 6, 8, 10]}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { strokeWidth: '3', strokeDasharray: '' },
          }}
        />
        <VictoryGroup>
          <VictoryBar
            data={data}
            style={{ data: { fill: colors.verminal } }}
            barWidth={52}
            labels={labels}></VictoryBar>
          {tulos && (
            <VictoryLine
              style={{
                data: { stroke: colors.sunglow, strokeWidth: 3 },
              }}
              data={[
                { x: GRAAFI_MIN_YEAR, y: tulos.keskiarvo },
                { x: GRAAFI_MAX_YEAR + 1, y: tulos.keskiarvo },
              ]}
              labels={[`${tulos.keskiarvo}`]}
              labelComponent={<VictoryLabel renderInPortal dx={15} />}></VictoryLine>
          )}
        </VictoryGroup>
      </VictoryChart>
    </Box>
  );
};

const PisteGraafiAmmatillinen = ({ hakukohde, tulos }: Props) => {
  const { data, years, labels }: PisteData = usePisteHistoria(hakukohde);

  return (
    <Box>
      <VictoryChart
        maxDomain={{ y: 32, x: GRAAFI_MAX_YEAR + 1 }}
        minDomain={{ y: 0, x: GRAAFI_MIN_YEAR }}
        width={920}
        theme={VictoryTheme.material}>
        <VictoryAxis
          tickValues={years}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { stroke: colors.invisible },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={[0, 8, 16, 24, 32]}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { strokeWidth: '3', strokeDasharray: '' },
          }}
        />
        <VictoryGroup>
          <VictoryBar
            data={data}
            style={{ data: { fill: colors.verminal } }}
            barWidth={52}
            labels={labels}></VictoryBar>
          {tulos && (
            <VictoryLine
              style={{
                data: { stroke: colors.sunglow, strokeWidth: 3 },
              }}
              data={[
                { x: GRAAFI_MIN_YEAR, y: tulos.pisteet + ENSISIJAINEN_SCORE_BONUS },
                { x: GRAAFI_MAX_YEAR + 1, y: tulos.pisteet + ENSISIJAINEN_SCORE_BONUS },
              ]}
              labels={[`${tulos.pisteet + ENSISIJAINEN_SCORE_BONUS}`]}
              labelComponent={<VictoryLabel renderInPortal dx={15} />}></VictoryLine>
          )}
        </VictoryGroup>
      </VictoryChart>
    </Box>
  );
};

export const PisteGraafi = ({ hakukohde, tulos, isLukio }: Props) => {
  return isLukio ? (
    <PisteGraafiLukio hakukohde={hakukohde} tulos={tulos} />
  ) : (
    <PisteGraafiAmmatillinen hakukohde={hakukohde} tulos={tulos} />
  );
};
