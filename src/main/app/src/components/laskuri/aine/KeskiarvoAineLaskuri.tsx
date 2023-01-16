import React, { useState, useEffect } from 'react';

import { Box, Typography, styled, Button } from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { SuorittanutCheckbox } from '../common/SuorittanutCheckbox';
import { LocalStorageUtil, KOULUAINE_STORE_KEY } from '../LocalStorageUtil';
import { AddKieliInput } from './AddKieliInput';
import { Kouluaineet, Kouluaine, createKouluaine } from './Kouluaine';
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
  button: {
    fontSize: '1rem',
    fontWeight: 'semibold',
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

  const updateKouluaineFromChild = (assigner: (aineet: Kouluaineet) => Kouluaineet) => {
    const aineet = assigner(kouluaineet);
    setKouluaineet(aineet);
    if (!_.isEqual(kouluaineet, new Kouluaineet())) {
      LocalStorageUtil.save(KOULUAINE_STORE_KEY, aineet);
    }
    updateKouluaineetToCalculate(aineet);
  };

  const addKieli = (nimi: string, description: string | null) => {
    const aineet: Kouluaineet = { ...kouluaineet };
    aineet.lisakielet.push(createKouluaine(nimi, description));
    setKouluaineet(aineet);
  };

  const removeKieli = (index: number) => {
    const aineet: Kouluaineet = { ...kouluaineet };
    aineet.lisakielet = aineet.lisakielet.filter(
      (val: Kouluaine, id: number) => id !== index
    );
    setKouluaineet(aineet);
    updateKouluaineetToCalculate(aineet);
    LocalStorageUtil.save(KOULUAINE_STORE_KEY, aineet);
  };

  return (
    <LaskuriContainer>
      <Typography variant="h3" sx={{ fontSize: '1.625rem' }}>
        {t('pistelaskuri.aine.heading')}
      </Typography>
      <Typography sx={{ marginBottom: '1.375rem' }}>
        {t('pistelaskuri.aine.vaihdalaskin-1')}
        <Button
          onClick={() => changeCalculator(true)}
          sx={{ padding: 0, verticalAlign: 'unset' }}>
          {t('pistelaskuri.aine.vaihdalaskin-2')}
        </Button>
      </Typography>
      <SuorittanutCheckbox
        suorittanut={kouluaineet.suorittanut}
        toggleSuorittanut={() =>
          updateKouluaineFromChild((aineet: Kouluaineet) =>
            Object.assign({}, aineet, { suorittanut: !kouluaineet.suorittanut })
          )
        }
      />
      <Typography variant="h4" sx={{ marginBottom: '1.375rem', fontSize: '1.25rem' }}>
        {t('pistelaskuri.aine.lukuaineet')}
      </Typography>
      {kouluaineet.kielet.map((kieliaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild((aineet: Kouluaineet) => {
              aineet.kielet[index] = kouluaine;
              return aineet;
            })
          }
          aine={kieliaine}
          key={`kieliaine-${kieliaine.nimi}-${index}`}
        />
      ))}
      <AddKieliInput addKieli={addKieli}>
        {kouluaineet.lisakielet.map((kieliaine: Kouluaine, index: number) => (
          <KouluaineInput
            updateKouluaine={(kouluaine: Kouluaine) =>
              updateKouluaineFromChild((aineet: Kouluaineet) => {
                aineet.lisakielet[index] = kouluaine;
                return aineet;
              })
            }
            aine={kieliaine}
            key={`lisakieliaine-${kieliaine.nimi}-${index}`}
            isLisaKieli={true}
            removeLisaKieli={() => removeKieli(index)}
          />
        ))}
      </AddKieliInput>
      {kouluaineet.muutLukuaineet.map((lukuaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild((aineet: Kouluaineet) => {
              aineet.muutLukuaineet[index] = kouluaine;
              return aineet;
            })
          }
          aine={lukuaine}
          key={`lukuaine-${lukuaine.nimi}-${index}`}
        />
      ))}
      <Typography variant="h4" sx={{ margin: '2rem 0 1.375rem', fontSize: '1.25rem' }}>
        {t('pistelaskuri.aine.taitoaineet')}
      </Typography>
      {kouluaineet.taitoaineet.map((taitoaine: Kouluaine, index: number) => (
        <KouluaineInput
          updateKouluaine={(kouluaine: Kouluaine) =>
            updateKouluaineFromChild((aineet: Kouluaineet) => {
              aineet.taitoaineet[index] = kouluaine;
              return aineet;
            })
          }
          aine={taitoaine}
          key={`taitoaine-${taitoaine.nimi}-${index}`}
        />
      ))}
    </LaskuriContainer>
  );
};
