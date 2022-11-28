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
  Input,
} from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { LabelTooltip } from '../../common/LabelTooltip';
import { ARVOSANA_VALUES, Kouluaine } from './Kouluaine';
import { PainokerroinInput } from './PainokerroinInput';
import { ValinnainenArvosana } from './ValinnainenArvosana';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
  optionDisabled: `${PREFIX}option--disabled`,
  gradeControl: `${PREFIX}gradecontrol`,
  gradeLabel: `${PREFIX}gradelabel`,
  gradeLabelContainer: `${PREFIX}gradelabelcontainer`,
  gradeSelect: `${PREFIX}gradeselect`,
  gradeInfo: `${PREFIX}gradeinfo`,
  button: `${PREFIX}button`,
  poistakieli: `${PREFIX}poistakieli`,
};

const AineContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLisakieli',
})<{ isLisakieli: boolean }>(({ isLisakieli }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '27px',
  columnGap: '18px',
  justifyContent: 'flex-start',
  justifyItems: 'flex-start',
  [`& .${classes.input}`]: {
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
    width: '12rem',
    maxWidth: '100%',
  },
  button: {
    fontSize: '1rem',
  },
  [`& .${classes.error}`]: {
    color: colors.red,
    maxWidth: '60%',
  },
  [`& .${classes.optionDisabled}`]: {
    color: colors.lightGrey,
  },
  [`& .${classes.gradeControl}`]: {
    display: 'grid',
    gridTemplateAreas: isLisakieli
      ? `"label label"
       "select kieli"`
      : `"label label"
       "select select"`,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'start',
    justifyItems: 'start',
    rowGap: '7px',
    columnGap: '2px',
    [`& .${classes.gradeLabelContainer}`]: {
      gridArea: 'label',
      display: 'flex',
      alignItems: 'center',
      columnGap: '2px',
    },
    [`& .${classes.gradeLabel}`]: {
      overflow: 'unset',
      textOverflow: 'unset',
      overflowWrap: 'normal',
      whiteSpace: 'break-spaces',
      position: 'relative',
      transformOrigin: 'left',
      transform: 'none',
      fontSize: '1rem',
      fontWeight: 'semibold',
      maxWidth: '12rem',
      lineHeight: '1.6rem',
    },
    [`& .${classes.gradeInfo}`]: {
      padding: '0',
      svg: {
        width: '1.4rem',
        height: '1.4rem',
        marginTop: '-4px',
      },
    },
    [`& .${classes.gradeSelect}`]: {
      gridArea: 'select',
    },
    [`& .${classes.poistakieli}`]: {
      gridArea: 'kieli',
      color: colors.brandGreen,
      padding: '0.3rem 0.6rem',
      svg: {
        width: '1.4rem',
        height: '1.4rem',
      },
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

  const [showPainokerroin, setShowPainokerroin] = useState<boolean>(false);

  useMemo(() => {
    if (!_.isEqual(kouluaine, aine)) {
      setKouluaine(aine);
      setShowPainokerroin(aine.painokerroin !== '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aine]);

  const labelId = `aine-label-${aine.nimi}`;

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
    <AineContainer
      isLisakieli={isLisaKieli}
      sx={{ alignItems: aine.longText ? 'end' : 'start' }}>
      <FormControl
        variant="standard"
        sx={{ minWidth: 220 }}
        className={classes.gradeControl}>
        <div className={classes.gradeLabelContainer}>
          <InputLabel id={labelId} className={classes.gradeLabel}>
            {t(aine.nimi)}
          </InputLabel>
          <div>
            {kouluaine.description && (
              <LabelTooltip
                title={t(kouluaine.description)}
                sx={{ marginLeft: '3px', color: colors.brandGreen }}></LabelTooltip>
            )}
          </div>
        </div>
        <Select
          labelId={labelId}
          value={String(kouluaine.arvosana)}
          onChange={handleArvosanaChange}
          input={<Input className={classes.input} />}
          className={
            String(kouluaine.arvosana) === 'null'
              ? `${classes.optionDisabled} ${classes.gradeSelect}`
              : classes.gradeSelect
          }
          variant="standard"
          disableUnderline={true}>
          <MenuItem key="arvosana-null" disabled={true} value="null">
            {t('pistelaskuri.aine.valitsearvosana')}
          </MenuItem>
          {ARVOSANA_VALUES.map((arvosana: number, index: number) => (
            <MenuItem key={`arvosana-${index}`} value={arvosana}>
              {arvosana}
            </MenuItem>
          ))}
        </Select>
        {isLisaKieli && (
          <IconButton
            className={classes.poistakieli}
            onClick={removeLisaKieli}
            aria-label={t('pistelaskuri.aine.removekieli')}>
            <DeleteOutlined />
          </IconButton>
        )}
      </FormControl>
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
