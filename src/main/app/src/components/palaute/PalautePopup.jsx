import React, { useState } from 'react';

import { Fab, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Palaute } from '#/src/components/common/Palaute';
import { styled } from '#/src/theme';

const PREFIX = 'PalautePopup';

const classes = {
  closeButton: `${PREFIX}-closeButton`,
  container: `${PREFIX}-container`,
  box: `${PREFIX}-box`,
  popup: `${PREFIX}-popup`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.closeButton}`]: {
    padding: '0',
    position: 'absolute',
    right: '0',
    top: '0',
    color: theme.palette.grey[500],
  },

  [`& .${classes.container}`]: {
    position: 'fixed',
    bottom: '15px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  [`& .${classes.box}`]: {
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

  [`& .${classes.popup}`]: {
    width: '48px',
    height: '48px',
  },
}));

export const PalautePopup = () => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(true);
  const [hover, setHover] = useState(false);

  return (
    <Root>
      <div className={classes.container}>
        {tooltip || hover ? (
          <span onClick={() => setTooltip(false)} className={classes.box}>
            {tooltip ? (
              <IconButton
                aria-label={t('palaute.sulje')}
                className={classes.closeButton}
                onClick={() => setShow(false)}>
                <MaterialIcon icon="close" />
              </IconButton>
            ) : null}
            {t('palaute.anna-palautetta')}
          </span>
        ) : null}

        <Fab
          sx={{
            '&.Mui-focusVisible': {
              outline: '2px solid black',
            },
          }}
          color="secondary"
          aria-label={t('palaute.anna-palautetta')}
          onClick={() => setShow(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <MaterialIcon icon="sentiment_satisfied" className={classes.popup} />
        </Fab>
      </div>
      {show ? <Palaute open={true} hide={() => setShow(false)} /> : null}
    </Root>
  );
};
