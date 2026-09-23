import React from 'react';
import { cn } from '@/utils/cn';
import { Bell, Calendar, Star, Info } from 'lucide-react';
import { Notification as NotificationModel, NotificationType } from '@/types/models';

export interface NotificationProps {
  notification: NotificationModel;
  onClick?: (id: string) => void;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({ 
  notification, 
  onClick,
  className 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.DeadlineApproaching: return <Calendar className="h-5 w-5 text-amber-500" />;
      case NotificationType.NewMatch: return <Star className="h-5 w-5 text-rome-500" />;
      case NotificationType.OpportunityUpdated: return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-surface-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "flex p-4 border-b border-surface-100 dark:border-surface-800 transition-colors",
        notification.read ? "bg-white dark:bg-surface-900" : "bg-rome-50/30 dark:bg-rome-900/10",
        onClick ? "cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50" : "",
        className
      )}
      onClick={() => onClick?.(notification.id)}
    >
      <div className="flex-shrink-0 mt-1 mr-4 relative">
        {getIcon()}
        {!notification.read && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rome-500 ring-2 ring-white dark:ring-surface-900 transform translate-x-1/2 -translate-y-1/4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 dark:text-white">
          {notification.title}
        </p>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
          {/* Mock format for time ago, you'd usually use date-fns formatDistanceToNow */}
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
