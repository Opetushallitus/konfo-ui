import React, { useState } from 'react';

import { Box, styled, Button } from '@mui/material';
import { colors } from 'src/colors';

const PREFIX = 'keskiarvo__ainelaskuri__lisaakieli__';

const classes = {
  input: `${PREFIX}input`,
  kieliValinta: `${PREFIX}kielivalinta`,
};

const KieliContainer = styled(Box)(() => ({
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
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
  [`& .${classes.kieliValinta}`]: {
    position: 'absolute',
    zIndex: 200,
    top: '40px',
    left: 0,
    padding: '1rem 0.5rem',
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
}));

type Props = {
  addKieli: (name: string) => void;
};

export const AddKieliInput = ({ addKieli }: Props) => {
  const [showAddKieli, setShowAddKieli] = useState<boolean>(false);

  const addAndClose = (name: string) => {
    setShowAddKieli(false);
    addKieli(name);
  };

  return (
    <KieliContainer>
      <Button onClick={() => setShowAddKieli(true)}>+ Lisää Kieli</Button>
      {showAddKieli && (
        <div className={classes.kieliValinta}>
          <Button onClick={() => addAndClose('A1-kieli')}>A1-kieli</Button>
          <Button onClick={() => addAndClose('A2-kieli')}>A2-kieli</Button>
          <Button onClick={() => addAndClose('B2-kieli')}>B2-kieli</Button>
          <Button onClick={() => addAndClose('Äidinkieli ja kirjallisuus')}>
            Äidinkieli ja kirjallisuus
          </Button>
        </div>
      )}
    </KieliContainer>
  );
};
