import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Search, Bookmark, BookOpen, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

const BottomNav = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return null;

  const navItems = [
    { to: '/discover', label: 'Discover', icon: Compass },
    { to: '/explore', label: 'Explore', icon: Search },
    { to: '/my-opportunities', label: 'Saved', icon: Bookmark },
    { to: '/learn', label: 'Learn', icon: BookOpen },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 z-40 pb-safe transition-colors">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center w-full h-full space-y-1',
                  isActive
                    ? 'text-rome-500'
                    : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={24}
                    className={cn('transition-all', isActive && 'fill-current stroke-[1.5]')}
                  />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
