import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white sm:bg-surface-50 dark:bg-surface-950 flex flex-col justify-between sm:justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden transition-colors">
      {/* Decorative background pattern for desktop */}
      <div 
        className="hidden sm:block absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" 
        style={{ backgroundImage: 'radial-gradient(#0284c7 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      />

      <div className="w-full sm:mx-auto sm:max-w-md z-10 my-auto sm:my-0">
        <Link to="/" className="flex items-center justify-center gap-1 mb-6 sm:mb-8" aria-label="ROMEfind home">
          <span className="text-2xl sm:text-3xl font-bold text-rome-500 tracking-tight">ROME</span>
          <span className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white tracking-tight">find</span>
        </Link>
        <div className="bg-transparent sm:bg-white dark:sm:bg-surface-900 p-0 sm:py-8 sm:px-10 sm:shadow-card sm:rounded-2xl sm:border sm:border-surface-100 dark:sm:border-surface-800 transition-all duration-300 relative">
          <Outlet />
        </div>
      </div>

      {/* Subtle mobile footer note */}
      <div className="sm:hidden text-center py-4 text-xs text-surface-400">
        © {new Date().getFullYear()} ROMEfind
      </div>
    </div>
  );
};

export default AuthLayout;

