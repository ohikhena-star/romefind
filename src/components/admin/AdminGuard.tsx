import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <span className="text-surface-400 text-sm">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/discover" replace />;
  }

  return <>{children}</>;
}
