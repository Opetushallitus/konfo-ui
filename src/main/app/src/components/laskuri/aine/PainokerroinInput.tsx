import React from 'react';

import { DeleteOutlined } from '@mui/icons-material';
import {
  styled,
  InputLabel,
  FormControl,
  IconButton,
  Typography,
  Input,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { colors } from 'src/colors';

import { isEligiblePainokerroin } from '../Keskiarvo';

const PREFIX = 'keskiarvo__ainelaskuri__';

const classes = {
  input: `${PREFIX}input`,
  error: `${PREFIX}error`,
  label: `${PREFIX}label`,
  button: `${PREFIX}button`,
  delete: `${PREFIX}delete`,
};

const PainoControl = styled(FormControl)(() => ({
  display: 'grid',
  gridTemplateColumns: '3fr 1fr',
  gridTemplateAreas: `"label label"
                     "input delete"
                     "error error"`,
  alignItems: 'center',
  alignContent: 'center',
  justifyItems: 'start',
  rowGap: '7px',
  [`& .${classes.input}`]: {
    gridArea: 'input',
    border: `1px solid ${colors.lightGrey}`,
    padding: '0 0.5rem',
    marginTop: 0,
    maxWidth: '6rem',
    '&:focus-within': {
      borderColor: colors.black,
    },
    '&:hover': {
      borderColor: colors.black,
    },
  },
  [`& .${classes.delete}`]: {
    gridArea: 'delete',
    color: colors.brandGreen,
    padding: '0.3rem 0.6rem',
    svg: {
      width: '1.4rem',
      height: '1.4rem',
    },
  },
  [`& .${classes.error}`]: {
    gridArea: 'error',
    color: colors.red,
  },
  [`& .${classes.label}`]: {
    gridArea: 'label',
    overflow: 'unset',
    textOverflow: 'unset',
    position: 'relative',
    transformOrigin: 'left',
    transform: 'none',
    fontSize: '1rem',
    fontWeight: 'semibold',
    lineHeight: '1.6rem',
  },
}));

type Props = {
  id: string;
  painokerroin: string;
  updatePainokerroin: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removePainokerroin: () => void;
};

export const PainokerroinInput = ({
  id,
  painokerroin,
  updatePainokerroin,
  removePainokerroin,
}: Props) => {
  const { t } = useTranslation();

  return (
    <PainoControl variant="standard">
      <InputLabel htmlFor={id} className={classes.label}>
        {t('pistelaskuri.aine.painokerroin')}
      </InputLabel>
      <Input
        name={id}
        className={classes.input}
        onChange={updatePainokerroin}
        value={painokerroin}
        error={!isEligiblePainokerroin(painokerroin)}
        placeholder={t('pistelaskuri.aine.painokerroin-placeholder')}
        disableUnderline={true}></Input>
      <IconButton
        className={classes.delete}
        onClick={removePainokerroin}
        aria-label={t('pistelaskuri.aine.removepainokerroin')}>
        <DeleteOutlined />
      </IconButton>
      {!isEligiblePainokerroin(painokerroin) && painokerroin !== '' && (
        <Typography variant="body2" className={classes.error}>
          {t('pistelaskuri.error.painokerroin')}
        </Typography>
      )}
    </PainoControl>
  );
};
