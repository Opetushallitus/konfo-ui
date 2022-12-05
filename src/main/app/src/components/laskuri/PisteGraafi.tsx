import React, { useState, useMemo } from 'react';

import { Box } from '@mui/material';
import {
  Datum,
  VictoryGroup,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryAxis,
} from 'victory';

import { Hakukohde, PisteHistoria } from '#/src/types/HakukohdeTypes';

import { HakupisteLaskelma } from './Keskiarvo';

const MAX_YEAR = new Date().getUTCFullYear();
const MIN_YEAR = MAX_YEAR - 4;

type Props = {
  hakukohde: Hakukohde;
  tulos: HakupisteLaskelma | null;
};

export const PisteGraafi = ({ hakukohde, tulos }: Props) => {
  const [data, setData] = useState<Array<Datum>>([]);
  const [years, setYears] = useState<Array<number>>([]);
  const [labels, setLabels] = useState<Array<string>>([]);

  useMemo(() => {
    const dataNew =
      hakukohde?.metadata?.pistehistoria
        ?.filter((historia: PisteHistoria) => Number.parseInt(historia.vuosi) >= MIN_YEAR)
        .map((historia: PisteHistoria) => {
          return { x: Number.parseInt(historia.vuosi), y: historia.pisteet };
        }) || [];
    setData(dataNew);
    setYears(dataNew.map((datum) => datum.x));
    setLabels(dataNew.map((datum) => `${datum.y}`.replace('.', ',')));
  }, [hakukohde]);

  return (
    <Box>
      <VictoryChart
        maxDomain={{ y: 30, x: MAX_YEAR }}
        minDomain={{ y: 0, x: 2017 }}
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
                { x: 2017, y: tulos.pisteet },
                { x: MAX_YEAR, y: tulos.pisteet },
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
