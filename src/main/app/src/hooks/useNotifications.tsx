import { AlertColor } from '@mui/material';
import { create } from 'zustand';

const NOTIFICATION_TIMEOUT = 5000;
const MAX_NOTIFICATIONS = 5;

interface NotificationItem {
  id: number;
  content?: React.JSX.Element;
  severity: AlertColor;
  timeoutId?: number;
}

interface NotificationStore {
  notifications: Array<NotificationItem>;
  idSeq: number;
  closeNotification: (id: number) => void;
  showNotification: (x: { content: React.JSX.Element; severity: AlertColor }) => void;
  closeNotifications: () => void;
  clearTimeouts: () => void;
  resetTimeouts: () => void;
}

const notificationsWithoutIds = (
  notifications: Array<NotificationItem>,
  ids: Array<number>
) => notifications.filter((n) => !ids.includes(n.id));

const deleteNotificationsFromList = (s: NotificationStore, ids: Array<number>) => ({
  ...s,
  notifications: [...notificationsWithoutIds(s.notifications, ids)],
});

export const useNotifications = create<NotificationStore>((set) => ({
  idSeq: 0,
  notifications: [],
  closeNotification: (id: number) =>
    set((state) => {
      clearTimeout(state.notifications.find((n) => n.id === id)?.timeoutId);
      return deleteNotificationsFromList(state, [id]);
    }),
  closeNotifications: () =>
    set((state) => {
      state.notifications.forEach((n) => clearTimeout(n.timeoutId));
      return { ...state, notifications: [] };
    }),
  clearTimeouts: () =>
    set((state) => {
      state.notifications.forEach((n) => clearTimeout(n.timeoutId));
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, timeoutId: undefined })),
      };
    }),
  resetTimeouts: () =>
    set((state) => {
      state.notifications.forEach((n) => clearTimeout(n.timeoutId));
      const allIds = state.notifications.map((n) => n.id);
      const newNotifications = state.notifications.map((n) => ({
        ...n,
        timeoutId:
          n.id === state.notifications[0].id
            ? window.setTimeout(
                () => set(deleteNotificationsFromList(state, allIds)),
                NOTIFICATION_TIMEOUT
              )
            : undefined,
      }));
      return {
        ...state,
        notifications: newNotifications,
      };
    }),
  showNotification: ({ content, severity }) =>
    set((state) => {
      let idToDelete = undefined;
      if (state.notifications.length === MAX_NOTIFICATIONS) {
        clearTimeout(state.notifications[0].timeoutId);
        idToDelete = state.notifications[0].id;
      }
      const newIdSeq = state.idSeq === Number.MAX_VALUE ? 0 : state.idSeq + 1;
      const existingNotifications = idToDelete
        ? notificationsWithoutIds(state.notifications, [idToDelete])
        : state.notifications;

      return {
        ...state,
        idSeq: newIdSeq,
        notifications: existingNotifications.concat([
          {
            id: newIdSeq,
            content,
            severity,
            timeoutId: window.setTimeout(
              () =>
                set((currState) => deleteNotificationsFromList(currState, [newIdSeq])),
              NOTIFICATION_TIMEOUT
            ),
          },
        ]),
      };
    }),
}));
