import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Backdrop, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';

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

  [`& .${classes.closeIcon}`]: { position: 'absolute', top: '5px', right: '5px' },

  [`& .${classes.tooltip}`]: {
    backgroundColor: colors.white,
    color: colors.black,
    paddingLeft: '16px',
    paddingRight: '35px', // Bigger to make space for close button
  },

  [`& .${classes.arrow}`]: {
    color: colors.white,
  },
}));

type Props = { title: JSX.Element | string };

export const LabelTooltip = ({ title }: Props) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((isOpen) => !isOpen);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Root>
      <Backdrop className={classes.backDrop} open={open} onClick={handleClose} />
      <Tooltip
        open={open}
        onClose={handleClose}
        PopperProps={{
          disablePortal: true,
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
              style={{ padding: 0, minHeight: 0, minWidth: 0 }}
              onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </>
        }>
        <IconButton
          aria-label={t('nayta-lisatiedot')}
          style={{ padding: 0, minHeight: 0, minWidth: 0 }}
          onClick={handleClick}>
          <InfoOutlined />
        </IconButton>
      </Tooltip>
    </Root>
  );
};
