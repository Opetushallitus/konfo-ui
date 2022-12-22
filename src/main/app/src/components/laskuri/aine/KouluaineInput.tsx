import React, { useState, useEffect } from 'react';

import { Box, styled, Button, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Kouluaine, hasInitialValues } from './Kouluaine';
import { KouluaineSelect } from './KouluaineSelect';
import { ValinnainenArvosana } from './ValinnainenArvosana';

const AineContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'longText',
})<{ longText: boolean | undefined }>(({ theme, longText }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '27px',
  columnGap: '18px',
  justifyContent: 'flex-start',
  justifyItems: 'flex-start',
  button: {
    fontSize: '1rem',
    alignSelf: 'end',
    fontWeight: 600,
  },
  alignItems: longText ? 'end' : 'start',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'start',
    width: '100%',
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

  useEffect(() => {
    if (!hasInitialValues(aine)) {
      setKouluaine(aine);
    }
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

  return (
    <AineContainer longText={aine.longText}>
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
        <Button onClick={addValinnaisaine}>
          {t('pistelaskuri.aine.addvalinnainen')}
        </Button>
      )}
    </AineContainer>
  );
};
