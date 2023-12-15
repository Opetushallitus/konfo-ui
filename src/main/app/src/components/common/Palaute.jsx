import React, { useState } from 'react';

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
import { useTranslation } from 'react-i18next';

import { sendPalaute } from '#/src/api/konfoApi';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const StyledDialog = styled(Dialog)({
  margin: 0,
  '& .MuiBackdrop-root': {
    background: 'rgba(255,255,255,0.4)',
  },
});

const PalauteTextarea = styled(TextareaAutosize)({
  width: '100%',
  outline: 'none !important',
  border: '1px solid grey',
  fontSize: '16px',
  '&:focus-visible': {
    outline: 0,
  },
});

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const AnnaPalaute = ({ setPalauteAnnettu, onClose }) => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    arvosana: 0,
    arvosanaHover: null,
    palaute: '',
  });

  const handleSubmit = (event, arvosana, palaute) => {
    event.preventDefault();
    return sendPalaute({ arvosana, palaute });
  };
  const handleArvosanaHoverChange = (star) => setState({ ...state, arvosanaHover: star });
  const handleArvosanaChange = (evt, star) => {
    setState({ ...state, arvosana: star });
    evt.preventDefault();
  };
  const handlePalauteChange = (p) => setState({ ...state, palaute: p });

  return (
    <>
      <DialogContent>
        <DialogTitle>
          <Box mt={1}>
            <Typography align="center" variant="h1" component="h2">
              {t('palaute.otsikko')}
            </Typography>
          </Box>
          <IconButton
            aria-label={t('sulje')}
            sx={(theme) => ({
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(1),
              color: theme.palette.grey[500],
            })}
            onClick={onClose}>
            <MaterialIcon icon="close" />
          </IconButton>
        </DialogTitle>
        <Box
          display="flex"
          margin="auto"
          width="100%"
          alignItems="center"
          justifyContent="center"
          flexDirection="row"
          marginBottom={2}>
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
                sx={{ color: selected ? '#ffcc33' : '#979797' }}
                aria-label={t('palaute.tähti.' + star)}
                onMouseEnter={() => handleArvosanaHoverChange(star)}
                onMouseLeave={() => handleArvosanaHoverChange(null)}
                onClick={(e) => handleArvosanaChange(e, star)}
                component="span">
                <MaterialIcon icon="star" />
              </IconButton>
            );
          })}
        </Box>
        {state.arvosana ? (
          <PalauteTextarea
            aria-label={t('palaute.kommentti')}
            placeholder={t('palaute.kommentti')}
            minRows={5}
            onChange={(e) => handlePalauteChange(e.target.value)}
          />
        ) : null}
      </DialogContent>
      <StyledDialogActions>
        <Button
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
      </StyledDialogActions>
    </>
  );
};

const KiitosPalautteesta = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <DialogTitle>
        <Box mt={1}>
          <Typography align="center" variant="h1" component="h2">
            {t('palaute.kiitos')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <p className="palaute-form-paragraph">{t('palaute.vastaanotettu')}</p>
      </DialogContent>
      <StyledDialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          {t('palaute.palaa')}
        </Button>
      </StyledDialogActions>
    </>
  );
};

export const Palaute = ({ open, hide }) => {
  const { t } = useTranslation();
  const [palauteAnnettu, setPalauteAnnettu] = useState(false);

  const onClose = (event) => {
    hide();
    event.preventDefault();
  };

  return (
    <StyledDialog open={open} onClose={hide} aria-labelledby={t('palaute.otsikko')}>
      {palauteAnnettu ? (
        <KiitosPalautteesta onClose={onClose} />
      ) : (
        <AnnaPalaute setPalauteAnnettu={setPalauteAnnettu} onClose={onClose} />
      )}
    </StyledDialog>
  );
};
