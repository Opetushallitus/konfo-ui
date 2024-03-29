import React from 'react';

import { Grid, Card, CardContent, CardMedia, Link } from '@mui/material';
import clsx from 'clsx';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';

const PREFIX = 'Kortti';

const classes = {
  card: `${PREFIX}-card`,
  media: `${PREFIX}-media`,
  link: `${PREFIX}-link`,
  linkElement: `${PREFIX}-linkElement`,
  otsikko: `${PREFIX}-otsikko`,
  haku: `${PREFIX}-haku`,
  verkko: `${PREFIX}-verkko`,
  polku: `${PREFIX}-polku`,
};

const StyledGrid = styled(Grid)({
  [`& .${classes.card}`]: {
    height: '100%',
  },
  [`& .${classes.media}`]: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  [`& .${classes.link}`]: {
    color: colors.white,
    display: 'block',
    fontSize: '16px',
    lineHeight: '35px',
  },
  [`& .${classes.linkElement}`]: {
    color: colors.white,
    textDecoration: 'none',
    verticalAlign: 'super',
  },
  [`& .${classes.otsikko}`]: {
    color: colors.white,
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '28px',
    paddingTop: '10px',
    paddingBottom: '15px',
  },
  [`& .${classes.haku}`]: {
    background: colors.blue,
  },
  [`& .${classes.verkko}`]: {
    background: colors.red,
  },
  [`& .${classes.polku}`]: {
    background: colors.brandGreen,
  },
  [`.MuiLink-root.Mui-focusVisible`]: {
    outline: '1px solid white',
    outlineOffset: '4px',
  },
});

export const Kortti = ({ id }: { id: string }) => {
  const { data, forwardTo, assetUrl } = useContentful();
  const { asset, sivu } = data;
  const kortti = data.kortti[id];

  const linkit = kortti.linkit || [];
  const a = kortti.image && asset[kortti.image.id];
  const imgUrl = assetUrl(a?.url);

  return (
    <StyledGrid item xs={12} sm={6} md={4}>
      <Card className={clsx(classes.card, classes[kortti.color])}>
        <CardMedia
          className={classes.media}
          image={imgUrl}
          role="img"
          title={kortti.name}
        />
        <CardContent>
          <h2 className={classes.otsikko}>{kortti.name}</h2>
          {linkit
            .map((l) => sivu[l?.id])
            .filter(Boolean)
            .map((page) => (
              <div className={classes.link} key={page.id}>
                <MaterialIcon icon="chevron_right" />
                <Link className={classes.linkElement} href={forwardTo(page.id)}>
                  {page.name}
                </Link>
              </div>
            ))}
        </CardContent>
      </Card>
    </StyledGrid>
  );
};
