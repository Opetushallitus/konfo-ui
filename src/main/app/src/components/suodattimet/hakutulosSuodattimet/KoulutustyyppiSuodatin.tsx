import React from 'react';

import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { Filter } from '#/src/components/common/Filter';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from '../common/useCheckboxRajainOnChange';

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

export const KoulutustyyppiSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();

  const { setRajainValues, rajainOptions, rajainValues } = props;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.KOULUTUSTYYPPI
  );

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

  return (
    <Root>
      <Filter
        {...props}
        testId="koulutustyyppi-filter"
        name={t('haku.koulutustyyppi')}
        rajainItems={rajainItems}
        onItemChange={onItemChange}
        displaySelected
      />
    </Root>
  );
};
