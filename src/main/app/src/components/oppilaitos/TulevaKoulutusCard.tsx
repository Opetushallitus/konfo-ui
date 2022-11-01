import React from 'react';

import {
  SchoolOutlined,
  TimelapseOutlined,
  ExtensionOutlined,
} from '@mui/icons-material';
import { Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { educationTypeColorCode } from '#/src/colors';

const PREFIX = 'TulevaKoulutusCard';

const classes = {
  nimikkeet: `${PREFIX}-nimikkeet`,
  paper: `${PREFIX}-paper`,
  icon: `${PREFIX}-icon`,
  iconContainer: `${PREFIX}-iconContainer`,
  grid: `${PREFIX}-grid`,
};

const StyledPaper = styled(Paper)({
  [`& .${classes.nimikkeet}`]: {
    fontWeight: 600,
  },
  [`&.${classes.paper}`]: ({ tyyppi }: StylesProps) => ({
    borderTop: `5px solid ${
      educationTypeColorCode[tyyppi] || educationTypeColorCode.muu
    }`,
    width: '100%',
    height: '100%',
    minWidth: '350px',
  }),
  [`& .${classes.icon}`]: {
    fontSize: '1.1875rem',
  },
  [`& .${classes.iconContainer}`]: {
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.grid}`]: {
    padding: '35px',
  },
});

type StylesProps = Pick<Props, 'tyyppi'>;

type Props = {
  koulutusName: string;
  tutkintonimikkeet: string;
  koulutustyypit: string;
  opintojenlaajuus: string;
  tyyppi: keyof typeof educationTypeColorCode;
};

export const TulevaKoulutusCard = ({
  koulutusName,
  tutkintonimikkeet,
  koulutustyypit,
  opintojenlaajuus,
}: Props) => {
  return (
    <StyledPaper className={classes.paper}>
      <Grid
        className={classes.grid}
        container
        justifyContent="space-between"
        alignItems="center"
        direction="column"
        spacing={3}
        wrap="nowrap">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {koulutusName}
          </Typography>
        </Grid>
        <Grid item container direction="column" spacing={2}>
          {tutkintonimikkeet && (
            <Grid item>
              <Grid container wrap="nowrap" spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <SchoolOutlined />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{tutkintonimikkeet}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {koulutustyypit && (
            <Grid item>
              <Grid container wrap="nowrap" spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <ExtensionOutlined />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{koulutustyypit}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {opintojenlaajuus && (
            <Grid item>
              <Grid container wrap="nowrap" spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <TimelapseOutlined />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{opintojenlaajuus}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </StyledPaper>
  );
};
