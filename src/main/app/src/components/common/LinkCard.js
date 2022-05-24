import React from 'react';

import { Grid, makeStyles, Icon, Typography, Paper } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';

const useStyles = makeStyles({
  grid: {
    height: '100%',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  paper: {
    height: '110px',
    borderLeft: '4px solid',
    borderLeftColor: colors.brandGreen,
    minWidth: '426px',
    cursor: 'pointer',
  },
  icon: {
    height: '60px',
    width: '60px',
    backgroundColor: colors.brandGreen,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LinkCard = (props) => {
  const { forwardTo, assetUrl } = useContentful();
  const history = useHistory();
  const { i18n } = useTranslation();
  const { icon, text, sivu } = props;
  const url = (icon || {}).url;
  const forwardToPage = (id) => {
    history.push(`/${i18n.language}${forwardTo(id)}`);
  };

  const classes = useStyles();
  return (
    <Paper className={classes.paper} onClick={() => sivu && forwardToPage(sivu.id)}>
      <Grid
        className={classes.grid}
        spacing={3}
        container
        justifyContent="space-between"
        alignItems="center">
        <Grid item xs={2}>
          {url ? (
            <Icon className={classes.icon}>
              <img src={assetUrl(url)} alt={(icon || {}).description} />
            </Icon>
          ) : null}
        </Grid>
        <Grid item xs={9}>
          <Typography align="left" variant="body1">
            {text}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <ArrowForwardIosIcon />
        </Grid>
      </Grid>
    </Paper>
  );
};
export default LinkCard;
