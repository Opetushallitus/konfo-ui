import React, { useState } from 'react';

import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const PREFIX = 'keskiarvo__ainelaskuri__lisaakieli__';

const classes = {
  input: `${PREFIX}input`,
  kieliValinta: `${PREFIX}kielivalinta`,
};

const KieliContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  justifyItems: 'flex-start',
  width: '100%',
  borderBottom: `1px solid ${colors.lighterGrey}`,
  borderTop: `1px solid ${colors.lighterGrey}`,
  padding: '0.5rem 0',
  marginBottom: '1rem',
  textAlign: 'left',
  button: {
    fontWeight: 600,
    width: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
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
    top: '20px',
    left: 0,
    padding: '0.5rem 0.5rem',
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
    borderRadius: '8px',
    boxShadow: '0px 0px 6px #00000029',
    button: {
      textAlign: 'left',
      justifyContent: 'left',
      fontWeight: 'normal',
    },
  },
}));

type Props = {
  addKieli: (name: string, lukiokoodi: string, description: string | null) => void;
  children?: React.ReactNode;
};

export const AddKieliInput = ({ children, addKieli }: Props) => {
  const { t } = useTranslation();
  const [showAddKieli, setShowAddKieli] = useState<boolean>(false);

  const addAndClose = (
    name: string,
    lukiokoodi: string,
    description: string | null = null
  ) => {
    setShowAddKieli(false);
    addKieli(name, lukiokoodi, description);
  };

  return (
    <KieliContainer>
      {children}
      <Button onClick={() => setShowAddKieli(!showAddKieli)}>
        {t('pistelaskuri.aine.addlanguage')}
      </Button>
      <Box sx={{ position: 'relative' }}>
        {showAddKieli && (
          <div className={classes.kieliValinta}>
            <Button
              onClick={() =>
                addAndClose(
                  'kouluaineet.a1-kieli',
                  'painotettavatoppiaineetlukiossa_a1',
                  'pistelaskuri.aine.kielikuvaukset.a1'
                )
              }>
              {t('kouluaineet.a1-kieli')}
            </Button>
            <Button
              onClick={() =>
                addAndClose(
                  'kouluaineet.a2-kieli',
                  'painotettavatoppiaineetlukiossa_a2',
                  'pistelaskuri.aine.kielikuvaukset.a2'
                )
              }>
              {t('kouluaineet.a2-kieli')}
            </Button>
            <Button
              onClick={() =>
                addAndClose(
                  'kouluaineet.b2-kieli',
                  'painotettavatoppiaineetlukiossa_b2',
                  'pistelaskuri.aine.kielikuvaukset.b2'
                )
              }>
              {t('kouluaineet.b2-kieli')}
            </Button>
            <Button
              onClick={() =>
                addAndClose(
                  'kouluaineet.aidinkieli',
                  'painotettavatoppiaineetlukiossa_ai'
                )
              }>
              {t('kouluaineet.aidinkieli')}
            </Button>
          </div>
        )}
      </Box>
    </KieliContainer>
  );
};
