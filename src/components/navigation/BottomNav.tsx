import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { cn } from '@/utils/cn';

export const BottomNav: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { comparisons, savedOpportunities } = useApplicationStore();
  const location = useLocation();

  if (!isAuthenticated) return null;

  // Hide bottom nav on detail and workspace routes to avoid colliding with dedicated action bars
  if (location.pathname.startsWith('/opportunity/') || location.pathname.includes('/workspace')) {
    return null;
  }

  const navItems = [
    { to: '/discover', label: 'Discover', icon: 'compass-linear', activeIcon: 'compass-bold' },
    { to: '/explore', label: 'Explore', icon: 'magnifer-linear', activeIcon: 'magnifer-bold' },
    { 
      to: '/compare', 
      label: 'Compare', 
      icon: 'scale-linear', 
      activeIcon: 'scale-bold',
      badge: comparisons.length > 0 ? comparisons.length : undefined
    },
    { 
      to: '/my-opportunities', 
      label: 'Saved', 
      icon: 'bookmark-linear', 
      activeIcon: 'bookmark-bold',
      badge: savedOpportunities.length > 0 ? savedOpportunities.length : undefined
    },
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
          if (item.to === '/compare') mobileId = 'nav-compare-mobile';

          return (
            <NavLink
              key={item.to}
              id={mobileId}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center flex-1 h-full min-h-[44px] py-1 transition-colors cursor-pointer select-none relative',
                  isActive
                    ? 'text-rome-600 dark:text-rome-400 font-semibold'
                    : 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <SolarIcon
                      name={isActive ? item.activeIcon : item.icon}
                      size={20}
                      className={cn('transition-transform duration-200', isActive && 'scale-110 text-rome-500')}
                    />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rome-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {item.badge}
                      </span>
                    )}
                  </div>
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
