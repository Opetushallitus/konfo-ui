import React, { useMemo } from 'react';

import { Box, Card, CardContent, CardMedia, Grid } from '@mui/material';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useSideMenu } from '#/src/hooks';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { withDefaultProps } from '#/src/tools/withDefaultProps';
import {
  CfRecord,
  ContentfulAsset,
  ContentfulUutinen,
} from '#/src/types/ContentfulTypes';

const UutinenInfoItem = withDefaultProps(
  styled(Grid)({
    color: colors.grey700,
    fontSize: '14px',
    lineHeight: '19px',
  }),
  {
    item: true,
    xs: 6,
  }
);

const UutinenCard = styled(Card)({
  cursor: 'pointer',
  fontSize: '19px',
  lineHeight: '26px',
  color: colors.brandGreen,
  height: '100%',
  borderRadius: '3px',
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
  const { state: isMenuOpen } = useSideMenu();

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
    <Grid
      item
      xs={12}
      sm={isMenuOpen ? 12 : 6}
      md={isMenuOpen ? 6 : 4}
      onClick={() => forwardToPage(link)}>
      <UutinenCard elevation={3}>
        {imgUrl && (
          <CardMedia
            sx={{
              height: 0,
              paddingTop: '56.25%',
            }}
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
            <UutinenInfoItem
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'light',
              }}>
              {t('uutinen.kategoria')}
            </UutinenInfoItem>
            <UutinenInfoItem
              sx={{
                textAlign: 'end',
              }}>
              {timestamp && localize(timestamp)}
            </UutinenInfoItem>
          </Grid>
          <Box marginTop="20px" marginBottom="5px">
            {uutinen.content && <Markdown>{uutinen.content}</Markdown>}
          </Box>
        </CardContent>
      </UutinenCard>
    </Grid>
  );
};
