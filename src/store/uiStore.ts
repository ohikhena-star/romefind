import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  onboardingStep: number; // 0-4, 0=not started, 4=complete
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  hasSeenProductTour: boolean;
  tourOpen: boolean;
  tourStep: number; // 0 to 6
  recentSearches: string[];
  
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnboardingStep: (step: number) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  startTour: () => void;
  endTour: () => void;
  setTourStep: (step: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  resetTour: () => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
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
      mobileMenuOpen: false,
      hasSeenProductTour: false,
      tourOpen: false,
      tourStep: 0,
      recentSearches: [],

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
      },

      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },

      startTour: () => {
        set({ tourOpen: true, tourStep: 0 });
      },

      endTour: () => {
        set({ tourOpen: false, hasSeenProductTour: true, mobileMenuOpen: false });
      },

      setTourStep: (step: number) => {
        set({ tourStep: step });
      },

      nextTourStep: () => {
        const next = get().tourStep + 1;
        if (next > 6) {
          get().endTour();
        } else {
          set({ tourStep: next });
        }
      },

      prevTourStep: () => {
        set((state) => ({ tourStep: Math.max(0, state.tourStep - 1) }));
      },

      resetTour: () => {
        set({ hasSeenProductTour: false, tourOpen: true, tourStep: 0 });
      },

      addRecentSearch: (query: string) => {
        const clean = (query || '').trim();
        if (!clean || clean.length < 2) return;
        const current = get().recentSearches || [];
        // Filter out case-insensitive duplicates and limit to 10
        const filtered = current.filter(item => item.toLowerCase() !== clean.toLowerCase());
        set({ recentSearches: [clean, ...filtered].slice(0, 10) });
      },

      removeRecentSearch: (query: string) => {
        const current = get().recentSearches || [];
        set({ recentSearches: current.filter(item => item.toLowerCase() !== (query || '').trim().toLowerCase()) });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
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

// Subscribe to any theme changes and keep root DOM class in sync
useUIStore.subscribe((state) => {
  applyThemeClass(state.theme);
});

// Initial synchronous application
if (typeof document !== 'undefined') {
  applyThemeClass(useUIStore.getState().theme);
}

export const useUiStore = useUIStore;
