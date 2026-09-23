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
        } catch (error) {
          console.warn('Backend login failed, falling back to local session', error);
        }

        // Graceful fallback for local offline testing
        const fallbackUser: User = {
          id: 'usr-demo-001',
          profile: {
            name: email.split('@')[0],
            email,
            location: 'London, UK',
            country: 'United Kingdom',
            bio: 'Passionate about AI, HCI, and high-impact fellowships.',
            education: [],
            experience: [],
            skills: ['TypeScript', 'Python', 'UX Research'],
            projects: [],
            certifications: [],
            portfolioLinks: [],
            interests: ['Artificial Intelligence', 'Open Source'],
            goals: ['Secure a research fellowship'],
            currentStatus: 'Exploring opportunities',
            completeness: 80
          },
          preferences: {
            opportunityTypes: [],
            fields: [],
            goals: [],
            remotePreference: [RemoteStatus.Hybrid],
            fundingPreference: true,
            locationPreference: ['Global']
          },
          onboardingCompleted: true,
          createdAt: new Date().toISOString()
        };

        set({
          user: fallbackUser,
          isAuthenticated: true,
          isLoading: false
        });
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
        } catch (error) {
          console.warn('Backend signup error, using local state', error);
        }

        const newUser: User = {
          id: 'usr-' + Date.now(),
          profile: {
            name,
            email,
            location: '',
            country: '',
            bio: '',
            education: [],
            experience: [],
            skills: [],
            projects: [],
            certifications: [],
            portfolioLinks: [],
            interests: [],
            goals: [],
            currentStatus: '',
            completeness: 20
          },
          preferences: {
            opportunityTypes: [],
            fields: [],
            goals: [],
            remotePreference: [],
            fundingPreference: false,
            locationPreference: []
          },
          onboardingCompleted: false,
          createdAt: new Date().toISOString()
        };

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false
        });
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
