import React from 'react';

import {
  Button,
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const PREFIX = 'InfoCard';

const classes = {
  media: `${PREFIX}-media`,
  card: `${PREFIX}-card`,
  button: `${PREFIX}-button`,
  content: `${PREFIX}-content`,
};

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 460,
  height: '100%',
  [`& .${classes.media}`]: {
    height: 260,
  },
  [`& .${classes.button}`]: {
    marginTop: 'auto',
    paddingBottom: '24px',
  },
  [`& .${classes.content}`]: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const InfoCard = (props) => {
  const { image, title, text, buttonText } = props;

  return (
    <StyledCard className={classes.card}>
      {image ? (
        <CardMedia
          role="img"
          className={classes.media}
          image={image.url}
          title={image.title}
        />
      ) : null}
      <CardContent className={classes.content}>
        {title ? (
          <Typography align="left" gutterBottom variant="h4">
            {title}
          </Typography>
        ) : null}
        <Typography align="left" variant="body1" component="p">
          {text}
        </Typography>
      </CardContent>
      <CardActions className={classes.button}>
        <Button variant="contained" size="medium" color="primary">
          {buttonText ? buttonText : 'Lue lisää'}
        </Button>
      </CardActions>
    </StyledCard>
  );
};
export default InfoCard;
