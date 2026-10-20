import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import BottomNav from '@/components/navigation/BottomNav';
import { CompareBar } from '@/components/navigation/CompareBar';
import { ProductTour } from '@/components/guidance/ProductTour';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';

const AppLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { hasSeenProductTour, startTour, tourOpen } = useUiStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if first-time user should see the tour on /discover
  useEffect(() => {
    if (isAuthenticated && user && !hasSeenProductTour && !tourOpen && location.pathname === '/discover') {
      const timer = setTimeout(() => {
        startTour();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, hasSeenProductTour, tourOpen, location.pathname, startTour]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors font-sans text-surface-900 dark:text-surface-50 flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-content mx-auto pt-14 md:pt-16 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        {/* flex-1 to allow content to grow, pt-14 on mobile top bar, pt-16 for desktop top nav, pb-20 for mobile bottom nav */}
        <Outlet />
      </main>
      <CompareBar />
      <BottomNav />
      <ProductTour />
    </div>
  );
};

export default AppLayout;
