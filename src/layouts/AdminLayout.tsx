import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/admin/overview',      label: 'Overview',          icon: 'solar:chart-2-linear' },
  { to: '/admin/users',         label: 'Users',             icon: 'solar:users-group-rounded-linear' },
  { to: '/admin/opportunities', label: 'Opportunities',     icon: 'solar:case-linear' },
  { to: '/admin/fields',        label: 'Fields & Coverage', icon: 'solar:layers-minimalistic-linear' },
  { to: '/admin/analytics',     label: 'Analytics',         icon: 'solar:graph-up-linear' },
  { to: '/admin/reviews',       label: 'Reviews & Reports', icon: 'solar:shield-warning-linear' },
  { to: '/admin/health',        label: 'System Health',     icon: 'solar:server-linear' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLink = (item: typeof NAV_ITEMS[0]) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-rome-500/10 text-rome-500 dark:bg-rome-500/15 dark:text-rome-400'
            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
        )
      }
    >
      <Icon icon={item.icon} width={18} height={18} />
      {item.label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800">
        {/* Logo / Title */}
        <div className="px-4 py-5 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <span className="text-rome-500 font-bold text-base">ROMEfind</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">Admin</span>
          </div>
          <Link
            to="/discover"
            className="mt-2 flex items-center gap-1.5 text-xs text-surface-400 hover:text-rome-500 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" width={12} />
            Back to app
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(navLink)}
        </nav>

        <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-800">
          <p className="text-[10px] text-surface-400">Admin Console v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-rome-500 font-bold text-sm">ROMEfind</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
          aria-label="Open navigation"
        >
          <Icon icon="solar:hamburger-menu-linear" width={20} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-white dark:bg-surface-900 flex flex-col h-full">
            <div className="px-4 py-5 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-rome-500 font-bold text-base">ROMEfind</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">Admin</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded text-surface-500 hover:text-surface-900"
                aria-label="Close navigation"
              >
                <Icon icon="solar:close-circle-linear" width={20} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(navLink)}
            </nav>
            <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-800">
              <Link
                to="/discover"
                className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-rome-500 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon icon="solar:arrow-left-linear" width={12} />
                Back to app
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 min-w-0 lg:overflow-y-auto">
        <div className="lg:hidden h-14" /> {/* spacer for fixed mobile header */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
