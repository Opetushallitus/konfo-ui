import React from 'react';

import {
  Grid,
  Typography,
  makeStyles,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
} from '@material-ui/core';
import {
  SchoolOutlined,
  TimelapseOutlined,
  FavoriteOutlined,
  FavoriteBorderOutlined,
} from '@material-ui/icons/';
import { useTranslation } from 'react-i18next';

import defaultTeemakuva from '#/src/assets/images/o-EDUCATION-facebook.jpg';
import { educationTypeColorCode } from '#/src/colors';
import { TextWithBackground } from '#/src/components/common/TextWithBackground';

const useStyles = makeStyles({
  cardActions: {
    padding: '16px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  h4: {
    marginBottom: '25px',
  },

  root: (props) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    maxWidth: 400,
    borderBottom: `5px solid ${
      educationTypeColorCode[props.tyyppi] || educationTypeColorCode.muu
    }`,
  }),
});

const SuositusKoulutusCard = (props) => {
  const {
    hakuKaynnissa,
    koulutusName,
    onSuosikki,
    opintojenlaajuus,
    opintojenLaajuusyksikko,
    teemakuva,
    tutkintonimikkeet,
  } = props;
  const classes = useStyles(props);
  const { t } = useTranslation();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={teemakuva}
          height="170"
          image={teemakuva || defaultTeemakuva}
          title={koulutusName}
          role="img"
        />
        <CardContent>
          <Typography className={classes.h4} variant="h4" gutterBottom>
            {koulutusName}
          </Typography>
          <Grid item container spacing={2}>
            <Grid item>
              <Grid container wrap="nowrap" spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <SchoolOutlined color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{tutkintonimikkeet}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container wrap="nowrap" spacing={1} alignItems="center">
                <Grid item className={classes.iconContainer}>
                  <TimelapseOutlined color="primary" />
                </Grid>
                <Grid item>
                  <Typography variant="body1">{`${opintojenlaajuus} ${opintojenLaajuusyksikko}`}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Grid
          container
          className={classes.iconContainer}
          justifyContent="space-between"
          alignItems="center">
          <Grid item>
            {hakuKaynnissa && (
              <TextWithBackground>{t('koulutus.haku-kaynnissa')}</TextWithBackground>
            )}
          </Grid>
          <Grid item className={classes.iconContainer}>
            {onSuosikki ? (
              <FavoriteOutlined color="primary" />
            ) : (
              <FavoriteBorderOutlined color="disabled" />
            )}
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default SuositusKoulutusCard;
