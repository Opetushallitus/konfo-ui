import { use } from 'react';

import { ContentMaxWidthContext } from '#/src/components/ContentMaxWidthContext';
import { styled } from '#/src/theme';

const Root = styled('div', {
  shouldForwardProp: (prop) => prop !== 'contentMaxWidth',
})<{ contentMaxWidth?: number }>(({ theme, contentMaxWidth }) => ({
  paddingLeft: 10,
  paddingRight: 10,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: 60,
    paddingRight: 60,
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 90,
    paddingRight: 90,
  },
  ...(contentMaxWidth
    ? {
        // content-box: maxWidth rajaa tekstialueen, ja sivumarginaalit (padding) tulevat sen ulkopuolelle
        boxSizing: 'content-box',
        width: 'auto',
        maxWidth: contentMaxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
      }
    : {}),
}));

export const WithSideMargins = (props: React.ComponentProps<typeof Root>) => {
  const contentMaxWidth = use(ContentMaxWidthContext);
  return <Root contentMaxWidth={contentMaxWidth} {...props} />;
};
