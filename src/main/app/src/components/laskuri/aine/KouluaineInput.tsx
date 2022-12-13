import React, { useState, useMemo } from 'react';

import { Box, styled, Button, SelectChangeEvent } from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { Kouluaine } from './Kouluaine';
import { KouluaineSelect } from './KouluaineSelect';
import { PainokerroinInput } from './PainokerroinInput';
import { ValinnainenArvosana } from './ValinnainenArvosana';

const AineContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '27px',
  columnGap: '18px',
  justifyContent: 'flex-start',
  justifyItems: 'flex-start',
  button: {
    fontSize: '1rem',
  },
}));

type Props = {
  aine: Kouluaine;
  updateKouluaine: (kouluaine: Kouluaine) => void;
  isLisaKieli?: boolean;
  removeLisaKieli?: () => void;
};

const MAX_VALINNAISET_ARVOSANAT = 3;

export const KouluaineInput = ({
  aine,
  updateKouluaine,
  isLisaKieli = false,
  removeLisaKieli = () => {},
}: Props) => {
  const { t } = useTranslation();
  const [kouluaine, setKouluaine] = useState<Kouluaine>({
    nimi: aine.nimi,
    arvosana: aine.arvosana,
    valinnaisetArvosanat: aine.valinnaisetArvosanat,
    painokerroin: aine.painokerroin,
    description: aine.description,
    longText: aine.longText,
  });

  const [showPainokerroin, setShowPainokerroin] = useState<boolean>(false);

  useMemo(() => {
    if (!_.isEqual(kouluaine, aine)) {
      setKouluaine(aine);
      setShowPainokerroin(aine.painokerroin !== '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aine]);

  const labelId = `aine-label-${aine.nimi}`;

  const handleArvosanaChange = (arvosana: number) => {
    const uusiaine = Object.assign({}, kouluaine, { arvosana });
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
    <AineContainer sx={{ alignItems: aine.longText ? 'end' : 'start' }}>
      <KouluaineSelect
        aine={kouluaine}
        updateArvosana={handleArvosanaChange}
        isLisaKieli={isLisaKieli}
        removeLisaKieli={removeLisaKieli}
      />
      {kouluaine.valinnaisetArvosanat.map(
        (valinnainenArvosana: number | null, index: number) => (
          <ValinnainenArvosana
            labelId={labelId}
            index={index}
            arvosana={valinnainenArvosana}
            removeValinnaisaine={() => removeValinnaisaine(index)}
            updateValinnainenArvosana={(event: SelectChangeEvent) =>
              handleValinnainenArvosanaChange(event, index)
            }
            key={`valinnainen-${index}`}
          />
        )
      )}
      {kouluaine.valinnaisetArvosanat.length < MAX_VALINNAISET_ARVOSANAT && (
        <Button onClick={addValinnaisaine} sx={{ alignSelf: 'end' }}>
          {t('pistelaskuri.aine.addvalinnainen')}
        </Button>
      )}
      {!showPainokerroin && (
        <Button onClick={() => setShowPainokerroin(true)} sx={{ alignSelf: 'end' }}>
          {t('pistelaskuri.aine.addpainokerroin')}
        </Button>
      )}
      {showPainokerroin && (
        <PainokerroinInput
          id={`painokerroin-${kouluaine.nimi}`}
          painokerroin={kouluaine.painokerroin}
          updatePainokerroin={changePainokerroin}
          removePainokerroin={poistaPainokerroin}
        />
      )}
    </AineContainer>
  );
};
