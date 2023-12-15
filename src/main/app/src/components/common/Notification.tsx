import { useEffect, useState } from 'react';

import { Alert, CustomTheme, Snackbar, useTheme } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
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

  const [hasBeenOpened, setHasBeenOpened] = useState<boolean>(false);

  useEffect(() => {
    if (previousPathname !== pathname) {
      closeNotification();
      setHasBeenOpened(false);
    } else if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen, pathname, previousPathname, closeNotification]);

  return (
    <Snackbar
      sx={{
        marginTop: `${getHeaderHeight(theme as CustomTheme)}px`,
        // Ruudunlukijoille on ongelmallista, jos notifikaatio poistetaan automaattisesti,
        // joten piilotetaan notifikaatio vain visuaalisesti.
        ...(isOpen ? {} : visuallyHidden),
      }}
      TransitionProps={{
        appear: false,
      }}
      onMouseEnter={clearTimeout}
      onMouseLeave={resetTimeout}
      onFocus={clearTimeout}
      onBlur={resetTimeout}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={null}
      // Notifikaatiota ei haluta ruudunlukijoillekaan luettavan sivun latauksessa,
      // joten asetetaan tämä true:ksi vasta kun notifikaatio avataan sivulla ensimmäisen kerran.
      open={hasBeenOpened}>
      <Alert variant="filled" severity={severity} onClose={closeNotification}>
        {content}
      </Alert>
    </Snackbar>
  );
};
