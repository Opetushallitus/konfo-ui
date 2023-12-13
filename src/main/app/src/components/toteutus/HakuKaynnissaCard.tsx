import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';

import { styled } from '#/src/theme';

const StyledCard = styled(Card)({
  marginTop: '40px',
  padding: '20px',
  display: 'flex',
  flexWrap: 'wrap',
});

type Props = {
  title: string;
  text: string;
  href: string;
  buttonText: string;
};

export const HakuKaynnissaCard = ({ title, text, href, buttonText }: Props) => {
  return (
    <StyledCard elevation={2}>
      <CardContent>
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
        <Button href={href} variant="contained" size="large" color="primary">
          {buttonText}
        </Button>
      </CardActions>
    </StyledCard>
  );
};
