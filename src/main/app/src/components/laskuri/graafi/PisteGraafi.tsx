import React from 'react';

import { Box, useTheme, useMediaQuery } from '@mui/material';
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
import { formatDouble } from '#/src/tools/utils';
import { Hakukohde } from '#/src/types/HakukohdeTypes';

import { HakupisteLaskelma, ENSISIJAINEN_SCORE_BONUS } from '../Keskiarvo';
import {
  GRAAFI_MAX_YEAR,
  GRAAFI_MIN_YEAR,
  usePisteHistoria,
  PisteData,
  graafiYearModifier,
  GraafiBoundary,
} from './GraafiUtil';

type Props = {
  hakukohde: Hakukohde;
  tulos: HakupisteLaskelma | null;
  isLukio?: boolean;
};

const PisteGraafiLukio = ({ hakukohde, tulos }: Props) => {
  const { data, years, labels }: PisteData = usePisteHistoria(hakukohde);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box aria-hidden={true}>
      <VictoryChart
        maxDomain={{
          y: 10,
          x: GRAAFI_MAX_YEAR + graafiYearModifier(years, GraafiBoundary.MAX),
        }}
        minDomain={{
          y: 4,
          x: GRAAFI_MIN_YEAR + graafiYearModifier(years, GraafiBoundary.MIN),
        }}
        width={920}
        theme={VictoryTheme.material}>
        <VictoryAxis
          tickValues={years}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { stroke: colors.invisible },
            tickLabels: { fontSize: isSmall ? 32 : 14 },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={[4, 6, 8, 10]}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { strokeWidth: '3', strokeDasharray: '' },
            tickLabels: { fontSize: isSmall ? 32 : 14 },
          }}
        />
        <VictoryGroup>
          <VictoryBar
            data={data}
            style={{
              data: { fill: colors.verminal },
              labels: { fontSize: isSmall ? 32 : 14 },
            }}
            barWidth={isSmall ? 74 : 52}
            labels={labels}
          />
          {tulos && (
            <VictoryLine
              style={{
                data: { stroke: colors.sunglow, strokeWidth: 3 },
                labels: { fontSize: isSmall ? 32 : 14 },
              }}
              data={[
                {
                  x: GRAAFI_MIN_YEAR + graafiYearModifier(years, GraafiBoundary.MIN),
                  y: tulos.keskiarvo,
                },
                {
                  x: GRAAFI_MAX_YEAR + graafiYearModifier(years, GraafiBoundary.MAX),
                  y: tulos.keskiarvo,
                },
              ]}
              labels={[formatDouble(tulos.keskiarvo)]}
              labelComponent={<VictoryLabel renderInPortal dx={isSmall ? 25 : 15} />}
            />
          )}
        </VictoryGroup>
      </VictoryChart>
    </Box>
  );
};

const PisteGraafiAmmatillinen = ({ hakukohde, tulos }: Props) => {
  const { data, years, labels }: PisteData = usePisteHistoria(hakukohde);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box aria-hidden={true}>
      <VictoryChart
        maxDomain={{
          y: 32,
          x: GRAAFI_MAX_YEAR + graafiYearModifier(years, GraafiBoundary.MAX),
        }}
        minDomain={{
          y: 0,
          x: GRAAFI_MIN_YEAR + graafiYearModifier(years, GraafiBoundary.MIN),
        }}
        width={920}
        theme={VictoryTheme.material}>
        <VictoryAxis
          tickValues={years}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { stroke: colors.invisible },
            tickLabels: { fontSize: isSmall ? 32 : 14 },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={[0, 8, 16, 24, 32]}
          style={{
            axis: { stroke: colors.invisible },
            ticks: { stroke: colors.invisible },
            grid: { strokeWidth: '3', strokeDasharray: '' },
            tickLabels: { fontSize: isSmall ? 32 : 14 },
          }}
        />
        <VictoryGroup>
          <VictoryBar
            data={data}
            style={{
              data: { fill: colors.verminal },
              labels: { fontSize: isSmall ? 32 : 14 },
            }}
            barWidth={52}
            labels={labels}
          />
          {tulos && (
            <VictoryLine
              style={{
                data: { stroke: colors.sunglow, strokeWidth: 3 },
                labels: { fontSize: isSmall ? 32 : 14 },
              }}
              data={[
                {
                  x: GRAAFI_MIN_YEAR + graafiYearModifier(years, GraafiBoundary.MIN),
                  y: tulos.pisteet + ENSISIJAINEN_SCORE_BONUS,
                },
                {
                  x: GRAAFI_MAX_YEAR + graafiYearModifier(years, GraafiBoundary.MAX),
                  y: tulos.pisteet + ENSISIJAINEN_SCORE_BONUS,
                },
              ]}
              labels={[`${tulos.pisteet + ENSISIJAINEN_SCORE_BONUS}`]}
              labelComponent={<VictoryLabel renderInPortal dx={isSmall ? 25 : 15} />}
            />
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
