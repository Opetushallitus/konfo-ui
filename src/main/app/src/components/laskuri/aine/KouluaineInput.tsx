import React, { useState, useEffect } from 'react';

import { Box, styled, SelectChangeEvent } from '@mui/material';

import { PainokerroinInput } from '#/src/components/laskuri/aine/PainokerroinInput';
import { ValinnaisetArvosanat } from '#/src/components/laskuri/aine/ValinnaisetArvosanat';

import { Kouluaine, Kieliaine } from './Kouluaine';
import { KouluaineSelect } from './KouluaineSelect';

const AineContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '27px',
  columnGap: '18px',
  alignItems: 'start',
  button: {
    fontSize: '1rem',
    alignSelf: 'start',
    fontWeight: 600,
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'start',
    button: {
      alignSelf: 'start',
      paddingLeft: 0,
    },
  },
}));

type Props = {
  aine: Kouluaine;
  updateKouluaine: (kouluaine: Kouluaine) => void;
  isLisaKieli?: boolean;
  removeLisaKieli?: () => void;
  embedded: boolean;
};

export const KouluaineInput = ({
  aine,
  updateKouluaine,
  isLisaKieli = false,
  removeLisaKieli = () => {},
  embedded,
}: Props) => {
  const [kouluaine, setKouluaine] = useState<Kouluaine | Kieliaine>({ ...aine });

  useEffect(() => {
    setKouluaine(aine);
  }, [aine]);

  const labelId = `aine-label-${aine.nimi}`;

  const handleArvosanaChange = (arvosana: number) => {
    const uusiaine = Object.assign({}, kouluaine, { arvosana });
    setKouluaine(uusiaine);
    updateKouluaine(uusiaine);
  };

  const handleKieliChange = (kieliKoodi: string) => {
    const uusiaine = Object.assign({}, kouluaine, { kieliKoodi });
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

  const updatePainokerroin = (painokerroin: string) => {
    const uusiaine = Object.assign({}, kouluaine, { painokerroin });
    setKouluaine(uusiaine);
    updateKouluaine(uusiaine);
  };

  return (
    <AineContainer>
      <KouluaineSelect
        aine={kouluaine}
        updateArvosana={handleArvosanaChange}
        updateKieli={handleKieliChange}
        isLisaKieli={isLisaKieli}
        removeLisaKieli={removeLisaKieli}
      />
      <ValinnaisetArvosanat
        addValinnaisaine={addValinnaisaine}
        arvosanat={kouluaine.valinnaisetArvosanat}
        removeValinnaisaine={removeValinnaisaine}
        embedded={embedded}
        handleValinnainenArvosanaChange={handleValinnainenArvosanaChange}
        labelId={labelId}
      />
      {embedded && (
        <PainokerroinInput
          labelId={labelId}
          painokerroin={kouluaine.painokerroin}
          updatePainokerroin={updatePainokerroin}
        />
      )}
    </AineContainer>
  );
};
