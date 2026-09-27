import React from 'react';
import { cn } from '@/utils/cn';

import { OpportunityType } from '@/types/models';
import { OPPORTUNITY_TYPE_COLORS } from '@/utils/constants';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const Tag: React.FC<TagProps> = ({ 
  label, 
  color, 
  size = 'md',
  className,
  ...props 
}) => {
  const resolvedColor = color || (OPPORTUNITY_TYPE_COLORS as Record<string, string>)[label] || 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80';

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-semibold",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        resolvedColor,
        className
      )}
      {...props}
    >
      {label}
    </span>
  );
};
