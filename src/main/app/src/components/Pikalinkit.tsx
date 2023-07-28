import React from 'react';

import { Box, Grid, Link, Paper, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Markdown from 'markdown-to-jsx';

import { colors } from '#/src/colors';
import {
  CfRecord,
  ContentfulContent,
  ContentfulPikalinkit,
} from '#/src/types/ContentfulTypes';

import { InlineSvgIcon } from './common/InlineSvgIcon';
import { Heading, HeadingBoundary } from './Heading';
import { WithSideMargins } from './WithSideMargins';

const StyledList = styled('ul')({
  listStyleType: 'none',
  textIndent: 'none',
  padding: 0,
  margin: 0,
});

const StyledLI = styled('li')({
  color: colors.brandGreen,
  display: 'flex',
  alignItems: 'flex-start',
  lineHeight: '2rem',
});

const ListItemWithChevron = ({ children }: React.PropsWithChildren) => (
  <StyledLI sx={{ display: 'flex', alignItems: 'flex-start' }}>
    <InlineSvgIcon
      src="/konfo/icons/material/outlined/chevron_right.svg"
      color="primary"
      sx={{ fontSize: '1.4em', marginTop: '.3rem' }}
    />
    {children}
  </StyledLI>
);

const PikalinkkiGroup = (group: ContentfulContent) => {
  const { name, content, iconURL } = group;
  const theme = useTheme();
  const isSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Heading
        variant={isSM ? 'h4' : 'h3'}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '0.6rem',
        }}>
        {iconURL && <InlineSvgIcon sx={{ fontSize: '1.4em' }} src={iconURL} />}
        <Box ml={1} pt={isSM ? '.15rem' : '.2rem'}>
          {name}
        </Box>
      </Heading>
      {content && (
        <Box ml={isSM ? '2rem' : '2.7rem'}>
          <Markdown
            options={{
              overrides: {
                a: {
                  component: Link,
                  props: {
                    underline: 'hover',
                  },
                },
                ul: StyledList,
                li: ListItemWithChevron,
              },
            }}>
            {content}
          </Markdown>
        </Box>
      )}
    </Grid>
  );
};

const PikalinkitPaper = styled(Paper)({
  backgroundColor: colors.grey,
  borderRadius: 0,
  padding: '20px 0',
});

export const Pikalinkit = ({
  pikalinkit,
  content,
}: {
  pikalinkit?: ContentfulPikalinkit;
  content: CfRecord<ContentfulContent>;
}) => {
  return (
    <PikalinkitPaper elevation={0}>
      <WithSideMargins>
        <Heading variant="h1">{pikalinkit?.name}</Heading>
        <HeadingBoundary>
          <Grid spacing={3} container>
            {pikalinkit?.osiot?.map((osio) => {
              const linkkiOsio = content[osio?.id];
              return <PikalinkkiGroup key={linkkiOsio?.name} {...linkkiOsio} />;
            })}
          </Grid>
        </HeadingBoundary>
      </WithSideMargins>
    </PikalinkitPaper>
  );
};
