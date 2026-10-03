import React from 'react';
import { NavLink } from 'react-router-dom';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

const BottomNav: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return null;

  const navItems = [
    { to: '/discover', label: 'Discover', icon: 'compass-linear', activeIcon: 'compass-bold' },
    { to: '/recommendations', label: 'For You', icon: 'magic-stick-linear', activeIcon: 'magic-stick-bold' },
    { to: '/explore', label: 'Explore', icon: 'magnifer-linear', activeIcon: 'magnifer-bold' },
    { to: '/my-opportunities', label: 'Saved', icon: 'bookmark-linear', activeIcon: 'bookmark-bold' },
    { to: '/learn', label: 'Learn', icon: 'book-2-linear', activeIcon: 'book-2-bold' },
    { to: '/profile', label: 'Profile', icon: 'user-rounded-linear', activeIcon: 'user-rounded-bold' },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Mobile bottom navigation" 
      className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-t border-surface-200 dark:border-surface-800 z-40 pb-safe transition-colors shadow-elevated"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          let mobileId = undefined;
          if (item.to === '/explore') mobileId = 'nav-explore-mobile';
          if (item.to === '/my-opportunities') mobileId = 'nav-my-opps-mobile';

          return (
            <NavLink
              key={item.to}
              id={mobileId}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] py-1 transition-colors cursor-pointer select-none',
                  isActive
                    ? 'text-rome-600 dark:text-rome-400 font-semibold'
                    : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <SolarIcon
                    name={isActive ? item.activeIcon : item.icon}
                    size={20}
                    className={cn('transition-transform duration-200', isActive && 'scale-110 text-rome-500')}
                  />
                  <span className={cn('text-[11px] tracking-tight mt-1 leading-none', isActive ? 'font-bold' : 'font-medium')}>
                    {item.label}
                  </span>
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

