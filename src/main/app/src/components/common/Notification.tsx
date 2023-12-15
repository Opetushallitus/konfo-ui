import { useEffect } from 'react';

import { Alert, CustomTheme, Snackbar, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { usePrevious } from 'react-use';

import { useNotification } from '#/src/hooks/useNotification';
import { getHeaderHeight } from '#/src/theme';

export const Notification = () => {
  const { isOpen, closeNotification, content, severity, clearTimeout, resetTimeout } =
    useNotification();
  const theme = useTheme();

  const { pathname } = useLocation();
  const previousPathname = usePrevious(pathname);

  useEffect(() => {
    if (previousPathname !== pathname) {
      closeNotification();
    }
  }, [pathname, previousPathname, closeNotification]);

  return (
    <Snackbar
      sx={{
        marginTop: `${getHeaderHeight(theme as CustomTheme)}px`,
      }}
      onMouseEnter={clearTimeout}
      onMouseLeave={resetTimeout}
      onFocus={clearTimeout}
      onBlur={resetTimeout}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={null}
      open={isOpen}>
      <Alert variant="filled" severity={severity} onClose={closeNotification}>
        {content}
      </Alert>
    </Snackbar>
  );
};
