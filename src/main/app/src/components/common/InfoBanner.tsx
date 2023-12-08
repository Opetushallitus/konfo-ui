import React from 'react';

import { Box, Typography } from '@mui/material';

import { ContentWithTopIcon } from '#/src/components/common/ContentWithTopIcon';

export const InfoBanner = (props: {
  heading: string;
  bodytext: string;
  icon: React.ReactNode;
}) => {
  const { heading, bodytext, icon } = props;
  return (
    <ContentWithTopIcon icon={icon}>
      <Box mb={1}>
        <Typography component="div" variant="h5">
          {heading}
        </Typography>
      </Box>
      <Typography>{bodytext}</Typography>
    </ContentWithTopIcon>
  );
};
