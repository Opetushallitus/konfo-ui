import { Badge, Box, Button, CircularProgress, Divider, Popover } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

import { HakupalkkiFilters } from './HakupalkkiFilters';

const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    // Sivuilla ja alhaalla tilaa ArrowBoxin varjolle, ettei paperin overflow leikkaa sitä
    padding: '10px 8px 8px',
    background: 'transparent',
  },
}));

const ArrowBox = styled(Box)(() => ({
  position: 'relative',
  background: colors.white,
  border: `4px solid ${colors.white}`,
  borderRadius: '4px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  '&:after, &:before': {
    bottom: '100%',
    left: '50%',
    border: 'solid transparent',
    position: 'absolute',
    pointerEvents: 'none',
  },
}));

const POPOVER_ID = 'filters-popover';

// Valittujen rajainten määrä ilman lapsielementtiä: badge normaalissa virrassa kuvakkeen tavoin
// (ei kulmassa)
const InlineBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <Badge
      badgeContent={count}
      color="error"
      sx={{
        alignItems: 'center',
        '& .MuiBadge-badge': {
          position: 'static',
          transform: 'none',
          marginRight: '2px',
        },
      }}
    />
  ) : null;

// default: Konfon etusivun rajaa-painike hakukentän vieressä
// oph: uuden etusivun rajaa-painike hakukentän sisällä. Valittujen rajainten määrä badgena ja
// ei pystysuuntaista paddingia, jotta painike ei kasvata hakukentän korkeutta.
export const RajaaPopoverButton = ({
  isPopoverOpen,
  isLoading,
  setAnchorEl,
  variant = 'default',
  selectedCount = 0,
}: {
  isPopoverOpen: boolean;
  isLoading: boolean;
  setAnchorEl: (el: HTMLButtonElement) => void;
  variant?: 'default' | 'oph';
  selectedCount?: number;
}) => {
  const { t } = useTranslation();
  const isOph = variant === 'oph';

  return (
    <Box
      sx={
        isOph
          ? { display: 'flex', alignItems: 'center' }
          : {
              borderLeft: `2px solid ${colors.grey500}`,
              paddingLeft: '10px',
              marginLeft: '10px',
              display: { xs: 'none', md: 'block' },
            }
      }>
      <Divider orientation="vertical" flexItem={isOph} />
      <Button
        aria-describedby={POPOVER_ID}
        aria-expanded={isPopoverOpen}
        endIcon={
          isLoading ? (
            <CircularProgress size={25} color="inherit" />
          ) : (
            <>
              {isOph && <InlineBadge count={selectedCount} />}
              <MaterialIcon icon={isPopoverOpen ? 'expand_less' : 'expand_more'} />
            </>
          )
        }
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={
          isOph
            ? { fontWeight: 600, paddingY: 0, marginY: 0 }
            : {
                height: '40px',
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '16px',
                textAlign: 'center',
              }
        }>
        {isOph ? t('opintopolku-etusivu.rajaa-etsimaasi') : t('haku.rajaa')}
      </Button>
    </Box>
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
      }}
      sx={{ display: { xs: 'none', md: 'block' } }}>
      <ArrowBox>
        <HakupalkkiFilters />
      </ArrowBox>
    </StyledPopover>
  );
};
