import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getDeadlineUrgency, daysUntil, formatDateShort } from '@/utils/format';

export interface DeadlineIndicatorProps {
  deadline?: string;
  date?: string;
  className?: string;
}

export const DeadlineIndicator: React.FC<DeadlineIndicatorProps> = ({ deadline, date, className }) => {
  const targetDate = deadline || date || new Date().toISOString();
  const urgency = getDeadlineUrgency(targetDate);
  const days = daysUntil(targetDate);
  const formattedDate = formatDateShort(targetDate);
  
  let colorClasses = "text-surface-400 dark:text-surface-500";
  let text = formattedDate;

  if (urgency === 'urgent') {
    colorClasses = "text-red-500 font-medium animate-pulse";
    text = `Due in ${days} days (${formattedDate})`;
  } else if (urgency === 'soon') {
    colorClasses = "text-amber-500 font-medium";
    text = `Due in ${days} days (${formattedDate})`;
  } else if (urgency === 'expired') {
    colorClasses = "text-surface-400 dark:text-surface-500 line-through";
    text = `Expired ${formattedDate}`;
  }

  return (
    <div className={cn("flex items-center text-xs", colorClasses, className)}>
      <Calendar className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
};
