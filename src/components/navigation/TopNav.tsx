import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, X, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import SearchOverlay from './SearchOverlay';

const TopNav = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme, searchOpen, toggleSearch } = useUiStore();
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/discover', label: 'Discover' },
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
          <Link to={isAuthenticated ? '/discover' : '/'} className="flex items-center gap-1">
            <span className="text-xl font-bold text-rome-500 tracking-tight">ROME</span>
            <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">find</span>
          </Link>

          {/* Center Links (Auth only) */}
          {isAuthenticated && (
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors hover:text-rome-500',
                      isActive ? 'text-rome-500 font-semibold' : 'text-surface-600 dark:text-surface-400'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={toggleSearch}
                  className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                <Link
                  to="/notifications"
                  className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rome-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-surface-900 animate-in zoom-in">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-200 border-2 border-transparent hover:border-rome-500 transition-colors overflow-hidden cursor-pointer"
                  >
                    {user?.profile?.photo ? (
                      <img src={user.profile.photo} alt={user.profile.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} />
                    )}
                  </button>
                  
                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-card-hover border border-surface-200 dark:border-surface-700 py-1 overflow-hidden z-50">
                      <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-700 mb-1">
                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user?.profile?.name || 'User'}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.profile?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700"
                      >
                        <User size={16} /> Profile
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-left cursor-pointer"
                      >
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get started
                  </Button>
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
