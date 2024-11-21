import React, { useRef } from 'react';

import { Grid } from '@mui/material';

import { colors } from '#/src/colors';
import { Askem } from '#/src/components/common/Askem';
import { Murupolku } from '#/src/components/common/Murupolku';
import { useContentful } from '#/src/hooks/useContentful';
import { useScrollToHash } from '#/src/hooks/useScrollToHash';
import { styled, theme } from '#/src/theme';

import { Sisalto } from './Sisalto';
import { TableOfContents } from './TableOfContents';

const Root = styled('div')({
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '32px',
  '&:last-child': {
    paddingBottom: '32px',
  },
  fontSize: '16px',
  lineHeight: '27px',
  color: colors.grey900,
});

const SivuHeading = styled('h1')({
  fontSize: '40px',
  lineHeight: '48px',
  marginTop: '15px',
  marginBottom: '30px',
  fontWeight: '700',
  color: colors.grey900,
  [theme.breakpoints.down('sm')]: {
    fontSize: '30px',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
  },
});

export const Sivu = ({ id }: { id: string }) => {
  const { data, murupolku } = useContentful();

  const rootRef = useRef<HTMLDivElement>(null);
  const pageId = id;
  const { sivu } = data;
  const page = sivu[pageId];

  const { content, description, name } = page;
  const tableOfContents = page.tableOfContents === 'true';

  useScrollToHash();

  return (
    <Root ref={rootRef}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        spacing={2}
        alignItems="center">
        <Grid item xs={12} sm={12} md={tableOfContents ? 10 : 8}>
          <Murupolku path={murupolku(pageId)} />
          <SivuHeading>{name}</SivuHeading>
          <p>{description}</p>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2} justifyContent="center">
        {tableOfContents ? (
          <Grid item xs={12} sm={12} md={3}>
            <TableOfContents content={content} />
          </Grid>
        ) : null}
        <Grid item xs={12} sm={12} md={tableOfContents ? 7 : 8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Sisalto content={content} rootRef={rootRef} />
              <Askem />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Root>
  );
};
