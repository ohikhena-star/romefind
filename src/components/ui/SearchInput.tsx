import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) | ((value: string) => void);
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, placeholder = 'Search...', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') {
        // Pass standard event
        (onChange as any)(e);
      }
    };

    return (
      <div className={cn("relative w-full", className)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-surface-300 bg-white py-2 pl-10 pr-10 text-sm shadow-sm placeholder:text-surface-400 focus:border-rome-500 focus:outline-none focus:ring-1 focus:ring-rome-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-500 transition-colors"
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 focus:outline-none focus:text-surface-600 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';
