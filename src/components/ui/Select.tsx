import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || Math.random().toString(36).substr(2, 9);

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-surface-900 dark:text-surface-100 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "appearance-none block w-full rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 py-2.5 pl-3.5 pr-10 text-sm text-surface-900 dark:text-surface-100 focus:border-rome-500 focus:outline-none focus:ring-2 focus:ring-rome-500/50 transition-all h-11 min-h-[44px] shadow-xs cursor-pointer",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500"
            )}
            aria-invalid={!!error}
            {...props}
          >
            {props.placeholder && (
              <option value="" disabled hidden>
                {props.placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-500 dark:text-surface-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';
