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

const MAX_YEAR = new Date().getUTCFullYear();

console.log(MAX_YEAR);

export const PisteGraafi = () => {
  const DATA = [
    { x: 2018, y: 7.55 },
    { x: 2019, y: 6.43 },
    { x: 2020, y: 8.44 },
    { x: 2021, y: 7.94 },
    { x: 2022, y: 6.75 },
  ];
  const LABELS = DATA.map((data) => `${data.y}`.replace('.', ','));
  return (
    <Box>
      <VictoryChart
        maxDomain={{ y: 10, x: MAX_YEAR }}
        minDomain={{ y: 4, x: 2017 }}
        width={920}>
        <VictoryAxis tickValues={[2018, 2019, 2020, 2021, 2022]}></VictoryAxis>
        <VictoryAxis dependentAxis tickValues={[4, 5, 6, 7, 8, 9, 10]}></VictoryAxis>
        <VictoryGroup offset={20}>
          <VictoryBar
            data={[
              { x: 2018, y: 7.55 },
              { x: 2019, y: 6.43 },
              { x: 2020, y: 8.44 },
              { x: 2021, y: 7.94 },
              { x: 2022, y: 6.75 },
            ]}
            style={{ data: { fill: '#5BCA13' } }}
            labels={LABELS}></VictoryBar>
          <VictoryLine
            style={{
              data: { stroke: '#FFCC33' },
              parent: { border: '3px solid #FFCC33' },
            }}
            data={[
              { x: 2017, y: 7 },
              { x: 2022, y: 7 },
            ]}></VictoryLine>
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
