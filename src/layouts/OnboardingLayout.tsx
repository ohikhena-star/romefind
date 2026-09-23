import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const OnboardingLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 flex flex-col transition-colors">
      <header className="w-full p-6 flex justify-center items-center absolute top-0 z-10">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-rome-500 tracking-tight">ROME</span>
          <span className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">find</span>
        </Link>
      </header>
      
      <main className="flex-1 flex flex-col justify-center items-center pt-24 pb-12 px-4 sm:px-6 w-full max-w-3xl mx-auto">
        <div className="w-full bg-white dark:bg-surface-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-800 transition-colors">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
