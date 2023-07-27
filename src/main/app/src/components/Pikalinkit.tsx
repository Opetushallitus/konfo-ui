import React from 'react';

import {
  Box,
  Grid,
  Link,
  Paper,
  SvgIconProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Markdown from 'markdown-to-jsx';
import SVG from 'react-inlinesvg';

import {
  CfRecord,
  ContentfulContent,
  ContentfulPikalinkit,
} from '#/src/types/ContentfulTypes';

import { Gap } from './Gap';
import { Heading, HeadingBoundary } from './Heading';
import { WithSideMargins } from './WithSideMargins';
import { colors } from '../colors';

type InlineSvgIconProps = {
  src: string;
} & SvgIconProps;

export const InlineSvgIcon = ({ src }: InlineSvgIconProps) => {
  return (
    <Box sx={{ display: 'inline', fontSize: '1.4em', alignSelf: 'center' }}>
      <SVG
        style={{ position: 'relative', top: '.125em' }}
        fontSize="inherit"
        fill="currentColor"
        width="1em"
        height="1em"
        src={src}
      />
    </Box>
  );
};

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
});

const ListItemWithChevron = ({ children }: React.PropsWithChildren) => (
  <StyledLI>
    <Box sx={{ display: 'inline-flex', alignItems: 'flex-end' }}>
      <InlineSvgIcon
        src="/konfo/icons/material/outlined/chevron_right.svg"
        color="primary"
      />
    </Box>
    {children}
  </StyledLI>
);

const PikalinkkiGroup = (group: ContentfulContent) => {
  const { name, content, iconURL } = group;
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down('sm'));
  const fontSize = isXS ? '14px' : '16px';

  return (
    <Grid item xs={12} sm={6} md={4} sx={{ fontSize }}>
      <Heading
        sx={{
          display: 'inline-flex',
          alignItems: 'flex-end',
          fontSize: '1.5em',
          marginBottom: '0.6rem',
        }}>
        {iconURL && <InlineSvgIcon src={iconURL} />}
        <Gap inline x=".4em" />
        {name}
      </Heading>
      {content && (
        <Box sx={{ marginLeft: '2.3em', fontSize: '1rem' }}>
          <Markdown
            options={{
              overrides: {
                a: Link,
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
