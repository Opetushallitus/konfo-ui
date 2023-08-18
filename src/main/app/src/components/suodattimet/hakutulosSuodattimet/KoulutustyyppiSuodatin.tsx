import React from 'react';

import { styled } from '@mui/material';
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

  const { rajainValues = [], setFilters } = props;

  const handleCheck = (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(rajainValues)(item);
    setFilters(changes);
  };

  return (
    <Root>
      <Filter
        {...props}
        testId="koulutustyyppi-filter"
        name={t('haku.koulutustyyppi')}
        rajainValues={rajainValues}
        handleCheck={handleCheck}
        displaySelected
      />
    </Root>
  );
};
