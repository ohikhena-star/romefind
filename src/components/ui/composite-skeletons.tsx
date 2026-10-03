import React from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/Skeleton';

// ─── Opportunity Card Skeleton ────────────────────────────────────────
export const OpportunityCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('rounded-2xl border border-border bg-card p-5 flex flex-col justify-between space-y-4', className)}>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-4/5 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-5/6 rounded-md" />
      </div>
    </div>
    <div className="pt-3 border-t border-border space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>
    </div>
  </div>
);

// ─── Opportunity Grid Skeleton ────────────────────────────────────────
export const OpportunityGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 6, className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
    {Array.from({ length: count }).map((_, i) => <OpportunityCardSkeleton key={i} />)}
  </div>
);

// ─── Opportunity Detail Skeleton ──────────────────────────────────────
export const OpportunityDetailSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div className="flex items-center gap-3">
      <Skeleton className="h-9 w-24 rounded-lg" />
      <Skeleton className="h-4 w-40 rounded-md" />
    </div>
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Dashboard Skeleton ───────────────────────────────────────────────
export const DashboardSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
    <div className="space-y-2">
      <Skeleton className="h-9 w-72 rounded-xl" />
      <Skeleton className="h-5 w-96 rounded-md" />
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>
      <OpportunityGridSkeleton count={3} />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-6 w-48 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    </div>
  </div>
);

// ─── Profile Skeleton ─────────────────────────────────────────────────
export const ProfileSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Workspace Skeleton ───────────────────────────────────────────────
export const WorkspaceSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-40 rounded-md" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-28 rounded-lg" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);
