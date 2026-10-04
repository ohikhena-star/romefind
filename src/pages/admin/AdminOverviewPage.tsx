import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';

interface OverviewData {
  users: {
    totalUsers: number;
    newUsersLast7Days: number;
    newUsersLast30Days: number;
    onboardedUsers: number;
    onboardingRate: number;
  };
  opportunities: {
    totalOpportunities: number;
    activeOpportunities: number;
    expiredOpportunities: number;
    expiringIn14Days: number;
    needsReviewOpportunities: number;
    pendingVerification: number;
  };
  engagement: {
    totalSaves: number;
    totalTracked: number;
    submittedApplications: number;
    acceptedApplications: number;
    totalCommunityAdvice: number;
    pendingReports: number;
    pendingSubmissions: number;
  };
  instrumentation: {
    behaviourSignalCount: number;
    eventTrackingActive: boolean;
    note: string;
  };
}

function MetricCard({ label, value, sub, icon, accent = false }: { label: string; value: string | number; sub?: string; icon: string; accent?: boolean }) {
  return (
    <div className={`bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 flex items-start gap-3`}>
      <div className={`p-2 rounded-lg ${accent ? 'bg-rome-500/10 text-rome-500' : 'bg-surface-100 dark:bg-surface-800 text-surface-400'}`}>
        <Icon icon={icon} width={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-surface-900 dark:text-white tabular-nums">{value}</p>
        {sub && <p className="text-xs text-surface-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getAdminOverview()
      .then((res: any) => setData(res.data))
      .catch((e: any) => setError(e?.message || 'Failed to load overview'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-200 dark:bg-surface-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-400">
        <p className="font-semibold">Failed to load overview</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Overview</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Platform health at a glance</p>
      </div>

      {/* Instrumentation Warning */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex gap-3">
        <Icon icon="solar:danger-triangle-linear" width={20} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Event instrumentation not active</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{data.instrumentation.note}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
            BehaviourSignal records: <span className="font-semibold tabular-nums">{data.instrumentation.behaviourSignalCount}</span>
          </p>
        </div>
      </div>

      {/* Users */}
      <section>
        <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Icon icon="solar:users-group-rounded-linear" width={16} className="text-surface-400" />
          Users
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <MetricCard label="Total Users" value={data.users.totalUsers} icon="solar:user-rounded-linear" accent />
          <MetricCard label="New (7 days)" value={data.users.newUsersLast7Days} icon="solar:add-circle-linear" />
          <MetricCard label="New (30 days)" value={data.users.newUsersLast30Days} icon="solar:add-circle-linear" />
          <MetricCard label="Onboarded" value={data.users.onboardedUsers} icon="solar:check-circle-linear" />
          <MetricCard label="Onboarding Rate" value={`${data.users.onboardingRate}%`} icon="solar:graph-up-linear" />
        </div>
      </section>

      {/* Opportunities */}
      <section>
        <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Icon icon="solar:case-linear" width={16} className="text-surface-400" />
          Opportunities
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <MetricCard label="Total" value={data.opportunities.totalOpportunities} icon="solar:layers-minimalistic-linear" />
          <MetricCard label="Active (OPEN)" value={data.opportunities.activeOpportunities} icon="solar:check-circle-linear" accent />
          <MetricCard label="Expired" value={data.opportunities.expiredOpportunities} icon="solar:clock-circle-linear" />
          <MetricCard label="Expiring (14d)" value={data.opportunities.expiringIn14Days} icon="solar:danger-circle-linear" />
          <MetricCard label="Needs Review" value={data.opportunities.needsReviewOpportunities} icon="solar:eye-linear" />
          <MetricCard label="Pending Verify" value={data.opportunities.pendingVerification} icon="solar:hourglass-linear" />
        </div>
      </section>

      {/* Engagement */}
      <section>
        <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Icon icon="solar:graph-up-linear" width={16} className="text-surface-400" />
          Engagement
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard label="Total Saves" value={data.engagement.totalSaves} icon="solar:heart-linear" />
          <MetricCard label="Total Tracked" value={data.engagement.totalTracked} icon="solar:target-linear" />
          <MetricCard label="Submitted" value={data.engagement.submittedApplications} icon="solar:arrow-right-up-linear" />
          <MetricCard label="Accepted" value={data.engagement.acceptedApplications} icon="solar:cup-star-linear" accent />
          <MetricCard label="Community Advice" value={data.engagement.totalCommunityAdvice} icon="solar:book-2-linear" />
          <MetricCard label="Pending Reports" value={data.engagement.pendingReports} icon="solar:shield-warning-linear" />
          <MetricCard label="Pending Submissions" value={data.engagement.pendingSubmissions} icon="solar:hourglass-linear" />
        </div>
      </section>

      {/* Unavailable metrics notice */}
      <section>
        <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Icon icon="solar:info-circle-linear" width={16} className="text-surface-400" />
          Unavailable Metrics
        </h2>
        <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
            The following metrics require BehaviourSignal event instrumentation, which has not been activated:
          </p>
          <ul className="space-y-1.5 text-sm text-surface-500 dark:text-surface-400">
            {[
              'Opportunity views / impressions',
              'CTR (click-through rate)',
              'View → Save conversion rate',
              'View → Track conversion rate',
              'Active users (session-based)',
              'Search analytics',
              'Filter usage analytics',
              'Compare action analytics',
            ].map(metric => (
              <li key={metric} className="flex items-center gap-2">
                <Icon icon="solar:close-circle-linear" width={14} className="text-surface-300 dark:text-surface-600 shrink-0" />
                {metric}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
