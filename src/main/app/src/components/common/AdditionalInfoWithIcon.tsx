import React from 'react';

import { Typography, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const StyledTypography = styled(Typography)({
  color: colors.brandGreen,
  fontWeight: 600,
  paddingBottom: '8px',
});

const StyledIcon = styled(Icon)({
  verticalAlign: 'text-bottom',
  marginRight: '10px',
});

type Props = {
  translationKey: string;
  icon: React.ReactNode;
};

export const AdditionalInfoWithIcon = ({ translationKey, icon }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledTypography variant="body1">
      <StyledIcon>{icon}</StyledIcon>
      {t(translationKey)}
    </StyledTypography>
  );
};
