import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import BottomNav from '@/components/navigation/BottomNav';
import { CompareBar } from '@/components/navigation/CompareBar';
import { useAuthStore } from '@/store/authStore';

const AppLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Basic auth guard
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors font-sans text-surface-900 dark:text-surface-50 flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-content mx-auto pt-0 md:pt-16 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* We use flex-1 to allow content to grow, and pt-16 for desktop top nav, pb-20 for mobile bottom nav */}
        <Outlet />
      </main>
      <CompareBar />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
