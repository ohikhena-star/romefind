import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

export interface ToggleProps {
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useUIStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-100 text-surface-600 transition-colors hover:bg-surface-200 hover:text-surface-900 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700 dark:hover:text-surface-100 focus:outline-none focus:ring-2 focus:ring-rome-500",
        className
      )}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative h-5 w-5">
        <Sun 
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out",
            isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out",
            isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          )} 
        />
      </div>
    </button>
  );
};
