import React from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  card: { margin: '40px', padding: '20px', display: 'flex', flexWrap: 'wrap' },
  gridWrapper: {},
  buttonText: { color: '#FFFFFF' },
});

type Props = {
  title: string;
  text: string;
  link: React.ReactElement;
  buttonText: string;
};

export const HakuKaynnissaCard = ({ title, text, link, buttonText }: Props) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} elevation={2}>
      <CardContent className={classes.gridWrapper}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1">{text}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        {React.cloneElement(link, {
          children: (
            <Button variant="contained" size="large" color="primary">
              <Typography className={classes.buttonText} variant="body1">
                {buttonText}
              </Typography>
            </Button>
          ),
        })}
      </CardActions>
    </Card>
  );
};
