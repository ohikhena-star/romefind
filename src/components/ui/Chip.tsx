import React from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  onRemove?: () => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  onRemove,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const isInteractive = !!onClick;
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive && !onRemove}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900",
        size === 'sm' ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variant === 'default' && !selected && "bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700",
        variant === 'outline' && !selected && "border border-surface-300 bg-transparent text-surface-700 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800",
        selected && "bg-rome-500 text-white hover:bg-rome-600 border-transparent",
        !isInteractive && !onRemove && "cursor-default",
        className
      )}
      aria-pressed={selected}
      {...props}
    >
      {label}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
          className={cn(
            "ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full focus:bg-surface-400 focus:text-white focus:outline-none",
            selected
              ? "text-white hover:bg-rome-600 hover:text-white"
              : "text-surface-400 hover:bg-surface-200 hover:text-surface-500 dark:hover:bg-surface-700 dark:hover:text-surface-300"
          )}
        >
          <span className="sr-only">Remove {label}</span>
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
};
