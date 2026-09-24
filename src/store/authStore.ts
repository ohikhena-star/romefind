import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, RemoteStatus } from '@/types/models';
import { api } from '@/api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  syncProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password?: string) => {
        set({ isLoading: true });
        try {
          const res = await api.login({ email, password: password || 'password123' });
          if (res?.user) {
            set({
              user: res.user,
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }
          throw new Error('Invalid response from server');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const res = await api.register({ email, password, name });
          if (res?.user) {
            set({
              user: res.user,
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }
          throw new Error('Invalid response from server');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        api.logout().catch(() => {});
        set({ user: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('romefind-notifications-storage');
        }
      },

      updateUser: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          ...updates,
          profile: {
            ...user.profile,
            ...(updates.profile || {})
          },
          preferences: {
            ...user.preferences,
            ...(updates.preferences || {})
          }
        };

        set({ user: updatedUser });

        try {
          await api.updateProfile({
            profile: updatedUser.profile,
            preferences: updatedUser.preferences,
            onboardingCompleted: updatedUser.onboardingCompleted
          });
        } catch (error) {
          console.warn('Failed to persist profile update to backend', error);
        }
      },

      syncProfile: async () => {
        try {
          const res = await api.getProfile();
          if (res?.profile) {
            const { user } = get();
            if (user) {
              set({
                user: {
                  ...user,
                  profile: res.profile,
                  preferences: res.preferences || user.preferences
                }
              });
            }
          }
        } catch (e) {
          // ignore if unauthenticated
        }
      }
    }),
    {
      name: 'romefind-auth-storage'
    }
  )
);
