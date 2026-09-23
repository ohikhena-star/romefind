import React from 'react';
import { cn } from '@/utils/cn';
import { ApplicationStatus } from '@/types/models';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: ApplicationStatus | string;
  variant?: string;
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, size = 'sm', className, children, ...props }) => {
  const displayStatus = status || (typeof children === 'string' ? children : '') || variant || '';
  
  const getStatusColor = (st: string) => {
    switch (st.toLowerCase()) {
      case 'saved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'considering': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'preparing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'applying': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'submitted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'result': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'verified': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'secondary': return 'bg-surface-200 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300';
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        getStatusColor(displayStatus),
        className
      )}
      {...props}
    >
      {children || displayStatus}
    </span>
  );
};
