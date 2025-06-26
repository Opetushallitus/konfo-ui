import React, { useRef } from 'react';

import { Backdrop, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

const StyledSrOnlyBox = styled(Box)(() => ({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
  whiteSpace: 'nowrap',
}));

export const LoadingCircle = () => {
  const { t } = useTranslation();
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ padding: 10, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={50} disableShrink />
      <StyledSrOnlyBox>{t('loading-circle.ladataan-sisaltoa')}</StyledSrOnlyBox>
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
  const ref = useRef<HTMLDivElement>(undefined);

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
