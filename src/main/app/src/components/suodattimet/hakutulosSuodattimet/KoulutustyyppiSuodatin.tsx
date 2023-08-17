import React, { useMemo, useState } from 'react';

import { Button, ButtonGroup, Grid, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { Filter } from '#/src/components/common/Filter';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { RajainItem, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

const classes = {
  noBoxShadow: 'noBoxShadow',
  buttonRoot: 'buttonRoot',
  buttonLabelTruncated: 'buttonLabelTruncated',
  buttonActive: 'buttonActive',
  buttonInactive: 'buttonInactive',
};

const Root = styled('div')({
  [`& .${classes.buttonRoot}`]: {
    fontSize: 14,
    fontWeight: 600,
    padding: '5px',
  },
  [`& .${classes.buttonLabelTruncated}`]: {
    overflow: 'hidden',
    display: 'block',
    textOverflow: 'ellipsis',
  },
  [`& .${classes.buttonActive}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
  [`& .${classes.buttonInactive}`]: {
    backgroundColor: colors.white,
    color: colors.brandGreen,
  },
});

export const KoulutustyyppiSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const [isMuuSelected, setIsMuuSelected] = useState(false);
  const { rajainValues = [], muuRajainValues = [], setFilters } = props;

  const combinedRajainValues = useMemo(
    () => [
      ...rajainValues.map((v) => ({ ...v, hidden: isMuuSelected })),
      ...muuRajainValues.map((v) => ({ ...v, hidden: !isMuuSelected })),
    ],
    [isMuuSelected, muuRajainValues, rajainValues]
  );

  const handleCheck = (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(
      isMuuSelected ? muuRajainValues : rajainValues
    )(item);
    setFilters(changes);
  };

  return (
    <Root>
      <Filter
        defaultExpandAlakoodit={true}
        {...props}
        testId="koulutustyyppi-filter"
        name={t('haku.koulutustyyppi')}
        rajainValues={combinedRajainValues}
        handleCheck={handleCheck}
        additionalContent={
          <Grid item style={{ padding: '20px 0' }}>
            {/* TODO erillinen common component tästä */}
            <ButtonGroup fullWidth>
              <Button
                style={{ minWidth: '155px' }}
                className={isMuuSelected ? classes.buttonInactive : classes.buttonActive}
                classes={{ root: classes.buttonRoot, text: classes.buttonLabelTruncated }}
                aria-selected={!isMuuSelected}
                onClick={() => setIsMuuSelected(false)}
                variant="outlined">
                {t('haku.tutkintoon-johtavat')}
              </Button>
              <Button
                className={isMuuSelected ? classes.buttonActive : classes.buttonInactive}
                classes={{ root: classes.buttonRoot, text: classes.buttonLabelTruncated }}
                aria-selected={isMuuSelected}
                onClick={() => setIsMuuSelected(true)}
                variant="outlined">
                {t('haku.muut')}
              </Button>
            </ButtonGroup>
          </Grid>
        }
      />
    </Root>
  );
};
