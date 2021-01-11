import { Grid, Hidden, makeStyles, Paper, Typography } from '@material-ui/core';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PublicIcon from '@material-ui/icons/Public';
import React from 'react';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import OppilaitosLogo from '#/src/assets/images/Opolkuhts.png';
import { colors, educationTypeColorCode } from '#/src/colors';

const useStyles = makeStyles((theme) => ({
  paper: (props) => ({
    borderTop: `5px solid ${
      educationTypeColorCode[props.tyyppi] || educationTypeColorCode.muu
    }`,
    marginBottom: '12px',
  }),
  icon: {
    fontSize: '1.1875rem',
  },
  organizerText: {
    color: colors.darkGrey,
    fontWeight: 600,
  },
  description: {
    margin: '10px 0',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  grid: {
    padding: '40px',
    [theme.breakpoints.down('sm')]: { padding: '8px' },
  },
  img: {
    width: '180px',
    height: 'auto',
    float: 'right',
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      float: 'left',
      marginBottom: '12px',
    },
  },
}));

export const ToteutusCard = (props) => {
  const classes = useStyles(props);
  const { organizer, heading, description, locations, opetustapa, price, image } = props;

  const ToteutusImage = () => (
    <img className={classes.img} alt={heading} src={image || OppilaitosLogo} />
  );

  return (
    <Paper className={classes.paper}>
      <Grid
        className={classes.grid}
        container
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
        spacing={3}>
        <Grid item container direction="column" xs>
          <Hidden mdUp>
            <Grid item>
              <ToteutusImage />
            </Grid>
          </Hidden>
          <Grid item>
            <Typography
              className={classes.organizerText}
              variant="body1"
              gutterBottom
              component="div">
              {organizer}
            </Typography>
            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
            <Hidden smDown>
              <Typography className={classes.description} variant="body1" component="div">
                <HTMLEllipsis unsafeHTML={description} maxLine={2} />
              </Typography>
            </Hidden>
          </Grid>
          <Grid item container spacing={3}>
            <Grid item sm={6} md>
              <Grid
                container
                direction="row"
                spacing={1}
                alignItems="center"
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
            <Grid item sm={6} md>
              <Grid
                container
                spacing={1}
                alignItems="center"
                direction="row"
                wrap="nowrap">
                <Grid item className={classes.iconContainer}>
                  <HourglassEmptyIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="body1" noWrap>
                    {opetustapa}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={6} md>
              <Grid
                container
                spacing={1}
                alignItems="center"
                direction="row"
                wrap="nowrap">
                <Grid item className={classes.iconContainer}>
                  <EuroSymbolIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{price}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Hidden smDown>
          <Grid item>
            <ToteutusImage />
          </Grid>
        </Hidden>
      </Grid>
    </Paper>
  );
};
