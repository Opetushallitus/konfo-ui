import React, { useMemo } from 'react';

import { Card, CardContent, CardMedia, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';
import { formatDateString } from '#/src/tools/utils';

const PREFIX = 'Uutinen';

const classes = {
  card: `${PREFIX}-card`,
  content: `${PREFIX}-content`,
  media: `${PREFIX}-media`,
  kategoria: `${PREFIX}-kategoria`,
  pvm: `${PREFIX}-pvm`,
};

const StyledGrid = styled(Grid)({
  [`& .${classes.card}`]: {
    cursor: 'pointer',
    fontSize: '19px',
    lineHeight: '26px',
    color: colors.brandGreen,
    height: '100%',
  },
  [`& .${classes.content}`]: {
    marginTop: '20px',
    marginBottom: '5px',
  },
  [`& .${classes.media}`]: {
    height: 0,
    paddingTop: '56.25%',
  },
  [`& .${classes.kategoria}`]: {
    textTransform: 'uppercase',
    color: colors.darkGrey,
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 'light',
  },
  [`& .${classes.pvm}`]: {
    color: colors.darkGrey,
    fontSize: '14px',
    lineHeight: '19px',
    textAlign: 'end',
  },
});

const useImageUrl = (uutinen, asset, assetUrl) =>
  useMemo(() => {
    const image = uutinen?.image;
    const a = image && asset[image?.id];
    return a && assetUrl(a.url);
  }, [uutinen, asset, assetUrl]);

export const Uutinen = ({ id }) => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const { data, forwardTo, assetUrl } = useContentful();

  const uutinen = data.uutinen[id];
  const link = (uutinen.sivu || {}).id;

  const { asset } = data;
  const imgUrl = useImageUrl(uutinen, asset, assetUrl);

  const forwardToPage = (pageId) => {
    navigate(`/${i18n.language}${forwardTo(pageId)}`);
  };

  const timestamp = uutinen.formatoituUpdated || uutinen.formatoituCreated;

  return (
    <StyledGrid item xs={12} sm={6} md={4} onClick={() => link && forwardToPage(link)}>
      <Card className={classes.card} elevation={6}>
        {imgUrl && (
          <CardMedia
            className={classes.media}
            image={imgUrl}
            role="img"
            title={uutinen.name}
          />
        )}
        <CardContent>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Grid item xs={6} className={classes.kategoria}>
              {t('uutinen.kategoria')}
            </Grid>
            <Grid item xs={6} className={classes.pvm}>
              {timestamp && formatDateString(timestamp)}
            </Grid>
          </Grid>
          <div className={classes.content}>
            <Markdown>{uutinen.content}</Markdown>
          </div>
        </CardContent>
      </Card>
    </StyledGrid>
  );
};
