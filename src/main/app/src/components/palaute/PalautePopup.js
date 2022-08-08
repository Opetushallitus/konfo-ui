import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SentimentSatisfied from '@material-ui/icons/SentimentSatisfied';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import Palaute from '#/src/components/common/Palaute';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    padding: '0',
    position: 'absolute',
    right: '0',
    top: '0',
    color: theme.palette.grey[500],
  },
  container: {
    position: 'fixed',
    bottom: '15px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  box: {
    cursor: 'pointer',
    lineHeight: '17px',
    width: '140px',
    padding: '12px 12px 18px 12px',
    fontSize: '12px',
    flex: '1',
    position: 'relative',
    background: colors.white,
    color: colors.black,
    border: '1px solid #e0e1dd',
    marginBottom: '8px',
  },
  popup: {
    width: '48px',
    height: '48px',
  },
}));

export const PalautePopup = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(true);
  const [hover, setHover] = useState(false);

  return (
    <React.Fragment>
      <div className={classes.container}>
        {tooltip || hover ? (
          <span onClick={() => setTooltip(false)} className={classes.box}>
            {tooltip ? (
              <IconButton
                aria-label={t('palaute.sulje')}
                className={classes.closeButton}
                onClick={() => setShow(false)}>
                <CloseIcon />
              </IconButton>
            ) : null}
            {t('palaute.anna-palautetta')}
          </span>
        ) : null}

        <Fab
          color="secondary"
          aria-label={t('palaute.anna-palautetta')}
          onClick={() => setShow(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <SentimentSatisfied className={classes.popup} />
        </Fab>
      </div>
      {show ? <Palaute open={true} hide={() => setShow(false)} /> : null}
    </React.Fragment>
  );
};
