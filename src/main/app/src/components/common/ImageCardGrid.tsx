import { Grid, useTheme, useMediaQuery, Link } from '@mui/material';

import { ImageCardWithText } from '#/src/components/common/ImageCardWithText';

export const ImageCardGrid = (props: {
  cards: Array<{ image: string; text: string; link?: string }>;
  cardIsLink: boolean;
}) => {
  const { cards, cardIsLink } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid justifyContent="center" container spacing={isMobile ? 1 : 3}>
      {cards.map((card, i) => {
        const cardElement = <ImageCardWithText image={card.image} cardText={card.text} />;

        return (
          <Grid item key={`ImageCardWithText-${i}`}>
            {cardIsLink ? <Link href={card.link}>{cardElement}</Link> : cardElement}
          </Grid>
        );
      })}
    </Grid>
  );
};
