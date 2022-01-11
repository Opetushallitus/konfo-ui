import React from 'react';

import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { educationTypeColorCode } from '#/src/colors';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';

type StylesProps = Pick<Props, 'tyyppi'>;

const useStyles = makeStyles(() => ({
  content: {
    width: 'unset',
    margin: '12px',
  },
  paper: ({ tyyppi }: StylesProps) => ({
    borderTop: `5px solid
      ${educationTypeColorCode[tyyppi] || educationTypeColorCode.muu}`,
    maxWidth: '620px',
  }),
  icon: {
    fontSize: '1.1875rem',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 600,
  },
}));

type Props = {
  heading: string;
  locations: string;
  image: string;
  oppilaitosOid: string;
  tyyppi: keyof typeof educationTypeColorCode;
};

export const OppilaitosCard = ({
  heading,
  locations,
  image,
  oppilaitosOid,
  tyyppi,
}: Props) => {
  const classes = useStyles({ tyyppi });
  const { t } = useTranslation();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <LocalizedLink
        underline="none"
        component={RouterLink}
        to={`/oppilaitos/${oppilaitosOid}`}>
        <Paper className={classes.paper}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            spacing={3}
            className={classes.content}>
            <Grid item>
              <OppilaitosKorttiLogo
                alt={t('oppilaitos.oppilaitoksen-logo')}
                image={image}
              />
            </Grid>
            <Grid item className={classes.heading}>
              {heading}
            </Grid>
            <Grid
              item
              container
              direction="row"
              spacing={1}
              justifyContent="center"
              wrap="nowrap">
              <Grid item className={classes.iconContainer}>
                <PublicIcon className={classes.icon} />
              </Grid>
              <Grid item>
                <Typography variant="body1" noWrap>
                  {locations}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </LocalizedLink>
    </Grid>
  );
};
