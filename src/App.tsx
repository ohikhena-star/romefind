import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useUIStore } from '@/store/uiStore';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import OnboardingLayout from '@/layouts/OnboardingLayout';

// Pages
import LandingPage from '@/pages/landing/LandingPage';
import AboutPage from '@/pages/about/AboutPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import OnboardingFlow from '@/pages/onboarding/OnboardingFlow';
import DiscoverPage from '@/pages/discover/DiscoverPage';
import RecommendationsPage from '@/pages/recommendations/RecommendationsPage';
import ExplorePage from '@/pages/explore/ExplorePage';
import OpportunityDetailPage from '@/pages/opportunity/OpportunityDetailPage';
import ComparePage from '@/pages/compare/ComparePage';
import MyOpportunitiesPage from '@/pages/my-opportunities/MyOpportunitiesPage';
import ApplicationWorkspacePage from '@/pages/my-opportunities/ApplicationWorkspacePage';
import LearnPage from '@/pages/learn/LearnPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';

import { DashboardSkeleton } from '@/components/ui/Skeleton';

const ProtectedRoute = () => {
  const { isAuthenticated, user, isInitializing } = useAuthStore();
  
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <AppLayout />;
};

export default function App() {
  const { theme } = useUIStore();
  const { isAuthenticated, syncProfile } = useAuthStore();
  const { fetchOpportunities } = useOpportunityStore();
  const { fetchApplications } = useApplicationStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Hydrate state from backend
    fetchOpportunities();
    if (isAuthenticated) {
      syncProfile();
      fetchApplications();
      fetchNotifications();
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Onboarding */}
      <Route element={<OnboardingLayout />}>
        <Route path="/onboarding" element={<OnboardingFlow />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/opportunity/:id" element={<OpportunityDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/my-opportunities" element={<MyOpportunitiesPage />} />
        <Route path="/my-opportunities/:id/workspace" element={<ApplicationWorkspacePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
