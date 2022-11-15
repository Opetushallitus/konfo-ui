import React, { useState, useEffect } from 'react';

import { Box, Typography, styled, Button } from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { LocalStorageUtil } from '../LocalStorageUtil';
import { AddKieliInput } from './AddKieliInput';
import { Kouluaineet, Kouluaine, createKouluaine } from './Kouluaine';
import { KouluaineInput } from './KouluaineInput';

const KOULUAINE_STORE_KEY = 'kouluaineet';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
};

const LaskuriContainer = styled(Box)(() => ({
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
  changeCalculator: (value: boolean) => void;
  updateKouluaineetToCalculate: (kouluaineet: Kouluaineet) => void;
};

export const KeskiarvoAineLaskuri = ({
  changeCalculator,
  updateKouluaineetToCalculate,
}: Props) => {
  const { t } = useTranslation();
  const [kouluaineet, setKouluaineet] = useState<Kouluaineet>(new Kouluaineet());

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(KOULUAINE_STORE_KEY);
    if (savedResult) {
      setKouluaineet(savedResult as Kouluaineet);
      updateKouluaineetToCalculate(savedResult as Kouluaineet);
    } else {
      setKouluaineet(new Kouluaineet());
    }
  }, [updateKouluaineetToCalculate]);

  const updateKouluaineFromChild = (
    kouluaine: Kouluaine,
    id: number,
    arrayAvain: string
  ) => {
    const aineet = kouluaineet;
    aineet[arrayAvain as keyof Kouluaineet][id] = kouluaine;
    setKouluaineet(aineet);
    if (!_.isEqual(kouluaineet, new Kouluaineet())) {
      LocalStorageUtil.save(KOULUAINE_STORE_KEY, aineet);
    }
    updateKouluaineetToCalculate(aineet);
  };

  const addKieli = (nimi: string) => {
    const aineet: Kouluaineet = { ...kouluaineet };
    aineet.lisakielet.push(createKouluaine(nimi));
    setKouluaineet(aineet);
  };

  return (
    <LaskuriContainer>
      <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>
        {t('pistelaskuri.aine.heading')}
      </Typography>
      <Typography>
        Voit myös{' '}
        <Button onClick={() => changeCalculator(true)}>arvioida keskiarvot itse.</Button>
      </Typography>
      <Typography variant="h4">Lukuaineet</Typography>
      {kouluaineet.kielet.map((kieliaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild(kouluaine, index, 'kielet')
          }
          aine={kieliaine}
          key={`kieliaine-${kieliaine.nimi}-${index}`}></KouluaineInput>
      ))}
      {kouluaineet.lisakielet.map((kieliaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild(kouluaine, index, 'lisakielet')
          }
          aine={kieliaine}
          key={`lisakieliaine-${kieliaine.nimi}-${index}`}></KouluaineInput>
      ))}
      <AddKieliInput addKieli={addKieli}></AddKieliInput>
      {kouluaineet.muutLukuaineet.map((lukuaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild(kouluaine, index, 'muutLukuaineet')
          }
          aine={lukuaine}
          key={`lukuaine-${lukuaine.nimi}-${index}`}></KouluaineInput>
      ))}
      <Typography variant="h4">Taide- ja taitoaineet</Typography>
      {kouluaineet.taitoaineet.map((taitoaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild(kouluaine, index, 'taitoaineet')
          }
          aine={taitoaine}
          key={`taitoaine-${taitoaine.nimi}-${index}`}></KouluaineInput>
      ))}
    </LaskuriContainer>
  );
};
