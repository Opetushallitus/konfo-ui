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
  Typography,
  Input,
} from '@mui/material';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { LabelTooltip } from '../../common/LabelTooltip';
import { Kouluaine } from './Kouluaine';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
  optionDisabled: `${PREFIX}option--disabled`,
  gradeControl: `${PREFIX}gradecontrol`,
  gradeLabel: `${PREFIX}gradelabel`,
  gradeSelect: `${PREFIX}gradeselect`,
  gradeInfo: `${PREFIX}gradeinfo`,
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
const ARVOSANA_VALUES = _.range(4, 11);

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
              sx={{ marginLeft: '3px' }}></LabelTooltip>
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
          variant="standard">
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
          <FormControl
            variant="standard"
            sx={{ minWidth: 150 }}
            key={`valinnainen-${index}`}>
            <InputLabel id={`${labelId}-${index}`}>
              {t('pistelaskuri.aine.valinnaisaine')} {t(kouluaine.nimi)}
            </InputLabel>
            <Select
              labelId={`${labelId}-${index}`}
              value={String(valinnainenArvosana)}
              onChange={(event: SelectChangeEvent) =>
                handleValinnainenArvosanaChange(event, index)
              }>
              {ARVOSANA_VALUES.map((arvosana: number, id: number) => (
                <MenuItem key={`arvosana-${index}-${id}`} value={arvosana}>
                  {arvosana}
                </MenuItem>
              ))}
            </Select>
            <IconButton
              onClick={() => removeValinnaisaine(index)}
              aria-label={t('pistelaskuri.aine.removevalinnainen')}>
              <DeleteOutlined />
            </IconButton>
          </FormControl>
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
        <>
          <InputLabel>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('pistelaskuri.aine.painokerroin')}
            </Typography>
            <Input
              className={classes.input}
              onChange={changePainokerroin}
              value={kouluaine.painokerroin}
              disableUnderline={true}></Input>
          </InputLabel>
          <IconButton
            onClick={poistaPainokerroin}
            aria-label={t('pistelaskuri.aine.removepainokerroin')}>
            <DeleteOutlined />
          </IconButton>
        </>
      )}
    </AineContainer>
  );
};
