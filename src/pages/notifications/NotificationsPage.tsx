import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, Button } from '@/components/ui';
import { useNotificationStore } from '@/store/notificationStore';
import { Bell, CheckCheck, Check, Trash2, X } from 'lucide-react';
import { formatRelative } from '@/utils/format';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <EmptyState 
          icon={Bell}
          title="No notifications yet." 
          description="We'll notify you when there are updates on your matched opportunities, upcoming deadlines, and recommended learning paths."
          actionLabel="Explore opportunities"
          onAction={() => navigate('/explore')}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto flex flex-col gap-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 dark:border-surface-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-rome-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-rome-500 text-white rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-surface-500 mt-1">Updates on opportunities, deadlines, and recommendations</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead()}
              leftIcon={<CheckCheck size={16} />}
            >
              Mark all as read
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearAll()}
            leftIcon={<Trash2 size={15} />}
            className="text-surface-400 hover:text-red-500"
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-rome-500 text-white shadow-sm'
              : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-rome-500 text-white shadow-sm'
              : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification Cards */}
      <div className="flex flex-col gap-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 dark:bg-surface-900/40 rounded-xl border border-surface-200 dark:border-surface-800">
            <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">You're all caught up!</p>
            <p className="text-xs text-surface-400 mt-0.5">No unread notifications.</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`bg-white dark:bg-surface-900 rounded-xl p-4 shadow-card border transition-all flex items-start justify-between gap-4 ${
                notification.read 
                  ? 'border-surface-200 dark:border-surface-800 opacity-70 bg-surface-50/50' 
                  : 'border-l-4 border-l-rome-500 border-surface-200 dark:border-surface-800 hover:shadow-card-hover'
              }`}
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.opportunityId) {
                    navigate(`/opportunity/${notification.opportunityId}`);
                  }
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-rome-500 shrink-0" />
                  )}
                  <h3 className={`text-sm font-bold ${notification.read ? 'text-surface-700 dark:text-surface-300' : 'text-surface-900 dark:text-white'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[11px] text-surface-400 ml-auto">
                    {notification.createdAt ? formatRelative(notification.createdAt) : ''}
                  </span>
                </div>
                <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed pl-4">
                  {notification.message}
                </p>
                {notification.opportunityId && (
                  <span className="inline-block mt-2 pl-4 text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline">
                    View Opportunity →
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                    title="Mark as read"
                    aria-label="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete notification"
                  aria-label="Delete notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
