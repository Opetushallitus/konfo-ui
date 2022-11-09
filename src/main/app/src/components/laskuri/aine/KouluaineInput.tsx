import React, { useState } from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  Box,
  styled,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Button,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import _ from 'lodash';
import { colors } from 'src/colors';

import { Kouluaine } from './Kouluaine';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
};

const AineContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
  },
  [`& .${classes.error}`]: {
    color: colors.red,
    maxWidth: '60%',
  },
}));

type Props = {
  aine: string;
};

const ARVOSANA_VALUES = _.range(4, 11);

export const KouluaineInput = ({ aine }: Props) => {
  const [kouluaine, setKouluaine] = useState<Kouluaine>({
    nimi: aine,
    arvosana: null,
    valinnaisetArvosanat: [],
    painoarvo: null,
  });

  const labelId = `aine-label-${aine}`;

  const handleArvosanaChange = (event: SelectChangeEvent) => {
    setKouluaine(Object.assign({}, kouluaine, { arvosana: Number(event.target.value) }));
  };

  const handleValinnainenArvosanaChange = (event: SelectChangeEvent, index: number) => {
    const valinnaisetArvosanat = kouluaine.valinnaisetArvosanat;
    valinnaisetArvosanat[index] = Number(event.target.value);
    setKouluaine(Object.assign({}, kouluaine, { valinnaisetArvosanat }));
  };

  const addValinnaisaine = () => {
    const valinnaisetArvosanat = kouluaine.valinnaisetArvosanat;
    valinnaisetArvosanat.push(null);
    setKouluaine(Object.assign({}, kouluaine, { valinnaisetArvosanat }));
  };

  const removeValinnaisaine = (index: number) => {
    const valinnaisetArvosanat = kouluaine.valinnaisetArvosanat;
    valinnaisetArvosanat.splice(index, 1);
    setKouluaine(Object.assign({}, kouluaine, { valinnaisetArvosanat }));
  };

  return (
    <AineContainer>
      <FormControl variant="standard" sx={{ minWidth: 150 }}>
        <InputLabel id={labelId}>{aine}</InputLabel>
        <Select
          labelId={labelId}
          value={String(kouluaine.arvosana)}
          onChange={handleArvosanaChange}>
          {ARVOSANA_VALUES.map((arvosana: number, index: number) => (
            <MenuItem key={`arvosana-${index}`} value={arvosana}>
              {arvosana}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {kouluaine.valinnaisetArvosanat.map(
        (valinnainenArvosana: number | null, index: number) => (
          <FormControl
            variant="standard"
            sx={{ minWidth: 150 }}
            key={`valinnainen-${index}`}>
            <InputLabel id={`${labelId}-${index}`}>Valinnaisaine: {aine}</InputLabel>
            <Select
              labelId={`${labelId}-${index}`}
              value={String(valinnainenArvosana)}
              onChange={(event: SelectChangeEvent) =>
                handleValinnainenArvosanaChange(event, index)
              }>
              {ARVOSANA_VALUES.map((arvosana: number, id: number) => (
                <MenuItem key={`arvosana-${index}-${id}`} value={arvosana}>
                  {arvosana}
                </MenuItem>
              ))}
            </Select>
            <IconButton onClick={() => removeValinnaisaine(index)}>
              <DeleteOutlined />
            </IconButton>
          </FormControl>
        )
      )}
      {kouluaine.valinnaisetArvosanat.length < 2 && (
        <Button onClick={addValinnaisaine}>+ Lisää valinnaisaine</Button>
      )}
      <Button>+ Lisää painokerroin</Button>
    </AineContainer>
  );
};
