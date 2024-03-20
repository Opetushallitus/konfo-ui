import React from 'react';

import { Box, Popover, PopoverProps } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const StyledPopover = styled(Popover, {
  shouldForwardProp: (propName) => propName !== 'marginTop',
})<{ marginTop: string | number }>(({ marginTop }) => ({
  border: '1px solid black',
  background: 'rgba(0,0,0,0.5)',
  opacity: 1,
  transition: 'all 0.5s',
  '& .MuiPopover-paper': {
    marginTop,
    paddingTop: '10px',
    background: 'transparent',
    overflow: 'visible',
  },
}));

const ArrowBox = styled(Box)({
  minWidth: '300px',
  position: 'relative',
  padding: '20px',
  background: colors.white,
  border: `4px solid ${colors.white}`,
  borderRadius: '4px',
});

type Props = {
  anchorEl: PopoverProps['anchorEl'];
  content: React.ReactNode;
  marginTop: string | number;
  onClose: PopoverProps['onClose'];
  open: boolean;
};

export const PopoverWithArrow = ({
  anchorEl,
  content,
  marginTop,
  onClose,
  open,
}: Props) => {
  return (
    <StyledPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      marginTop={marginTop}>
      <ArrowBox component="div">{content}</ArrowBox>
    </StyledPopover>
  );
};
