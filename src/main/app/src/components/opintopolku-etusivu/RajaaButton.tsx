// Uuden etusivun rajaa-painike ja rajainvalinnat. Isoilla näytöillä rajaimet avautuvat popoveriin
// (kuten nykyisellä etusivulla), pienillä näytöillä alhaalta avautuvaan laatikkoon (drawer).
import React from 'react';

import { Badge, Box, Button, CircularProgress, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useMediaQuery, useTheme } from '@mui/system';
import { match, P } from 'ts-pattern';

export const RAJAIMET_POPOVER_ID = 'filters-popover';

// Rajaa-painike hakukentän sisällä oikealla. Näkyy kaikilla näytöillä, ja badge näyttää valittujen
// rajainten määrän. Matala, jotta se ei kasvata hakukentän korkeutta.
export const RajaaButton = ({
  isOpen,
  isLoading,
  selectedCount,
  onClick,
}: {
  isOpen: boolean;
  isLoading: boolean;
  selectedCount: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const endIcon = match([isLoading, isSmallScreen])
    .with([true, P.any], () => <CircularProgress size={20} color="inherit" />)
    .with([P.any, true], () => (
      <Badge badgeContent={selectedCount} showZero={false} color="error">
        <MaterialIcon icon="filter_list" />
      </Badge>
    ))
    .with([P.any, false], () => (
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
    ))
    .otherwise(() => null);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {!isSmallScreen && <Divider orientation="vertical" flexItem />}
      <Button
        aria-describedby={RAJAIMET_POPOVER_ID}
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
