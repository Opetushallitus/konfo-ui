import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors, educationTypeColorCode } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const InfoIcon = styled(MaterialIcon)(({ theme }) => ({
  marginRight: '8px',
  color: colors.brandGreen,
  [theme.breakpoints.down('sm')]: {
    marginRight: '4px',
    verticalAlign: 'text-bottom',
  },
}));

export const InfoBox = () => {
  const { t } = useTranslation();
  return (
    <Box
      data-testid="infobox"
      sx={{
        maxWidth: '982px',
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        padding: '0.8rem',
        paddingRight: '0.9rem',
        backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
        marginBottom: '1rem',
      }}>
      <InfoIcon
        icon="info"
        variant="outlined"
        sx={{ display: { xs: 'none', sm: 'block' } }}
      />
      <Typography variant="body1">
        <InfoIcon
          icon="info"
          variant="outlined"
          sx={{ display: { xs: 'inline', sm: 'none' } }}
        />
        {t('pistelaskuri.graafi.info')}
        <span style={{ fontWeight: 600 }}>
          &nbsp;{t('pistelaskuri.graafi.info-rohkaisu')}
        </span>
      </Typography>
    </Box>
  );
};
