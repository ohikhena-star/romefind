import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification, NotificationType } from '@/types/models';
import { nanoid } from 'nanoid';
import { api } from '@/api/client';

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  getUnreadCount: () => number;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      fetchNotifications: async () => {
        try {
          const remoteNotifs = await api.getNotifications();
          if (Array.isArray(remoteNotifs)) {
            set({
              notifications: remoteNotifs.map((n: any) => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: (n.type as NotificationType) || NotificationType.NewMatch,
                read: Boolean(n.read),
                opportunityId: n.opportunityId || undefined,
                createdAt: n.createdAt
              }))
            });
          }
        } catch (e) {
          // keep local fallback
        }
      },

      addNotification: (notif) => {
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: nanoid(),
              createdAt: new Date().toISOString(),
              read: false
            },
            ...state.notifications
          ]
        }));
      },

      markAsRead: async (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));

        try {
          await api.markNotificationRead(id);
        } catch (e) {
          // ignore
        }
      },

      markAllAsRead: async () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));

        try {
          await api.markAllNotificationsRead();
        } catch (e) {
          // ignore
        }
      },

      deleteNotification: async (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));

        try {
          await api.deleteNotification(id);
        } catch (e) {
          // ignore
        }
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },

      clearAll: async () => {
        set({ notifications: [] });

        try {
          await api.deleteAllNotifications();
        } catch (e) {
          // ignore
        }
      }
    }),
    {
      name: 'romefind-notifications-storage'
    }
  )
);
