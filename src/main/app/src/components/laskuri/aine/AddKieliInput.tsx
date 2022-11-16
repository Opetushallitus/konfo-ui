import React, { useState } from 'react';

import { Box, styled, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
  addKieli: (name: string, description: string | null) => void;
};

export const AddKieliInput = ({ addKieli }: Props) => {
  const { t } = useTranslation();
  const [showAddKieli, setShowAddKieli] = useState<boolean>(false);

  const addAndClose = (name: string, description: string | null = null) => {
    setShowAddKieli(false);
    addKieli(name, description);
  };

  return (
    <KieliContainer>
      <Button onClick={() => setShowAddKieli(true)}>
        {t('pistelaskuri.aine.addlanguage')}
      </Button>
      {showAddKieli && (
        <div className={classes.kieliValinta}>
          <Button
            onClick={() =>
              addAndClose('kouluaineet.a1-kieli', 'pistelaskuri.aine.kielikuvaukset.a1')
            }>
            {t('kouluaineet.a1-kieli')}
          </Button>
          <Button
            onClick={() =>
              addAndClose('kouluaineet.a2-kieli', 'pistelaskuri.aine.kielikuvaukset.a2')
            }>
            {t('kouluaineet.a2-kieli')}
          </Button>
          <Button
            onClick={() =>
              addAndClose('kouluaineet.b2-kieli', 'pistelaskuri.aine.kielikuvaukset.b2')
            }>
            {t('kouluaineet.b2-kieli')}
          </Button>
          <Button onClick={() => addAndClose('kouluaineet.aidinkieli')}>
            {t('kouluaineet.aidinkieli')}
          </Button>
        </div>
      )}
    </KieliContainer>
  );
};
