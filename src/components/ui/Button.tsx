import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: any;
  to?: string;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading = false,
      disabled,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      as,
      to,
      href,
      ...props
    },
    ref
  ) => {
    const isButtonLoading = loading || isLoading;
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-surface-900';
    
    const variants = {
      primary: 'bg-rome-500 text-white hover:bg-rome-600',
      secondary: 'border border-surface-300 bg-white text-surface-900 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700',
      ghost: 'bg-transparent text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
      outline: 'border-2 border-rome-500 text-rome-500 hover:bg-rome-50 dark:hover:bg-rome-950',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isButtonLoading}
        {...props}
      >
        {isButtonLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isButtonLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
