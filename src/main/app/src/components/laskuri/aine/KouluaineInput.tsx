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
  gradeSelect: `${PREFIX}gradeselect`,
  gradeInfo: `${PREFIX}gradeinfo`,
  button: `${PREFIX}button`,
};

const AineContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '27px',
  columnGap: '38px',
  alignItems: 'center',
  alignContent: 'center',
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
    gridTemplateColumns: '6fr 1fr',
    gridTemplateAreas: `"label info"
                       "select select"`,
    alignItems: 'center',
    alignContent: 'center',
    rowGap: '7px',
    [`& .${classes.gradeLabel}`]: {
      gridArea: 'label',
      overflow: 'unset',
      textOverflow: 'unset',
      position: 'relative',
      transformOrigin: 'left',
      transform: 'none',
      fontSize: '1rem',
      fontWeight: 'semibold',
    },
    [`& .${classes.gradeInfo}`]: {
      gridArea: 'info',
    },
    [`& .${classes.gradeSelect}`]: {
      gridArea: 'select',
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
    <AineContainer>
      <FormControl
        variant="standard"
        sx={{ minWidth: 220 }}
        className={classes.gradeControl}>
        <InputLabel id={labelId} className={classes.gradeLabel}>
          {t(aine.nimi)}
        </InputLabel>
        <div className={classes.gradeInfo}>
          {kouluaine.description && (
            <LabelTooltip
              title={t(kouluaine.description)}
              sx={{ marginLeft: '3px', color: colors.brandGreen }}></LabelTooltip>
          )}
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
            onClick={removeLisaKieli}
            aria-label={t('pistelaskuri.aine.removekieli')}>
            <DeleteOutlined />
          </IconButton>
        )}
      </FormControl>
      {kouluaine.valinnaisetArvosanat.map(
        (valinnainenArvosana: number | null, index: number) => (
          <ValinnainenArvosana
            nimi={kouluaine.nimi}
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
      {!showPainokerroin && (
        <Button onClick={() => setShowPainokerroin(true)}>
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
