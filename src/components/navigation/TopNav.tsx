import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/utils/cn';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const TopNav = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen } = useUiStore();
  const { notifications } = useNotificationStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  const desktopNavLinks = [
    { to: '/discover', label: 'Discover', icon: 'compass-linear' },
    { to: '/recommendations', label: 'For You', icon: 'magic-stick-linear' },
    { to: '/explore', label: 'Explore', icon: 'magnifer-linear' },
    { to: '/searches', label: 'Searches', icon: 'graph-up-linear' },
    { to: '/my-opportunities', label: 'My Opportunities', icon: 'case-linear' },
    { to: '/compare', label: 'Compare', icon: 'scale-linear' },
    { to: '/learn', label: 'Learn', icon: 'book-2-linear' },
  ];

  const mobileNavLinks = [
    { to: '/discover', label: 'Discover', icon: 'compass-linear' },
    { to: '/recommendations', label: 'For You', icon: 'magic-stick-linear' },
    { to: '/explore', label: 'Explore', icon: 'magnifer-linear' },
    { to: '/searches', label: 'Searches', icon: 'graph-up-linear' },
    { to: '/my-opportunities', label: 'My Opportunities', icon: 'case-linear' },
    { to: '/compare', label: 'Compare', icon: 'scale-linear' },
    { to: '/learn', label: 'Learn', icon: 'book-2-linear' },
    { to: '/notifications', label: 'Notifications', icon: 'bell-linear', badge: unreadCount },
    { to: '/profile', label: 'Profile Settings', icon: 'user-rounded-linear' },
  ];

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      {/* ─── 1. Desktop Header (md:flex) ─── */}
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
              {desktopNavLinks.map((link) => {
                let linkId = undefined;
                if (link.to === '/explore') linkId = 'nav-explore';
                if (link.to === '/my-opportunities') linkId = 'nav-my-opps';
                if (link.to === '/learn') linkId = 'nav-learn';

                return (
                  <NavLink
                    key={link.to}
                    id={linkId}
                    to={link.to}
                    className={({ isActive }: { isActive: boolean }) =>
                      cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                        isActive
                          ? 'bg-white dark:bg-surface-900 text-rome-600 dark:text-rome-400 shadow-xs border border-rome-200/60 dark:border-rome-800/80'
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
            <button
              onClick={toggleTheme}
              className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SolarIcon name="sun-2-linear" size={18} /> : <SolarIcon name="moon-linear" size={18} />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                  title="Notifications"
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
                      {user?.profileImage || (user?.profile as any)?.photo ? (
                        <img src={user?.profileImage || (user?.profile as any)?.photo} alt={user?.profile?.name || 'User'} className="w-full h-full object-cover" />
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
                      onClick={() => setShowLogoutConfirm(true)}
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

      {/* ─── 2. Dedicated Mobile Header (md:hidden) ─── */}
      <header className="fixed top-0 inset-x-0 h-14 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-b border-surface-200 dark:border-surface-800 z-40 md:hidden transition-colors">
        <div className="px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? '/discover' : '/'} 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-1 min-h-[44px]"
            aria-label="ROMEfind home"
          >
            <span className="text-xl font-bold text-rome-500 tracking-tight">ROME</span>
            <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">find</span>
          </Link>

          {/* Right Mobile Header Actions */}
          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <>

                <Link
                  to="/notifications"
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <SolarIcon name="bell-linear" size={20} />
                  {unreadCount > 0 && (
                    <span aria-live="polite" className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 bg-rome-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-surface-900 animate-in zoom-in">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <SolarIcon name="sun-2-linear" size={20} /> : <SolarIcon name="moon-linear" size={20} />}
            </button>

            {isAuthenticated && (
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                <SolarIcon name={mobileMenuOpen ? "close-circle-linear" : "hamburger-menu-linear"} size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            {/* User info snippet */}
            <div className="pb-3 border-b border-surface-100 dark:border-surface-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-200 font-bold overflow-hidden">
                {user?.profileImage || (user?.profile as any)?.photo ? (
                  <img src={user?.profileImage || (user?.profile as any)?.photo} alt={user?.profile?.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  (user?.profile?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{user?.profile?.name || 'Explorer'}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.profile?.email}</p>
              </div>
            </div>

            {/* Navigation Destinations */}
            <nav className="space-y-1">
              {mobileNavLinks.map((link) => {
                const isActive = location.pathname === link.to;
                let mobileLinkId = undefined;
                if (link.to === '/explore') mobileLinkId = 'mobile-nav-explore';
                if (link.to === '/my-opportunities') mobileLinkId = 'mobile-nav-my-opps';
                if (link.to === '/learn') mobileLinkId = 'mobile-nav-learn';

                return (
                  <Link
                    key={link.to}
                    id={mobileLinkId}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px]",
                      isActive
                        ? "bg-rome-50 dark:bg-rome-950 text-rome-600 dark:text-rome-400 border border-rome-200/60 dark:border-rome-800"
                        : "text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <SolarIcon name={link.icon} size={18} className={isActive ? "text-rome-500" : "text-surface-400"} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rome-500 text-white text-xs font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Action */}
            <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer min-h-[44px]"
              >
                <SolarIcon name="logout-2-linear" size={18} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            role="alertdialog"
            aria-labelledby="logout-title"
            aria-describedby="logout-desc"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <SolarIcon name="logout-2-linear" size={24} />
            </div>
            <div className="text-center space-y-1.5">
              <h3 id="logout-title" className="text-lg font-bold text-surface-900 dark:text-white">
                Sign out of ROMEfind?
              </h3>
              <p id="logout-desc" className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                Your saved opportunities and tracking checklists will be saved. You can sign back in at any time.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-11 min-h-[44px] rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-semibold text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 h-11 min-h-[44px] rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-xs"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
