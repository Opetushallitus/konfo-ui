import React, { useState } from 'react';

import { Box, Typography, styled, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { Kouluaineet, Kouluaine } from './Kouluaine';
import { KouluaineInput } from './KouluaineInput';

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

  const updateKouluaineFromChild = (
    kouluaine: Kouluaine,
    id: number,
    arrayAvain: string
  ) => {
    const aineet = kouluaineet;
    aineet[arrayAvain as keyof Kouluaineet][id] = kouluaine;
    setKouluaineet(aineet);
    updateKouluaineetToCalculate(aineet);
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
          aine={kieliaine.nimi}
          key={`kieliaine-${kieliaine.nimi}-${index}`}></KouluaineInput>
      ))}
      {kouluaineet.lisakielet.map((kieliaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild(kouluaine, index, 'lisakielet')
          }
          aine={kieliaine.nimi}
          key={`lisakieliaine-${kieliaine.nimi}-${index}`}></KouluaineInput>
      ))}
      {kouluaineet.muutLukuaineet.map((lukuaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild(kouluaine, index, 'muutLukuaineet')
          }
          aine={lukuaine.nimi}
          key={`lukuaine-${lukuaine.nimi}-${index}`}></KouluaineInput>
      ))}
      <Typography variant="h4">Taide- ja taitoaineet</Typography>
      {kouluaineet.taitoaineet.map((taitoaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild(kouluaine, index, 'taitoaineet')
          }
          aine={taitoaine.nimi}
          key={`taitoaine-${taitoaine.nimi}-${index}`}></KouluaineInput>
      ))}
    </LaskuriContainer>
  );
};
