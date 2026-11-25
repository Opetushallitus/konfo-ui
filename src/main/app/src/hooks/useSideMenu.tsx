import { useCallback } from 'react';
import { useIsSideMenuOpen } from '../store/reducers/appSlice';
import { useMediaQuery, useTheme } from '@mui/system';

export const useSideMenu = () => {
  const theme = useTheme();

  const [isSideMenuOpen, setIsSideMenuOpen] = useIsSideMenuOpen();

  const toggleMenu = useCallback(() => {
    setIsSideMenuOpen(!isSideMenuOpen);
  }, [isSideMenuOpen, setIsSideMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsSideMenuOpen(false);
  }, [setIsSideMenuOpen]);

  // Alle Full HD -leveydellä valikko avautuu sisällön päälle eikä vie tilaa sisällöltä
  const isMenuOverlay = useMediaQuery(theme.breakpoints.down('xxl'));

  return {
    isMenuOpen: isSideMenuOpen,
    isMenuOverlay,
    toggleMenu,
    closeMenu,
  };
};
