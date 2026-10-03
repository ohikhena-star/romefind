import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { SolarIcon } from './SolarIcon';

export interface EmptyStateProps {
  icon?: any;
  title: string;
  description?: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  hint,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-lg border-2 border-dashed border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50", className)}>
      {icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
          {typeof icon === 'string' ? (
            <SolarIcon name={icon} size={32} className="text-surface-300 dark:text-surface-600" aria-hidden="true" />
          ) : (
            React.createElement(icon, { className: "h-8 w-8 text-surface-300 dark:text-surface-600", "aria-hidden": "true" })
          )}
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 max-w-xs mx-auto text-center">
          {description}
        </p>
      )}
      {hint && (
        <p className="mt-1 text-xs text-surface-400 dark:text-surface-500 max-w-xs mx-auto text-center italic">
          {hint}
        </p>
      )}
      <div className="mt-6 flex flex-col items-center gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction} size="default" className="bg-rome-500 hover:bg-rome-600 text-white min-h-[44px] px-6 text-sm font-semibold">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button 
            onClick={onSecondaryAction} 
            className="text-rome-600 dark:text-rome-400 hover:underline text-sm font-medium transition-colors"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
