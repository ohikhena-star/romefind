import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
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
import AdminLayout from '@/layouts/AdminLayout';

// Admin Guard
import AdminGuard from '@/components/admin/AdminGuard';

// Pages
import LandingPage from '@/pages/landing/LandingPage';
import AboutPage from '@/pages/about/AboutPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';
import TermsPage from '@/pages/legal/TermsPage';
import CommunityGuidelinesPage from '@/pages/legal/CommunityGuidelinesPage';
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
import SearchesPage from '@/pages/searches/SearchesPage';

// Admin Pages
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminOpportunitiesPage from '@/pages/admin/AdminOpportunitiesPage';
import AdminFieldsPage from '@/pages/admin/AdminFieldsPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';
import AdminSystemHealthPage from '@/pages/admin/AdminSystemHealthPage';

import { DashboardSkeleton } from '@/components/ui/composite-skeletons';

const ProtectedRoute = () => {
  const { isAuthenticated, user, isInitializing } = useAuthStore();
  const location = useLocation();
  
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <Outlet />;
};

const AuthAwareRoot = () => {
  const { isAuthenticated, user, isInitializing } = useAuthStore();
  
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-6">
        <DashboardSkeleton />
      </div>
    );
  }
  
  if (isAuthenticated) {
    if (user && !user.onboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/discover" replace />;
  }
  
  return <LandingPage />;
};

export default function App() {
  const { theme } = useUIStore();
  const { isAuthenticated, syncProfile, initAuth } = useAuthStore();
  const { fetchOpportunities } = useOpportunityStore();
  const { fetchApplications } = useApplicationStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

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
        <Route path="/" element={<AuthAwareRoot />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
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

      {/* App Shell Layout (Public & Authenticated) */}
      <Route element={<AppLayout />}>
        {/* Public Opportunity Detail */}
        <Route path="/opportunity/:id" element={<OpportunityDetailPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/my-opportunities" element={<MyOpportunitiesPage />} />
          <Route path="/my-opportunities/:id/workspace" element={<ApplicationWorkspacePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/searches" element={<SearchesPage />} />
          <Route path="/search" element={<SearchesPage />} />
        </Route>
      </Route>

      
      {/* Admin Routes — protected by AdminGuard (role === 'ADMIN' only) */}
      <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="opportunities" element={<AdminOpportunitiesPage />} />
        <Route path="fields" element={<AdminFieldsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="health" element={<AdminSystemHealthPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
