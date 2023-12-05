import React from 'react';

import { Box, Popover, PopoverProps } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const StyledPopover = styled(Popover, {
  shouldForwardProp: (propName) => propName !== 'marginTop',
})<{ marginTop: string | number }>(({ marginTop }) => ({
  border: '10px solid black',
  background: 'rgba(0,0,0,0.5)',
  opacity: 1,
  transition: 'all 0.5s',
  '& .MuiPopover-paper': {
    marginTop,
    paddingTop: '25px',
    background: 'transparent',
    overflow: 'visible',
  },
}));

const ArrowBox = styled(Box)({
  minWidth: '300px',
  position: 'relative',
  padding: '25px',
  background: colors.white,
  border: `4px solid ${colors.white}`,
  borderRadius: '4px',
  '&:after, &:before': {
    bottom: '100%',
    left: '50%',
    border: 'solid transparent',
    content: '" "',
    height: 0,
    width: 0,
    position: 'absolute',
    pointerEvents: 'none',
  },
  '&:after': {
    borderColor: 'rgba(136, 183, 213, 0)',
    borderBottomColor: colors.white,
  },
  '&:before': {
    borderColor: 'rgba(194, 225, 245, 0)',
    borderBottomColor: colors.white,
    borderWidth: '20px',
    marginLeft: '-20px',
  },
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
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      marginTop={marginTop}>
      <ArrowBox component="div">{content}</ArrowBox>
    </StyledPopover>
  );
};
