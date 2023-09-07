import React from 'react';

import { Box, Popover } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const PREFIX = 'PopoverWithArrow';

const classes = {
  popoverRoot: `${PREFIX}-popoverRoot`,
  arrowBox: `${PREFIX}-arrowBox`,
  popoverPaper: `${PREFIX}-popoverPaper`,
};

const StyledPopover = styled(Popover)((props) => ({
  [`& .${classes.popoverRoot}`]: {
    border: '10px solid black',
    background: 'rgba(0,0,0,0.5)',
    opacity: 1,
    transition: 'all 0.5s',
  },

  [`& .${classes.arrowBox}`]: {
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
  },

  [`& .${classes.popoverPaper}`]: {
    marginTop: props.marginTop,
    paddingTop: '25px',
    background: 'transparent',
    overflow: 'visible',
  },
}));

export const PopoverWithArrow = ({ anchorEl, content, marginTop, onClose, open }) => {
  return (
    <StyledPopover
      classes={{ paper: classes.popoverPaper, root: classes.popoverRoot }}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      marginTop={marginTop}>
      <Box component="div" className={classes.arrowBox}>
        {content}
      </Box>
    </StyledPopover>
  );
};
