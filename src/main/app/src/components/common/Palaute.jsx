import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Star from '@mui/icons-material/Star';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  TextareaAutosize,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { sendPalaute } from '#/src/api/konfoApi';

const PREFIX = 'Palaute';

const classes = {
  fullWidth: `${PREFIX}-fullWidth`,
  textarea: `${PREFIX}-textarea`,
  button: `${PREFIX}-button`,
  stars: `${PREFIX}-stars`,
  star: `${PREFIX}-star`,
  starSelected: `${PREFIX}-starSelected`,
  closeButton: `${PREFIX}-closeButton`,
  backDrop: `${PREFIX}-backDrop`,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.fullWidth}`]: {
    margin: '0',
  },

  [`& .${classes.textarea}`]: {
    width: '100%',
    outline: 'none !important',
    border: '1px solid grey',
    fontSize: '16px',
  },

  [`& .${classes.button}`]: {
    textTransform: 'none',
    borderRadius: 0,
    paddingLeft: '30px',
    paddingRight: '30px',
  },

  [`& .${classes.stars}`]: {
    display: 'flex',
    margin: 'auto',
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  [`& .${classes.star}`]: {
    color: '#979797',
  },

  [`& .${classes.starSelected}`]: {
    color: '#ffcc33',
  },

  [`& .${classes.closeButton}`]: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },

  [`& .${classes.backDrop}`]: {
    background: 'rgba(255,255,255,0.4)',
  },
}));

export const Palaute = (props) => {
  const { t } = useTranslation();
  const [palauteAnnettu, setPalauteAnnettu] = useState(false);
  const { open, hide } = props;
  const palaa = (event) => {
    hide();
    event.preventDefault();
  };

  const AnnaPalaute = () => {
    const [state, setState] = useState({
      arvosana: 0,
      arvosanaHover: null,
      palaute: '',
    });

    const handleSubmit = (event, arvosana, palaute) => {
      event.preventDefault();
      return sendPalaute({ arvosana, palaute });
    };
    const handleArvosanaHoverChange = (star) =>
      setState({ ...state, arvosanaHover: star });
    const handleArvosanaChange = (evt, star) => {
      setState({ ...state, arvosana: star });
      evt.preventDefault();
    };
    const handlePalauteChange = (p) => setState({ ...state, palaute: p });

    return (
      <React.Fragment>
        <DialogContent>
          <DialogTitle disableTypography>
            <Box mt={1}>
              <Typography align="center" variant="h1" component="h2">
                {t('palaute.otsikko')}
              </Typography>
            </Box>
            <IconButton aria-label="close" className={classes.closeButton} onClick={hide}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <div className={classes.stars}>
            {[1, 2, 3, 4, 5].map((star) => {
              const selected =
                (state.arvosanaHover && state.arvosanaHover >= star) ||
                state.arvosana >= star
                  ? 'palaute-form-star-selected'
                  : null;
              return (
                <IconButton
                  key={'star-' + star}
                  color="primary"
                  className={selected ? classes.starSelected : classes.star}
                  aria-label={t('palaute.tähti.' + star)}
                  onMouseEnter={() => handleArvosanaHoverChange(star)}
                  onMouseLeave={() => handleArvosanaHoverChange(null)}
                  onClick={(e) => handleArvosanaChange(e, star)}
                  component="span">
                  <Star />
                </IconButton>
              );
            })}
          </div>
          {state.arvosana ? (
            <React.Fragment>
              <div className="palaute-form-comment">
                <TextareaAutosize
                  aria-label={t('palaute.kommentti')}
                  placeholder={t('palaute.kommentti')}
                  rowsMin={5}
                  className={classes.textarea}
                  onChange={(e) => handlePalauteChange(e.target.value)}
                />
              </div>
            </React.Fragment>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.button}
            variant="contained"
            disabled={!state.arvosana}
            color="primary"
            onClick={(event) =>
              handleSubmit(event, state.arvosana, state.palaute).then(() =>
                setPalauteAnnettu(true)
              )
            }>
            {t('palaute.lähetä')}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  };

  const KiitosPalautteesta = () => {
    return (
      <React.Fragment>
        <DialogTitle disableTypography>
          <Box mt={1}>
            <Typography align="center" variant="h1" component="h2">
              {t('palaute.kiitos')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <p className="palaute-form-paragraph">{t('palaute.vastaanotettu')}</p>
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={palaa}>
            {t('palaute.palaa')}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  };

  return (
    <StyledDialog
      classes={{ paper: classes.fullWidth }}
      BackdropProps={{
        classes: {
          root: classes.backDrop,
        },
      }}
      open={open}
      onClose={hide}
      aria-labelledby={t('palaute.otsikko')}>
      {palauteAnnettu ? <KiitosPalautteesta /> : <AnnaPalaute />}
    </StyledDialog>
  );
};
