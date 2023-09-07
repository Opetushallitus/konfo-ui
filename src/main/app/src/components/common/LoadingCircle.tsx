import React, { useRef } from 'react';

import { Backdrop, Box, CircularProgress } from '@mui/material';

import { styled } from '#/src/theme';

const CIRCLE_MIN_HEIGHT = 100;

const StyledBackdrop = styled(Backdrop, {
  shouldForwardProp: (prop) => 'noContent' !== prop,
})<{ noContent: boolean }>(({ noContent }) => ({
  position: 'absolute',
  zIndex: 1000,
  color: '#fff',
  backgroundColor: noContent ? 'transparent' : 'rgba(0,0,0,0.3)',
  boxShadow: noContent ? 'none' : '0 0 5px 5px rgba(0,0,0,0.3)',
}));

export const LoadingCircle = () => {
  return (
    <Box sx={{ padding: 10, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={50} disableShrink />
    </Box>
  );
};

export const OverlayLoadingCircle = ({
  isLoading = false,
  noContent = false,
}: {
  isLoading: boolean;
  noContent?: boolean;
}) => {
  return (
    <StyledBackdrop open={isLoading} noContent={noContent}>
      <LoadingCircle />
    </StyledBackdrop>
  );
};

export const LoadingCircleWrapper = ({ children }: React.PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>();

  const noContent = !ref?.current || ref?.current?.clientHeight <= CIRCLE_MIN_HEIGHT;

  return (
    <Box
      ref={ref}
      sx={{ position: 'relative', minHeight: CIRCLE_MIN_HEIGHT, width: 'auto' }}>
      <OverlayLoadingCircle isLoading={true} noContent={noContent} />
      {children}
    </Box>
  );
};
