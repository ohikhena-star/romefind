import React from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle2, Info } from 'lucide-react';

export interface MatchIndicatorProps {
  score: number;
  reasons?: string[];
  compact?: boolean;
  className?: string;
}

export const MatchIndicator: React.FC<MatchIndicatorProps> = ({
  score,
  reasons = [],
  compact = false,
  className
}) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  
  let color = 'bg-surface-300 dark:bg-surface-600';
  let textColor = 'text-surface-700 dark:text-surface-300';
  
  if (clampedScore >= 80) {
    color = 'bg-green-500';
    textColor = 'text-green-700 dark:text-green-400';
  } else if (clampedScore >= 60) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700 dark:text-amber-400';
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex items-center w-full max-w-[120px] gap-2">
          <div className="h-1.5 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-500", color)} 
              style={{ width: `${clampedScore}%` }}
            />
          </div>
          <span className={cn("text-xs font-bold", textColor)}>
            {clampedScore}%
          </span>
        </div>
        {!compact && clampedScore >= 80 && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Strong Match
          </span>
        )}
      </div>
      
      {!compact && reasons.length > 0 && (
        <div className="mt-1">
          <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center mb-1">
            <Info className="w-3 h-3 mr-1" />
            Relevant because:
          </p>
          <ul className="text-xs text-surface-600 dark:text-surface-300 space-y-1 pl-4 list-disc marker:text-surface-300">
            {reasons.slice(0, 3).map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
            {reasons.length > 3 && (
              <li className="text-surface-400">+{reasons.length - 3} more reasons</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
