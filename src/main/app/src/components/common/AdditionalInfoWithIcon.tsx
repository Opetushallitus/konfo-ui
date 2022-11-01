import React from 'react';

import { Typography, Icon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

const PREFIX = 'AdditionalInfoWithIcon';

const classes = {
  text: `${PREFIX}-text`,
  icon: `${PREFIX}-icon`,
};

const StyledTypography = styled(Typography)({
  color: colors.brandGreen,
  fontWeight: 600,
  paddingBottom: '8px',
  [`& .${classes.icon}`]: {
    verticalAlign: 'text-bottom',
    marginRight: '10px',
  },
});

type Props = {
  translationKey: string;
  icon: React.ReactNode;
};

export const AdditionalInfoWithIcon = ({ translationKey, icon }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledTypography className={classes.text} variant="body1">
      <Icon className={classes.icon}>{icon}</Icon>
      {t(translationKey)}
    </StyledTypography>
  );
};
