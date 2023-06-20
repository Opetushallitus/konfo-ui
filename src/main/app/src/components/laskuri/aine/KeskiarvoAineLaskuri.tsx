import React, { useEffect } from 'react';

import { Box, Typography, styled, Button } from '@mui/material';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

import { AddKieliInput } from './AddKieliInput';
import { Kouluaineet, Kouluaine, createKieliaine, createKouluaine } from './Kouluaine';
import { KouluaineInput } from './KouluaineInput';
import { SuorittanutCheckbox } from '../common/SuorittanutCheckbox';
import { LocalStorageUtil, KOULUAINE_STORE_KEY } from '../LocalStorageUtil';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
  changeCalcButton: `${PREFIX}changecalcbutton`,
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
  [`& .${classes.changeCalcButton}`]: {
    margin: '1rem 0 1.5rem 0',
    border: `2px solid ${colors.brandGreen}`,
    color: colors.brandGreen,
    fontWeight: 600,
  },
  button: {
    fontSize: '1rem',
    fontWeight: 'semibold',
  },
}));

type Props = {
  changeCalculator: (value: boolean) => void;
  updateKouluaineetToCalculate: (kouluaineet: Kouluaineet) => void;
  kouluaineet: Kouluaineet;
};

export const KeskiarvoAineLaskuri = ({
  changeCalculator,
  updateKouluaineetToCalculate,
  kouluaineet,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    const savedResult = LocalStorageUtil.load(KOULUAINE_STORE_KEY);
    if (savedResult) {
      updateKouluaineetToCalculate(savedResult as Kouluaineet);
    } else {
      updateKouluaineetToCalculate(new Kouluaineet());
    }
  }, [updateKouluaineetToCalculate]);

  const updateKouluaineFromChild = (assigner: (aineet: Kouluaineet) => Kouluaineet) => {
    const aineet = assigner(kouluaineet);
    if (!isEqual(kouluaineet, new Kouluaineet())) {
      LocalStorageUtil.save(KOULUAINE_STORE_KEY, aineet);
    }
    updateKouluaineetToCalculate(aineet);
  };

  const addKieli = (nimi: string, lukiokoodi: string, description: string | null) => {
    const aineet: Kouluaineet = { ...kouluaineet };
    aineet.lisakielet.push(
      description
        ? createKieliaine(nimi, lukiokoodi, description)
        : createKouluaine(nimi, lukiokoodi)
    );
    updateKouluaineetToCalculate(aineet);
  };

  const removeKieli = (index: number) => {
    const aineet: Kouluaineet = { ...kouluaineet };
    aineet.lisakielet = aineet.lisakielet.filter(
      (val: Kouluaine, id: number) => id !== index
    );
    updateKouluaineetToCalculate(aineet);
    LocalStorageUtil.save(KOULUAINE_STORE_KEY, aineet);
  };

  return (
    <LaskuriContainer>
      <Typography variant="h3" sx={{ fontSize: '1.625rem' }}>
        {t('pistelaskuri.aine.heading')}
      </Typography>
      <Button className={classes.changeCalcButton} onClick={() => changeCalculator(true)}>
        {t('pistelaskuri.aine.vaihdalaskin-1')}
      </Button>
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
