import React from 'react';

import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { IconBackground } from '#/src/components/common/IconBackground';
import Spacer from '#/src/components/common/Spacer';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';

const useStyles = makeStyles((theme) => ({
  hakuName: {
    ...theme.typography.h4,
    fontWeight: 'bold',
    color: colors.black,
  },
}));

type Props = {
  data: any;
};

export const ToteutusHakuEiSahkoista = ({ data: eiSahkoistaData }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box
      mt={7}
      style={{ width: '100%' }}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t('toteutus.ilmoittaudu-koulutukseen')}</Typography>
      <Spacer />
      <Grid
        container
        item
        alignContent="center"
        justifyContent="center"
        alignItems="center"
        xs={12}
        style={{ maxWidth: '800px' }}>
        <Paper style={{ padding: '30px', width: '100%' }}>
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
                {sanitizedHTMLParser(localize(eiSahkoistaData?.lisatietoaHakeutumisesta))}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Box>
  );
};
