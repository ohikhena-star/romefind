import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  className
}) => {
  return (
    <div className={cn("rounded-lg bg-red-50 dark:bg-red-900/10 p-4 border border-red-200 dark:border-red-900/50", className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{title}</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="h-4 w-4" />}
                className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/50"
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
