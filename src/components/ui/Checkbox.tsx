import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const checkboxId = id || Math.random().toString(36).substr(2, 9);

    return (
      <div className={cn("relative flex items-center", className)}>
        <div className="flex h-5 items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="h-4 w-4 rounded border-surface-300 text-rome-600 focus:ring-rome-500 dark:border-surface-600 dark:bg-surface-800 dark:ring-offset-surface-900 transition-colors cursor-pointer"
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label htmlFor={checkboxId} className="font-medium text-surface-900 dark:text-surface-100 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-surface-500 dark:text-surface-400">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
