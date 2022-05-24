import React from 'react';

import { Box, makeStyles, Popover } from '@material-ui/core';

import { colors } from '#/src/colors';

const PopoverWithArrow = ({ anchorEl, content, id, marginTop, onClose, open }) => {
  const useStyles = makeStyles(() => ({
    popoverRoot: {
      border: '10px solid black',
      background: 'rgba(0,0,0,0.5)',
      opacity: 1,
      transition: 'all 0.5s',
    },
    arrowBox: {
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
    popoverPaper: {
      marginTop: marginTop,
      paddingTop: '25px',
      background: 'transparent',
      overflow: 'visible',
    },
  }));
  const classes = useStyles();

  return (
    <Popover
      classes={{ paper: classes.popoverPaper, root: classes.popoverRoot }}
      id={id}
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
      }}>
      <Box component="div" className={classes.arrowBox}>
        {content}
      </Box>
    </Popover>
  );
};

export default PopoverWithArrow;
