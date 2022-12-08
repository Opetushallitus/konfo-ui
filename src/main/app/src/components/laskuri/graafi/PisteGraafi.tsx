import React from 'react';

import { Box } from '@mui/material';
import {
  VictoryGroup,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryAxis,
} from 'victory';

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
        maxDomain={{ y: 10, x: GRAAFI_MAX_YEAR }}
        minDomain={{ y: 4, x: GRAAFI_MIN_YEAR }}
        width={920}>
        <VictoryAxis tickValues={years}></VictoryAxis>
        <VictoryAxis dependentAxis tickValues={[4, 5, 6, 7, 8, 9, 10]}></VictoryAxis>
        <VictoryGroup offset={20}>
          <VictoryBar
            data={data}
            style={{ data: { fill: '#5BCA13' } }}
            labels={labels}></VictoryBar>
          {tulos && (
            <VictoryLine
              style={{
                data: { stroke: '#FFCC33' },
                parent: { border: '3px solid #FFCC33' },
              }}
              data={[
                { x: GRAAFI_MIN_YEAR, y: tulos.keskiarvo },
                { x: GRAAFI_MAX_YEAR, y: tulos.keskiarvo },
              ]}
              labels={[`${tulos.keskiarvo}`]}></VictoryLine>
          )}
        </VictoryGroup>
        <VictoryLegend
          orientation="horizontal"
          gutter={100}
          y={20}
          data={[
            { name: 'sisäänpääsyn alin keskiarvo', symbol: { fill: '#5BCA13' } },
            { name: 'arvioitu keskiarvosi', symbol: { fill: '#FFCC33' } },
          ]}
        />
      </VictoryChart>
    </Box>
  );
};

const PisteGraafiAmmatillinen = ({ hakukohde, tulos }: Props) => {
  const { data, years, labels }: PisteData = usePisteHistoria(hakukohde);

  return (
    <Box>
      <VictoryChart
        maxDomain={{ y: 30, x: GRAAFI_MAX_YEAR }}
        minDomain={{ y: 0, x: GRAAFI_MIN_YEAR }}
        width={920}>
        <VictoryAxis tickValues={years}></VictoryAxis>
        <VictoryAxis dependentAxis tickValues={[0, 5, 10, 15, 20, 25, 30]}></VictoryAxis>
        <VictoryGroup offset={20}>
          <VictoryBar
            data={data}
            style={{ data: { fill: '#5BCA13' } }}
            labels={labels}></VictoryBar>
          {tulos && (
            <VictoryLine
              style={{
                data: { stroke: '#FFCC33' },
                parent: { border: '3px solid #FFCC33' },
              }}
              data={[
                { x: GRAAFI_MIN_YEAR, y: tulos.pisteet + ENSISIJAINEN_SCORE_BONUS },
                { x: GRAAFI_MAX_YEAR, y: tulos.pisteet + ENSISIJAINEN_SCORE_BONUS },
              ]}
              labels={[`${tulos.pisteet}`]}></VictoryLine>
          )}
        </VictoryGroup>
        <VictoryLegend
          orientation="horizontal"
          gutter={100}
          y={20}
          data={[
            { name: 'sisäänpääsyn alin pistemäärä', symbol: { fill: '#5BCA13' } },
            { name: 'arvioitu pistemääräsi', symbol: { fill: '#FFCC33' } },
          ]}
        />
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
