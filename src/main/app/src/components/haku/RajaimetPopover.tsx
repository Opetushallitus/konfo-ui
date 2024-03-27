import { Box, Button, CircularProgress, Divider, Hidden, Popover } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

import { HakupalkkiFilters } from './HakupalkkiFilters';

const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    paddingTop: '10px',
    background: 'transparent',
  },
}));

const ArrowBox = styled(Box)(() => ({
  position: 'relative',
  background: colors.white,
  border: `4px solid ${colors.white}`,
  borderRadius: '4px',
  '&:after, &:before': {
    bottom: '100%',
    left: '50%',
    border: 'solid transparent',
    position: 'absolute',
    pointerEvents: 'none',
  },
}));

const POPOVER_ID = 'filters-popover';

export const RajaaPopoverButton = ({
  isPopoverOpen,
  isLoading,
  setAnchorEl,
}: {
  isPopoverOpen: boolean;
  isLoading: boolean;
  setAnchorEl: (el: HTMLButtonElement) => void;
}) => {
  const { t } = useTranslation();

  const handleDesktopBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <Hidden mdDown>
      <Box
        component="div"
        sx={{
          borderLeft: `2px solid ${colors.grey500}`,
          paddingLeft: '10px',
          marginLeft: '10px',
        }}>
        <Divider orientation="vertical" />
        <Button
          aria-describedby={POPOVER_ID}
          endIcon={
            isLoading ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              <MaterialIcon icon={isPopoverOpen ? 'expand_less' : 'expand_more'} />
            )
          }
          onClick={handleDesktopBtnClick}
          sx={{
            height: '40px',
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '16px',
            textAlign: 'center',
          }}>
          {t('haku.rajaa')}
        </Button>
      </Box>
    </Hidden>
  );
};

export const RajaimetPopover = ({
  anchorEl,
  setAnchorEl,
}: {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: (el: HTMLButtonElement | null) => void;
}) => {
  const isPopoverOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Hidden mdDown>
      <StyledPopover
        id={POPOVER_ID}
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <ArrowBox component="div">
          <HakupalkkiFilters />
        </ArrowBox>
      </StyledPopover>
    </Hidden>
  );
};
