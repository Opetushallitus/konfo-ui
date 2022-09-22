import React from 'react';

import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const PREFIX = 'HakuKaynnissaCard';

const classes = {
  card: `${PREFIX}-card`,
  gridWrapper: `${PREFIX}-gridWrapper`,
  buttonText: `${PREFIX}-buttonText`,
};

const StyledCard = styled(Card)({
  marginTop: '40px',
  padding: '20px',
  display: 'flex',
  flexWrap: 'wrap',
  [`& .${classes.buttonText}`]: { color: '#FFFFFF' },
});

type Props = {
  title: string;
  text: string;
  link: React.ReactElement;
  buttonText: string;
};

export const HakuKaynnissaCard = ({ title, text, link, buttonText }: Props) => {
  return (
    <StyledCard className={classes.card} elevation={2}>
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
    </StyledCard>
  );
};
