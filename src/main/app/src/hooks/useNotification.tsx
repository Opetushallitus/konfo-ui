import React from 'react';

import { AlertColor } from '@mui/material';
import { create } from 'zustand';

const NOTIFICATION_TIMEOUT = 5000;

const resetNotificationState = (s: NotificationStore) => ({
  ...s,
  isOpen: false,
  content: undefined,
  timeoutId: undefined,
});

type NotificationStore = {
  isOpen: boolean;
  content?: React.JSX.Element;
  severity: AlertColor;
  timeoutId?: any;
  closeNotification: () => void;
  showNotification: (x: { content: React.JSX.Element; severity: AlertColor }) => void;
  clearTimeout: () => void;
  resetTimeout: () => void;
};

export const useNotification = create<NotificationStore>((set) => ({
  isOpen: false,
  severity: 'success',
  closeNotification: () =>
    set((state) => {
      clearTimeout(state.timeoutId);
      return resetNotificationState(state);
    }),
  clearTimeout: () =>
    set((state) => {
      clearTimeout(state.timeoutId);
      return { ...state, timeoutId: undefined };
    }),
  resetTimeout: () =>
    set((state) => {
      clearTimeout(state.timeoutId);
      return {
        ...state,
        timeoutId: setTimeout(() => set(resetNotificationState), NOTIFICATION_TIMEOUT),
      };
    }),
  showNotification: ({ content, severity }) =>
    set((state) => {
      clearTimeout(state.timeoutId);
      return {
        ...state,
        content,
        severity,
        isOpen: true,
        timeoutId: setTimeout(() => set(resetNotificationState), NOTIFICATION_TIMEOUT),
      };
    }),
}));
