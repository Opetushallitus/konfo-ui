import React from 'react';

import { Box, Typography, BoxProps, useMediaQuery } from '@mui/material';
import { isString } from 'lodash';

import { theme } from '#/src/theme';

import { Spacer } from './Spacer';

type Props = React.PropsWithChildren<
  {
    heading: string | JSX.Element;
    headingId?: string;
  } & BoxProps
>;

export const PageSection = ({ heading, headingId, children, ...props }: Props) => {
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      mt={isSmall ? 4 : 8}
      {...props}>
      {isString(heading) ? (
        <Typography id={headingId} variant="h2" sx={{ textAlign: 'center' }}>
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
