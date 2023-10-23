import { Alert, CustomTheme, Snackbar, useTheme } from '@mui/material';

import { useNotification } from '#/src/hooks/useNotification';
import { getHeaderHeight } from '#/src/theme';

export const Notification = () => {
  const { isOpen, closeNotification, content, severity, clearTimeout, resetTimeout } =
    useNotification();
  const theme = useTheme();

  return (
    <Snackbar
      sx={{
        marginTop: `${getHeaderHeight(theme as CustomTheme)}px`,
      }}
      onMouseEnter={clearTimeout}
      onMouseLeave={resetTimeout}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={null}
      open={isOpen}>
      <Alert variant="filled" severity={severity} onClose={closeNotification}>
        {content}
      </Alert>
    </Snackbar>
  );
};
