import React, { useState, useMemo } from 'react';

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
  Typography,
  Input,
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
  aine: Kouluaine;
  updateKouluaine: (kouluaine: Kouluaine) => void;
};

const MAX_VALINNAISET_ARVOSANAT = 3;
const ARVOSANA_VALUES = _.range(4, 11);

export const KouluaineInput = ({ aine, updateKouluaine }: Props) => {
  const [kouluaine, setKouluaine] = useState<Kouluaine>({
    nimi: aine.nimi,
    arvosana: aine.arvosana,
    valinnaisetArvosanat: aine.valinnaisetArvosanat,
    painokerroin: aine.painokerroin,
  });

  const [showPainokerroin, setShowPainokerroin] = useState<boolean>(false);

  useMemo(() => {
    if (!_.isEqual(kouluaine, aine)) {
      setKouluaine(aine);
      setShowPainokerroin(aine.painokerroin !== '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aine]);

  const labelId = `aine-label-${aine}`;

  const handleArvosanaChange = (event: SelectChangeEvent) => {
    const uusiaine = Object.assign({}, kouluaine, {
      arvosana: Number(event.target.value),
    });
    setKouluaine(uusiaine);
    updateKouluaine(uusiaine);
  };

  const handleValinnainenArvosanaChange = (event: SelectChangeEvent, index: number) => {
    const valinnaisetArvosanat = kouluaine.valinnaisetArvosanat;
    valinnaisetArvosanat[index] = Number(event.target.value);
    const uusiaine = Object.assign({}, kouluaine, { valinnaisetArvosanat });
    setKouluaine(uusiaine);
    updateKouluaine(uusiaine);
  };

  const addValinnaisaine = () => {
    const valinnaisetArvosanat = kouluaine.valinnaisetArvosanat;
    valinnaisetArvosanat.push(null);
    setKouluaine(Object.assign({}, kouluaine, { valinnaisetArvosanat }));
  };

  const removeValinnaisaine = (index: number) => {
    const valinnaisetArvosanat = kouluaine.valinnaisetArvosanat;
    valinnaisetArvosanat.splice(index, 1);
    const uusiaine = Object.assign({}, kouluaine, { valinnaisetArvosanat });
    setKouluaine(uusiaine);
    updateKouluaine(uusiaine);
  };

  const changePainokerroin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uusiaine = Object.assign({}, kouluaine, { painokerroin: event.target.value });
    setKouluaine(uusiaine);
    updateKouluaine(uusiaine);
  };

  const poistaPainokerroin = () => {
    setShowPainokerroin(false);
    const uusiaine = Object.assign({}, kouluaine, { painokerroin: '' });
    setKouluaine(uusiaine);
    updateKouluaine(uusiaine);
  };

  return (
    <AineContainer>
      <FormControl variant="standard" sx={{ minWidth: 150 }}>
        <InputLabel id={labelId}>{aine.nimi}</InputLabel>
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
            <InputLabel id={`${labelId}-${index}`}>
              Valinnaisaine: {kouluaine.nimi}
            </InputLabel>
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
      {kouluaine.valinnaisetArvosanat.length < MAX_VALINNAISET_ARVOSANAT && (
        <Button onClick={addValinnaisaine}>+ Lisää valinnaisaine</Button>
      )}
      {!showPainokerroin && (
        <Button onClick={() => setShowPainokerroin(true)}>+ Lisää painokerroin</Button>
      )}
      {showPainokerroin && (
        <>
          <InputLabel>
            <Typography sx={{ fontWeight: 'bold' }}>Painokerroin</Typography>
            <Input
              className={classes.input}
              onChange={changePainokerroin}
              value={kouluaine.painokerroin}
              disableUnderline={true}></Input>
          </InputLabel>
          <IconButton onClick={poistaPainokerroin}>
            <DeleteOutlined />
          </IconButton>
        </>
      )}
    </AineContainer>
  );
};
