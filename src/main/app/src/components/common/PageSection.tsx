import React from 'react';

import { Box, Typography, BoxProps, useMediaQuery } from '@mui/material';
import _ from 'lodash';

import { theme } from '#/src/theme';

import Spacer from './Spacer';

type Props = {
  heading: string | JSX.Element;
  children: React.ReactNode;
} & BoxProps;

export const PageSection = ({ heading, children, ...props }: Props) => {
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      mt={isSmall ? 4 : 8}
      {...props}>
      {_.isString(heading) ? (
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          {heading}
        </Typography>
      ) : (
        heading
      )}
      <Spacer />
      {children}
    </Box>
  );
};
