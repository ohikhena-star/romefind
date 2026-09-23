import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className={cn("animate-spin text-rome-500", sizes[size], className)} />
    </div>
  );
};

export interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className
}) => {
  const renderSkeleton = (key: number) => {
    let classes = "animate-pulse bg-surface-200 dark:bg-surface-800 ";
    
    switch (variant) {
      case 'text':
        classes += "rounded h-4 w-3/4 mb-2";
        break;
      case 'card':
        classes += "rounded-xl h-32 w-full";
        break;
      case 'circle':
        classes += "rounded-full h-10 w-10";
        break;
      case 'rect':
        classes += "rounded-md h-full w-full";
        break;
    }

    return (
      <div 
        key={key} 
        className={cn(classes, className)}
        style={{ width, height }}
        aria-hidden="true"
      />
    );
  };

  if (count === 1) return renderSkeleton(0);
  
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};
