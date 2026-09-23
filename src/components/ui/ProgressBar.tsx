import React from 'react';
import { cn } from '@/utils/cn';

export interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md';
  color?: string; // Tailwind class like bg-rome-500
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  color = 'bg-rome-500',
  showLabel = false,
  label,
  className
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{label}</span>}
          {showLabel && <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div className={cn(
        "w-full bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden",
        size === 'sm' ? "h-1.5" : "h-2.5"
      )}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-in-out", color)}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
