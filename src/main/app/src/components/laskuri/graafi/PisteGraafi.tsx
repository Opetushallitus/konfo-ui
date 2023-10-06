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
  Datum,
} from 'victory';

import { colors } from '#/src/colors';
import { formatDouble } from '#/src/tools/utils';
import { Hakukohde } from '#/src/types/HakukohdeTypes';

import {
  GRAAFI_MAX_YEAR,
  GRAAFI_MIN_YEAR,
  graafiYearModifier,
  GraafiBoundary,
  PisteData,
  usePisteHistoria,
  getStyleByPistetyyppi,
} from './GraafiUtil';
import { HakupisteLaskelma, ENSISIJAINEN_SCORE_BONUS } from '../Keskiarvo';

type LukiopisteProps = {
  tulos: HakupisteLaskelma;
  years: Array<number>;
};

const Lukiopistelaskelma = ({ tulos, years, ...props }: LukiopisteProps) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <VictoryLine
      {...props}
      style={{
        data: { stroke: colors.sunglow, strokeWidth: 3 },
        labels: { fontSize: isSmall ? 32 : 14 },
      }}
      data={[
        {
          x: GRAAFI_MIN_YEAR + graafiYearModifier(years, GraafiBoundary.MIN),
          y: tulos.keskiarvoPainotettu,
        },
        {
          x: GRAAFI_MAX_YEAR + graafiYearModifier(years, GraafiBoundary.MAX),
          y: tulos.keskiarvoPainotettu,
        },
      ]}
      labels={['', formatDouble(tulos.keskiarvoPainotettu)]}
      labelComponent={<VictoryLabel renderInPortal dx={isSmall ? -25 : -15} />}
    />
  );
};

type Props = {
  hakukohde: Hakukohde;
  tulos: HakupisteLaskelma | null;
  isLukio?: boolean;
  isTodistusvalinta?: boolean;
};

const PisteGraafiKouluarvosanat = ({ hakukohde, tulos }: Props) => {
  const data: Array<PisteData> = usePisteHistoria(hakukohde);
  const years = data.map((datum) => datum.vuosi);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const DEFAULT_MAX = 10;

  const maxY = (datas: Array<Datum>): number => {
    const highestScore = datas.map((datum) => datum.pisteet).sort((a, b) => b - a)[0];
    return Math.max(DEFAULT_MAX, highestScore);
  };

  return (
    <Box aria-hidden={true}>
      <VictoryChart
        maxDomain={{
          y: maxY(data),
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
          tickValues={[4, 6, 8, maxY(data)]}
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
              data: { fill: ({ datum }) => getStyleByPistetyyppi(datum.pistetyyppi) },
              labels: { fontSize: isSmall ? 32 : 14 },
            }}
            barWidth={isSmall ? 74 : 52}
            labels={data.map((datum) => datum.pisteetLabel)}
            x="vuosi"
            y="pisteet"
          />
          {tulos && <Lukiopistelaskelma tulos={tulos} years={years} />}
        </VictoryGroup>
      </VictoryChart>
    </Box>
  );
};

const PisteGraafiAmmatillinenJaPaasykoe = ({ hakukohde, tulos, isLukio }: Props) => {
  const data: Array<PisteData> = usePisteHistoria(hakukohde);
  const years = data.map((datum) => datum.vuosi);
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
              data: { fill: ({ datum }) => getStyleByPistetyyppi(datum.pistetyyppi) },
              labels: { fontSize: isSmall ? 32 : 14 },
            }}
            barWidth={52}
            labels={data.map((datum) => datum.pisteetLabel)}
            x="vuosi"
            y="pisteet"
          />
          {tulos &&
            (isLukio ? (
              <Lukiopistelaskelma tulos={tulos} years={years} />
            ) : (
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
                labels={['', `${tulos.pisteet + ENSISIJAINEN_SCORE_BONUS}`]}
                labelComponent={<VictoryLabel renderInPortal dx={isSmall ? -25 : -15} />}
              />
            ))}
        </VictoryGroup>
      </VictoryChart>
    </Box>
  );
};

export const PisteGraafi = ({ hakukohde, tulos, isLukio, isTodistusvalinta }: Props) => {
  return isLukio && isTodistusvalinta ? (
    <PisteGraafiKouluarvosanat hakukohde={hakukohde} tulos={tulos} />
  ) : (
    <PisteGraafiAmmatillinenJaPaasykoe
      hakukohde={hakukohde}
      tulos={tulos}
      isLukio={isLukio}
    />
  );
};
