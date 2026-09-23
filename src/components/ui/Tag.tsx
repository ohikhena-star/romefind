import React from 'react';
import { cn } from '@/utils/cn';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const Tag: React.FC<TagProps> = ({ 
  label, 
  color = 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200', 
  size = 'md',
  className,
  ...props 
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        color,
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
};
