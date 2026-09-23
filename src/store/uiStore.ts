import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  onboardingStep: number; // 0-4, 0=not started, 4=complete
  searchOpen: boolean;
  
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnboardingStep: (step: number) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const applyThemeClass = (theme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      sidebarOpen: false,
      onboardingStep: 0,
      searchOpen: false,

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        applyThemeClass(newTheme);
        set({ theme: newTheme });
      },

      setTheme: (theme) => {
        applyThemeClass(theme);
        set({ theme });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setOnboardingStep: (step) => {
        set({ onboardingStep: step });
      },

      toggleSearch: () => {
        set((state) => ({ searchOpen: !state.searchOpen }));
      },

      setSearchOpen: (open) => {
        set({ searchOpen: open });
      }
    }),
    {
      name: 'romefind-ui-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme once rehydrated
        if (state) {
          applyThemeClass(state.theme);
        }
      }
    }
  )
);

export const useUiStore = useUIStore;
