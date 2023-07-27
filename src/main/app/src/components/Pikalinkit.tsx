import { Box, Link, Paper, SvgIcon, Typography } from '@mui/material';
import Markdown from 'markdown-to-jsx';
import SVG from 'react-inlinesvg';

import { getOne } from '#/src/tools/getOne';
import {
  CfRecord,
  ContentfulContent,
  ContentfulPikalinkit,
} from '#/src/types/ContentfulTypes';

const PikalinkkiGroup = (group: ContentfulContent) => {
  const { name, content, iconURL } = group;

  return (
    <Box>
      <Typography variant="h1" display="flex" alignItems="center" sx={{ color: 'green' }}>
        {iconURL && (
          <SvgIcon fontSize="inherit" fill="currentColor">
            <SVG src={iconURL} />
          </SvgIcon>
        )}
        {name}
      </Typography>
      {content && (
        <Markdown
          options={{
            overrides: {
              a: Link,
            },
          }}>
          {content}
        </Markdown>
      )}
    </Box>
  );
};

export const Pikalinkit = ({
  pikalinkit,
  content,
}: {
  pikalinkit: CfRecord<ContentfulPikalinkit>;
  content: CfRecord<ContentfulContent>;
}) => {
  const pikalinkitData = getOne(pikalinkit);

  return (
    <Paper>
      <Typography variant="h2">{pikalinkitData?.name}</Typography>
      {pikalinkitData?.osiot?.map((osio) => {
        const linkkiOsio = content[osio?.id];
        return <PikalinkkiGroup key={linkkiOsio?.name} {...linkkiOsio} />;
      })}
    </Paper>
  );
};
