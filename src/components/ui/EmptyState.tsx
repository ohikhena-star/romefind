import React from 'react';
import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-lg border-2 border-dashed border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50", className)}>
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
          <Icon className="h-6 w-6 text-surface-600 dark:text-surface-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 max-w-sm">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="outline" size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
