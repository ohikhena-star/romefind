import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import SearchOverlay from './SearchOverlay';

const TopNav = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme, searchOpen, toggleSearch } = useUiStore();
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/discover', label: 'Discover' },
    { to: '/recommendations', label: 'For You' },
    { to: '/explore', label: 'Explore' },
    { to: '/compare', label: 'Compare' },
    { to: '/my-opportunities', label: 'My Opportunities' },
    { to: '/learn', label: 'Learn' },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 h-16 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 z-40 hidden md:block transition-colors">
        <div className="max-w-content mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to={isAuthenticated ? '/discover' : '/'} className="flex items-center gap-1" aria-label="ROMEfind home">
            <span className="text-xl font-bold text-rome-500 tracking-tight">ROME</span>
            <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">find</span>
          </Link>

          {/* Center Links (Auth only) */}
          {isAuthenticated && (
            <nav role="navigation" aria-label="Main navigation" className="flex items-center gap-1.5 bg-surface-100 dark:bg-surface-800/60 p-1 rounded-2xl border border-surface-200/80 dark:border-surface-800">
              {navLinks.map((link) => {
                let linkId = undefined;
                if (link.to === '/explore') linkId = 'nav-explore';
                if (link.to === '/my-opportunities') linkId = 'nav-my-opps';

                return (
                  <NavLink
                    key={link.to}
                    id={linkId}
                    to={link.to}
                    className={({ isActive }: { isActive: boolean }) =>
                      cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                        isActive
                          ? 'bg-white dark:bg-surface-900 text-surface-950 dark:text-white shadow-xs border border-surface-200/60 dark:border-surface-700'
                          : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
                      )
                    }
                  >
                    {({ isActive }: { isActive: boolean }) => (
                      <span aria-current={isActive ? 'page' : undefined}>{link.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                id="nav-search"
                onClick={toggleSearch}
                className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700/80 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:border-surface-300 transition-all text-xs cursor-pointer group shadow-xs"
              >
                <SolarIcon name="magnifer-linear" size={14} className="group-hover:text-rome-500 transition-colors" />
                <span>Search opportunities...</span>
                <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-[10px] font-mono font-bold text-surface-500 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SolarIcon name="sun-2-linear" size={18} /> : <SolarIcon name="moon-linear" size={18} />}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={toggleSearch}
                  className="lg:hidden p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <SolarIcon name="magnifer-linear" size={18} />
                </button>
                <Link
                  to="/notifications"
                  className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <SolarIcon name="bell-linear" size={18} />
                  {unreadCount > 0 && (
                    <span aria-live="polite" className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rome-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-surface-900 animate-in zoom-in">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-8 h-8 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-200 border border-surface-300 dark:border-surface-600 hover:border-rome-500 transition-colors overflow-hidden cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500"
                      aria-label="User account menu"
                    >
                      {user?.profile?.photo ? (
                        <img src={user.profile.photo} alt={user.profile.name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <SolarIcon name="user-rounded-linear" size={15} />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
                    <DropdownMenuLabel className="px-3 py-2 font-normal">
                      <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{user?.profile?.name || 'Explorer'}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.profile?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-surface-100 dark:bg-surface-800" />
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer focus:bg-surface-100 dark:focus:bg-surface-800">
                      <Link to="/profile" className="flex items-center gap-2.5 text-xs font-semibold text-surface-700 dark:text-surface-200 w-full">
                        <SolarIcon name="user-rounded-linear" size={14} />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-surface-100 dark:bg-surface-800" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer flex items-center gap-2.5"
                    >
                      <SolarIcon name="logout-2-linear" size={14} />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-bold text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white transition-colors px-3 py-1.5">
                  Sign in
                </Link>
                <Link to="/signup" className="inline-flex items-center gap-1.5 px-4 py-2 bg-rome-500 hover:bg-rome-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all">
                  Get started ↗
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={toggleSearch} />}
    </>
  );
};

export default TopNav;
