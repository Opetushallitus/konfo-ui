import React from 'react';

import { Box, Typography, BoxProps, useMediaQuery, TypographyProps } from '@mui/material';
import { kebabCase, uniqueId } from 'lodash';

import { theme } from '#/src/theme';

import { Spacer } from './Spacer';

type Props = React.PropsWithChildren<
  {
    heading: string;
    headingProps?: TypographyProps;
  } & BoxProps
>;

export const PageSection = ({ heading, headingProps, children, ...props }: Props) => {
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const id = uniqueId('heading_' + kebabCase(heading));
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      aria-labelledby={id}
      mt={isSmall ? 4 : 8}
      {...props}>
      <Typography
        id={id}
        variant="h2"
        sx={{ textAlign: 'center' }}
        {...(headingProps ?? {})}>
        {heading}
      </Typography>
      <Spacer />
      {children}
    </Box>
  );
};
