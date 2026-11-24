// Uuden etusivun rajaa-painike. Isoilla näytöillä rajaimet avautuvat popoveriin (kuten nykyisellä
// etusivulla), pienillä näytöillä alhaalta avautuvaan laatikkoon (drawer).
import React from 'react';

import { Badge, Box, Button, CircularProgress, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { POPOVER_ID } from '#/src/components/haku/RajaimetPopover';

// Isoilla näytöillä rajaa-painike on hakukentän sisällä oikealla, pienillä linkin vieressä. Badge
// näyttää valittujen rajainten määrän. Matala, jotta se ei kasvata hakukentän korkeutta.
export const RajaaButton = ({
  isOpen,
  isLoading,
  isSmall,
  selectedCount,
  onClick,
}: {
  isOpen: boolean;
  isLoading: boolean;
  isSmall: boolean;
  selectedCount: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { t } = useTranslation();

  const endIcon = isLoading ? (
    <CircularProgress size={20} color="inherit" />
  ) : isSmall ? (
    <Badge badgeContent={selectedCount} showZero={false} color="error">
      <MaterialIcon icon="filter_list" />
    </Badge>
  ) : (
    <>
      {selectedCount > 0 && (
        <Badge
          badgeContent={selectedCount}
          color="error"
          // Ilman lapsielementtiä: badge normaalissa virrassa kuvakkeen tavoin (ei kulmassa)
          sx={{
            alignItems: 'center',
            '& .MuiBadge-badge': {
              position: 'static',
              transform: 'none',
              marginRight: '2px',
            },
          }}
        />
      )}
      <MaterialIcon icon="expand_more" />
    </>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {!isSmall && <Divider orientation="vertical" flexItem />}
      <Button
        aria-describedby={POPOVER_ID}
        aria-expanded={isOpen}
        onClick={onClick}
        endIcon={endIcon}
        sx={{
          fontWeight: 600,
          // Normaalikokoinen painike, mutta ilman pystysuuntaista paddingia ja marginaalia, jotta
          // se ei kasvata hakukentän korkeutta
          paddingY: 0,
          marginY: 0,
        }}>
        {t('opintopolku-etusivu.rajaa-etsimaasi')}
      </Button>
    </Box>
  );
};
