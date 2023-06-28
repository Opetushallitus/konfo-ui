import React from 'react';

import { styled, Button, SelectChangeEvent, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ValinnainenArvosana } from '#/src/components/laskuri/aine/ValinnainenArvosana';

const MAX_VALINNAISET_ARVOSANAT = 3;

const PREFIX = 'keskiarvo__ainelaskuri__valinnaiset__';

const classes = {
  addFirst: `${PREFIX}addFirst`,
  add: `${PREFIX}add`,
};

const ValinnaisetContainer = styled(Box)<{ embedded: boolean }>(
  ({ theme, embedded }) => ({
    display: 'flex',
    flexDirection: embedded ? 'column' : 'row',
    alignSelf: 'end',
    rowGap: '7px',
    [`& .${classes.add}`]: {
      marginTop: embedded ? '0' : '1.6rem',
      marginRight: '2.7rem',
      whiteSpace: 'nowrap',
      [theme.breakpoints.down('sm')]: {
        marginTop: '0',
      },
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '100%',
    },
  })
);

type Props = {
  labelId: string;
  arvosanat: Array<number | null>;
  embedded: boolean;
  addValinnaisaine: () => void;
  removeValinnaisaine: (index: number) => void;
  handleValinnainenArvosanaChange: (event: SelectChangeEvent, index: number) => void;
};

export const ValinnaisetArvosanat = ({
  labelId,
  arvosanat,
  embedded,
  addValinnaisaine,
  removeValinnaisaine,
  handleValinnainenArvosanaChange,
}: Props) => {
  const { t } = useTranslation();

  return (
    <ValinnaisetContainer embedded={embedded}>
      {arvosanat.map((valinnainenArvosana: number | null, index: number) => (
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
      ))}
      {arvosanat.length < MAX_VALINNAISET_ARVOSANAT && (
        <Button
          onClick={addValinnaisaine}
          className={`${classes.add} ${arvosanat.length === 0 ? classes.addFirst : ''}`}>
          {t('pistelaskuri.aine.addvalinnainen')}
        </Button>
      )}
    </ValinnaisetContainer>
  );
};
