import { Grid, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { IconBackground } from '#/src/components/common/IconBackground';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { PageSection } from '#/src/components/common/PageSection';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { Toteutus } from '#/src/types/ToteutusTypes';

const StyledNimi = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  fontWeight: 'bold',
  color: colors.grey900,
}));

type Props = {
  toteutus?: Toteutus;
};

export const ToteutusHakuEiSahkoista = ({ toteutus }: Props) => {
  const { t } = useTranslation();

  const hakeuduTaiIlmoittauduHeading =
    toteutus?.metadata?.hakutermi === 'hakeutuminen'
      ? t('toteutus.hakeudu-koulutukseen')
      : t('toteutus.ilmoittaudu-koulutukseen');

  const toteutusMetadata = toteutus?.metadata;

  return (
    <PageSection heading={hakeuduTaiIlmoittauduHeading} maxWidth="800px">
      <Paper sx={{ padding: '30px', width: '100%' }}>
        <Grid
          container
          direction="column"
          spacing={2}
          alignContent="center"
          justifyContent="center"
          alignItems="center">
          <IconBackground>
            <MaterialIcon
              icon="description"
              variant="outlined"
              sx={{ fontSize: 40, color: colors.white }}
            />
          </IconBackground>
          <Grid item>
            <StyledNimi>{t('toteutus.ei-sahkoista-hakua')}</StyledNimi>
          </Grid>
          <Grid item>
            <Typography variant="body1" component="div">
              {sanitizedHTMLParser(localize(toteutusMetadata?.lisatietoaHakeutumisesta))}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </PageSection>
  );
};
