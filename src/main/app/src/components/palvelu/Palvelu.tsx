import React from 'react';

import { Avatar, Box, Card, CardContent, CardHeader, Grid } from '@mui/material';
import clsx from 'clsx';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';

const PREFIX = 'Palvelu';

const classes = {
  card: `${PREFIX}-card`,
  avatar: `${PREFIX}-avatar`,
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  media: `${PREFIX}-media`,
  sininen: `${PREFIX}-sininen`,
  polku: `${PREFIX}-polku`,
};

const StyledGrid = styled(Grid)({
  [`& .${classes.card}`]: {
    cursor: 'pointer',
    borderRadius: 1,
    padding: '20px 20px 0px 20px',
    height: '100%',
  },
  [`& .${classes.avatar}`]: {},
  [`& .${classes.content}`]: {
    fontSize: '14px',
    color: colors.white,
  },
  [`& .${classes.header}`]: {
    fontSize: '20px',
    fontWeight: 'bold',
    borderBottomStyle: 'solid',
    borderWidth: '2px',
    borderColor: colors.white,
    color: colors.white,
  },
  [`& .${classes.media}`]: {
    height: 0,
    paddingTop: '56.25%',
  },
  [`& .${classes.sininen}`]: {
    background: colors.blue,
  },
  [`& .${classes.polku}`]: {
    background: colors.brandGreen,
  },
});

const Paragraph = ({ children }: React.PropsWithChildren) => (
  <Box lineHeight="21px" fontSize="14px">
    {children}
  </Box>
);

export const Palvelu = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const { data, forwardTo, assetUrl } = useContentful();
  const { i18n } = useTranslation();
  const { asset } = data;
  const palvelu = data.palvelu[id];

  const a = palvelu.image ? asset[palvelu.image.id] : null;
  const color = (palvelu.color as keyof typeof classes) || 'sininen';

  const forwardToPage = () => {
    if (palvelu.linkki && palvelu.linkki.id) {
      navigate(`/${i18n.language}${forwardTo(palvelu.linkki.id)}`);
    }
  };

  return (
    <StyledGrid item xs={12} sm={6} md={4}>
      <Card
        className={clsx(classes.card, classes[color])}
        key={palvelu.id}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            forwardToPage();
          }
        }}
        onClick={forwardToPage}>
        <CardHeader
          avatar={<Avatar src={assetUrl(a?.url)} className={classes.avatar} alt="" />}
          className={classes.header}
          disableTypography={true}
          title={palvelu.name}
          subheader=""
        />
        {palvelu.content && (
          <CardContent className={classes.content}>
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
      </Card>
    </StyledGrid>
  );
};
