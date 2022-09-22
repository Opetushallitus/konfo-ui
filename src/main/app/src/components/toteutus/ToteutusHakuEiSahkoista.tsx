import React from 'react';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { IconBackground } from '#/src/components/common/IconBackground';
import { PageSection } from '#/src/components/common/PageSection';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { Toteutus } from '#/src/types/ToteutusTypes';

const PREFIX = 'ToteutusHakuEiSahkoista';

const classes = {
  hakuName: `${PREFIX}-hakuName`,
  paper: `${PREFIX}-paper`,
};

const StyledPageSection = styled(PageSection)(({ theme }) => ({
  [`& .${classes.hakuName}`]: {
    ...theme.typography.h4,
    fontWeight: 'bold',
    color: colors.black,
  },

  [`& .${classes.paper}`]: { padding: '30px', width: '100%' },
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
    <StyledPageSection heading={hakeuduTaiIlmoittauduHeading} maxWidth="800px">
      <Paper className={classes.paper}>
        <Grid
          container
          direction="column"
          spacing={2}
          alignContent="center"
          justifyContent="center"
          alignItems="center">
          <IconBackground>
            <DescriptionOutlinedIcon style={{ fontSize: 40, color: colors.white }} />
          </IconBackground>
          <Grid item>
            <Typography className={classes.hakuName}>
              {t('toteutus.ei-sahkoista-hakua')}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" component="div">
              {sanitizedHTMLParser(localize(toteutusMetadata?.lisatietoaHakeutumisesta))}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </StyledPageSection>
  );
};
