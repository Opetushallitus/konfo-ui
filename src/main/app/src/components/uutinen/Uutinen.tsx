import React, { useMemo } from 'react';

import { Card, CardContent, CardMedia, Grid } from '@mui/material';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import {
  CfRecord,
  ContentfulAsset,
  ContentfulUutinen,
} from '#/src/types/ContentfulTypes';

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
    borderRadius: '3px',
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
    color: colors.grey700,
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 'light',
  },
  [`& .${classes.pvm}`]: {
    color: colors.grey700,
    fontSize: '14px',
    lineHeight: '19px',
    textAlign: 'end',
  },
});

const useImageUrl = (
  uutinen: ContentfulUutinen,
  asset: CfRecord<ContentfulAsset>,
  assetUrl: (x?: string) => string | undefined
) =>
  useMemo(() => {
    const image = uutinen?.image;
    const a = image && asset[image?.id];
    return a && assetUrl(a.url);
  }, [uutinen, asset, assetUrl]);

export const Uutinen = ({ id }: { id: string }) => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const { data, forwardTo, assetUrl } = useContentful();

  const uutinen = data.uutinen[id];
  const link = (uutinen.sivu || {}).id;

  const { asset } = data;
  const imgUrl = useImageUrl(uutinen, asset, assetUrl);

  const forwardToPage = (pageId?: string) => {
    if (pageId) {
      navigate(`/${i18n.language}${forwardTo(pageId)}`);
    }
  };

  const timestamp = uutinen.formatoituUpdated || uutinen.formatoituCreated;

  return (
    <StyledGrid item xs={12} sm={6} md={4} onClick={() => forwardToPage(link)}>
      <Card className={classes.card} elevation={3}>
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
              {timestamp && localize(timestamp)}
            </Grid>
          </Grid>
          <div className={classes.content}>
            {uutinen.content && <Markdown>{uutinen.content}</Markdown>}
          </div>
        </CardContent>
      </Card>
    </StyledGrid>
  );
};
