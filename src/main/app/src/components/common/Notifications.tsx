import { useEffect, useState } from 'react';

import { Alert, Box, CustomTheme, Snackbar, useTheme } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useLocation } from 'react-router-dom';
import { usePrevious } from 'react-use';

import { useNotifications } from '#/src/hooks/useNotifications';
import { getHeaderHeight } from '#/src/theme';

export const Notifications = () => {
  const {
    notifications,
    closeNotification,
    closeNotifications,
    clearTimeouts,
    resetTimeouts,
  } = useNotifications();
  const theme = useTheme();

  const { pathname } = useLocation();
  const previousPathname = usePrevious(pathname);

  const [hasBeenOpened, setHasBeenOpened] = useState<boolean>(false);
  useEffect(() => {
    if (previousPathname !== pathname) {
      closeNotifications();
      setHasBeenOpened(false);
    } else if (notifications.length > 0) {
      setHasBeenOpened(true);
    }
  }, [notifications, pathname, previousPathname, closeNotifications]);

  return (
    <Snackbar
      sx={{
        marginTop: `${getHeaderHeight(theme as CustomTheme)}px`,
        // Ruudunlukijoille on ongelmallista, jos notifikaatio poistetaan automaattisesti,
        // joten piilotetaan notifikaatio vain visuaalisesti.
        ...(notifications.length > 0 ? {} : visuallyHidden),
      }}
      TransitionProps={{
        appear: false,
      }}
      onMouseEnter={clearTimeouts}
      onMouseLeave={resetTimeouts}
      onFocus={clearTimeouts}
      onBlur={resetTimeouts}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={null}
      // Notifikaatiota ei haluta ruudunlukijoillekaan luettavan sivun latauksessa,
      // joten asetetaan tämä true:ksi vasta kun notifikaatio avataan sivulla ensimmäisen kerran.
      open={hasBeenOpened}>
      <Box display="flex" flexDirection="column" gap={theme.spacing(2)}>
        {notifications.map((n) => (
          <Alert
            key={n.id}
            variant="filled"
            severity={n.severity}
            onClose={() => closeNotification(n.id)}>
            {n.content}
          </Alert>
        ))}
      </Box>
    </Snackbar>
  );
};
