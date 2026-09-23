import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, fullWidth, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substr(2, 9);

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-surface-900 dark:text-surface-100 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "block w-full rounded-lg border-surface-300 bg-white text-surface-900 shadow-sm focus:border-rome-500 focus:ring-rome-500 sm:text-sm dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-rome-500 dark:focus:ring-rome-500 disabled:opacity-50 disabled:bg-surface-50 dark:disabled:bg-surface-900 transition-colors h-10",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500"
            )}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn("mt-1 text-sm", error ? "text-red-500" : "text-surface-500 dark:text-surface-400")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
