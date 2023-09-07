import React, { useState } from 'react';

import { Backdrop, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const PREFIX = 'LabelTooltip';

const classes = {
  backDrop: `${PREFIX}-backDrop`,
  closeIcon: `${PREFIX}-closeIcon`,
  tooltip: `${PREFIX}-tooltip`,
  arrow: `${PREFIX}-arrow`,
};

const Root = styled('div')(() => ({
  [`& .${classes.backDrop}`]: {
    zIndex: 999,
  },

  [`& .${classes.closeIcon}`]: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    padding: 0,
    minHeight: 0,
    minWidth: 0,
  },

  [`& .${classes.tooltip}`]: {
    backgroundColor: colors.white,
    cursor: 'auto',
    userSelect: 'all',
    color: colors.black,
    paddingLeft: '16px',
    paddingRight: '35px', // Bigger to make space for close button
  },

  [`& .${classes.arrow}`]: {
    color: colors.white,
  },
}));

type Props = {
  title: JSX.Element | string;
  sx?: Record<string, string>;
};

export const LabelTooltip = ({ title, sx = {} }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleClose = (e: React.SyntheticEvent<Element, Event> | Event) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <Root>
      <Backdrop
        className={classes.backDrop}
        open={open}
        onClick={handleClose}
        sx={{ cursor: 'auto' }}
      />
      <Tooltip
        sx={sx}
        open={open}
        onClose={handleClose}
        PopperProps={{
          disablePortal: true,
          onClick: (e) => e.stopPropagation(),
        }}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        classes={{
          tooltip: classes.tooltip,
          arrow: classes.arrow,
        }}
        arrow
        title={
          <>
            {title}
            <IconButton
              aria-label={t('sulje')}
              className={classes.closeIcon}
              onClick={handleClose}>
              <MaterialIcon icon="close" />
            </IconButton>
          </>
        }>
        <IconButton
          aria-label={t('nayta-lisatiedot')}
          sx={{ padding: 0, minHeight: 0, minWidth: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((isOpen) => !isOpen);
          }}
          onFocus={(e) => e.stopPropagation()}>
          <MaterialIcon icon="info" variant="outlined" />
        </IconButton>
      </Tooltip>
    </Root>
  );
};
