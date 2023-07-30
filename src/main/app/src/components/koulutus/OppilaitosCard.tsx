import React from 'react';

import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { educationTypeColorCode } from '#/src/colors';
import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';

const PREFIX = 'OppilaitosCard';

const classes = {
  content: `${PREFIX}-content`,
  paper: `${PREFIX}-paper`,
  icon: `${PREFIX}-icon`,
  iconContainer: `${PREFIX}-iconContainer`,
  heading: `${PREFIX}-heading`,
};

const StyledGrid = styled(Grid)<StylesProps>(({ tyyppi }) => ({
  [`& .${classes.content}`]: {
    width: 'unset',
    margin: '12px',
  },

  [`& .${classes.paper}`]: {
    borderTop: `5px solid
      ${educationTypeColorCode[tyyppi] || educationTypeColorCode.muu}`,
    maxWidth: '620px',
  },

  [`& .${classes.icon}`]: {
    fontSize: '1.1875rem',
  },

  [`& .${classes.iconContainer}`]: {
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.heading}`]: {
    fontWeight: 600,
  },
}));

type StylesProps = Pick<Props, 'tyyppi'>;

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
  const { t } = useTranslation();

  return (
    <StyledGrid item xs={12} sm={6} md={4} tyyppi={tyyppi}>
      <LocalizedLink href={`/oppilaitos/${oppilaitosOid}`}>
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
                <MaterialIcon icon="public" className={classes.icon} />
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
    </StyledGrid>
  );
};
