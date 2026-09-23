import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#f97316 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex items-center justify-center gap-1 mb-8">
          <span className="text-3xl font-bold text-rome-500 tracking-tight">ROME</span>
          <span className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">find</span>
        </Link>
        <div className="bg-white dark:bg-surface-900 py-8 px-4 shadow-card hover:shadow-card-hover sm:rounded-2xl sm:px-10 border border-surface-100 dark:border-surface-800 transition-all duration-300 relative overflow-hidden">
          {/* Subtle top accent border */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rome-400 to-rome-600"></div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
