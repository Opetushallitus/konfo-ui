import React, { useState, useEffect } from 'react';

import { Box, styled, SelectChangeEvent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { KieliSelect } from '#/src/components/laskuri/aine/KieliSelect';
import { PainokerroinInput } from '#/src/components/laskuri/aine/PainokerroinInput';
import { ValinnaisetArvosanat } from '#/src/components/laskuri/aine/ValinnaisetArvosanat';

import { Kouluaine, Kieliaine, isKieliaine } from './Kouluaine';
import { KouluaineSelect } from './KouluaineSelect';

const PREFIX = 'kouluaineinput__';

const classes = {
  headerContainer: `${PREFIX}headerContainer`,
  header: `${PREFIX}header`,
  gradeLabel: `${PREFIX}gradelabel`,
};

const AineContainer = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'isKieli',
})<{ isKieli: boolean }>(({ theme, isKieli }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  rowGap: '0.5rem',
  [`& .${classes.headerContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    [`.${classes.header}`]: {
      fontWeight: 600,
      display: 'flex',
    },
  },
  [`& .${classes.gradeLabel}`]: {
    whiteSpace: 'break-spaces',
    fontSize: '1rem',
    fontWeight: isKieli ? 'normal' : 600,
    maxWidth: '12rem',
    lineHeight: '1.6rem',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: '27px',
    width: '100%',
  },
}));

const ArvosanaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  columnGap: '18px',
  button: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flexDirection: 'column',
    rowGap: '0.5rem',
    alignItems: 'stretch',
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
  const { t } = useTranslation();
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

  const isKieli = isKieliaine(kouluaine);

  return (
    <AineContainer isKieli={isKieli} data-testid={`${PREFIX}${kouluaine.nimi}`}>
      {isKieli && (
        <>
          <div className={classes.headerContainer}>
            <Typography className={classes.header}>{t(kouluaine.nimi)}</Typography>
            <LabelTooltip
              title={t(kouluaine.kuvaus)}
              sx={{ marginLeft: '3px', marginBottom: '3px', color: colors.brandGreen }}
            />
          </div>
          <KieliSelect aine={kouluaine} updateKieli={handleKieliChange} />
        </>
      )}
      <Typography className={classes.gradeLabel}>
        {t(isKieli ? 'pistelaskuri.aine.arvosana' : kouluaine.nimi)}
      </Typography>
      <ArvosanaContainer>
        <KouluaineSelect
          aine={kouluaine}
          updateArvosana={handleArvosanaChange}
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
            kouluaine={kouluaine}
            updatePainokerroin={updatePainokerroin}
          />
        )}
      </ArvosanaContainer>
    </AineContainer>
  );
};
