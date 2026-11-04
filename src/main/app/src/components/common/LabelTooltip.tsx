import React, { useId, useRef, useState } from 'react';

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
    color: colors.grey900,
    paddingLeft: '16px',
    paddingRight: '35px', // Bigger to make space for close button
  },

  [`& .${classes.arrow}`]: {
    color: colors.white,
  },
}));

type Props = {
  title: React.JSX.Element | string;
  sx?: Record<string, string>;
};

export const LabelTooltip = ({ title, sx = {} }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();
  const handleClose = (e: React.SyntheticEvent<Element, Event> | Event) => {
    e.stopPropagation();
    setOpen(false);
  };
  // Return focus to the info button so that keyboard users don't lose their place on the page
  const closeAndRestoreFocus = (e: React.SyntheticEvent<Element, Event> | Event) => {
    handleClose(e);
    infoButtonRef.current?.focus();
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
        id={tooltipId}
        describeChild
        sx={sx}
        open={open}
        onClose={closeAndRestoreFocus}
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
              onClick={closeAndRestoreFocus}>
              <MaterialIcon icon="close" />
            </IconButton>
          </>
        }>
        <IconButton
          ref={infoButtonRef}
          aria-label={t('nayta-lisatiedot')}
          aria-expanded={open}
          aria-controls={open ? tooltipId : undefined}
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
