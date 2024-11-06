import { Avatar, Box, Card, CardContent, CardHeader, Grid } from '@mui/material';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useSideMenu } from '#/src/hooks';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { withDefaultProps } from '#/src/tools/withDefaultProps';
import { ContentfulPalvelu } from '#/src/types/ContentfulTypes';

const PALVELU_COLOR_MAP = {
  sininen: colors.blue,
  polku: colors.brandGreen,
};

const StyledCardHeader = styled(CardHeader)({
  fontSize: '20px',
  fontWeight: 'bold',
  borderBottomStyle: 'solid',
  borderWidth: '2px',
  borderColor: colors.white,
  color: colors.white,
});

const PalveluCard = styled(Card)<{ palvelu: ContentfulPalvelu }>(
  ({ theme, palvelu }) => ({
    cursor: 'pointer',
    borderRadius: theme.spacing(1),
    padding: '20px 20px 0px 20px',
    height: '100%',
    background: PALVELU_COLOR_MAP[palvelu.color ?? 'sininen'],
  })
);

const Paragraph = withDefaultProps(Box, { lineHeight: '21px', fontSize: '14px' });

export const Palvelu = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { data, forwardTo, assetUrl } = useContentful();
  const { i18n } = useTranslation();
  const { state: isMenuOpen } = useSideMenu();
  const { asset } = data;
  const palvelu = data.palvelu[id];

  const a = palvelu.image ? asset[palvelu.image.id] : null;

  const forwardToPage = () => {
    if (palvelu.linkki && palvelu.linkki.id) {
      navigate(`/${i18n.language}${forwardTo(palvelu.linkki.id)}`);
    }
  };

  return (
    <Grid item xs={12} sm={isMenuOpen ? 12 : 6} md={isMenuOpen ? 6 : 4}>
      <PalveluCard
        palvelu={palvelu}
        key={palvelu.id}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            forwardToPage();
          }
        }}
        onClick={forwardToPage}>
        <StyledCardHeader
          avatar={<Avatar src={assetUrl(a?.url)} alt="" />}
          disableTypography={true}
          title={palvelu.name}
          subheader=""
        />
        {palvelu.content && (
          <CardContent sx={{ fontSize: '14px', color: colors.white }}>
            <Markdown
              options={{
                overrides: {
                  p: {
                    component: Paragraph,
                  },
                  span: {
                    component: Paragraph,
                  },
                },
              }}>
              {palvelu.content}
            </Markdown>
          </CardContent>
        )}
      </PalveluCard>
    </Grid>
  );
};
