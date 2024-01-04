import { Avatar, Button, Grid, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '80%',
  borderTop: `5px solid ${colors.red}`,
  boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
  margin: 'auto',
  padding: theme.spacing(5),
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(3),
    width: '90%',
  },
}));

export const ErrorMessage = ({ onRetry = () => {} }: { onRetry?: () => void }) => {
  const { t } = useTranslation();

  return (
    <Grid container paddingTop={5} spacing={4} alignItems="center" direction="column">
      <Grid item sx={{ width: '100%' }}>
        <StyledPaper>
          <Grid container spacing={4} direction="column" alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  backgroundColor: colors.red,
                  width: 60,
                  height: 60,
                }}>
                <MaterialIcon icon="error_outline" />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                {t('latausvirhe.otsikko')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">{t('latausvirhe.teksti')}</Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                }}
                variant="contained"
                color="secondary"
                onKeyDown={(event) => event.key === 'Enter' && onRetry()}
                onClick={onRetry}>
                {t('latausvirhe.yritä-uudelleen')}
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};
