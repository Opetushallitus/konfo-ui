import React, { useRef } from 'react';

import { Backdrop, Box, CircularProgress, makeStyles } from '@material-ui/core';

const CIRCLE_MIN_HEIGHT = 100;

const useStyles = makeStyles({
  backdrop: {
    position: 'absolute',
    zIndex: 1000,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    boxShadow: (props) => (props?.noContent ? 'none' : '0 0 5px 5px rgba(0,0,0,0.3)'),
  },
});

export const LoadingCircle = () => {
  return (
    <Box padding={10} display="flex" justifyContent="center">
      <CircularProgress size={50} disableShrink />
    </Box>
  );
};

export const OverlayLoadingCircle = ({ isLoading = false, noContent = false }) => {
  const classes = useStyles({ noContent });
  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <LoadingCircle />
    </Backdrop>
  );
};

export const LoadingCircleWrapper = ({ children }) => {
  const ref = useRef(null);

  const noContent = ref.current?.clientHeight <= CIRCLE_MIN_HEIGHT;

  return (
    <Box ref={ref} position="relative" minHeight={CIRCLE_MIN_HEIGHT} width="auto">
      <OverlayLoadingCircle isLoading={true} noContent={noContent} />
      {children}
    </Box>
  );
};
