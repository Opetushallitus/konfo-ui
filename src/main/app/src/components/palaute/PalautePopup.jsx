import { useState } from 'react';

import { Fab, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { Palaute } from '#/src/components/common/Palaute';
import { styled } from '#/src/theme';

const CloseButton = styled(IconButton)(({ theme }) => ({
  padding: '0',
  position: 'absolute',
  right: '0',
  top: '0',
  color: theme.palette.grey[500],
}));

const TooltipBox = styled('span')({
  cursor: 'pointer',
  lineHeight: '17px',
  width: '140px',
  padding: '12px 12px 18px 12px',
  fontSize: '12px',
  flex: '1',
  position: 'relative',
  background: colors.white,
  color: colors.grey900,
  border: '1px solid #e0e1dd',
  marginBottom: '8px',
});

const Container = styled('div')({
  position: 'fixed',
  bottom: '15px',
  right: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

export const PalautePopup = () => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(true);
  const [hover, setHover] = useState(false);

  return (
    <div role="complementary">
      <Container>
        {tooltip || hover ? (
          <TooltipBox onClick={() => setTooltip(false)}>
            {tooltip ? (
              <CloseButton aria-label={t('palaute.sulje')} onClick={() => setShow(false)}>
                <MaterialIcon icon="close" />
              </CloseButton>
            ) : null}
            {t('palaute.anna-palautetta')}
          </TooltipBox>
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
          <MaterialIcon
            icon="sentiment_satisfied"
            sx={{
              width: '48px',
              height: '48px',
            }}
          />
        </Fab>
      </Container>
      {show ? <Palaute open={true} hide={() => setShow(false)} /> : null}
    </div>
  );
};
