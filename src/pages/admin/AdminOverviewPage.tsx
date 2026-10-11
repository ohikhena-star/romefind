import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SolarIcon } from '@/components/ui/SolarIcon';
import api from '@/api/client';
import { cn } from '@/utils/cn';

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

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  urgent?: boolean;
  accent?: boolean;
  linkTo?: string;
}

function MetricCard({ label, value, sub, icon, urgent = false, accent = false, linkTo }: MetricCardProps) {
  const content = (
    <div
      className={cn(
        "bg-white dark:bg-surface-900 rounded-2xl border p-4 sm:p-5 flex items-start justify-between gap-3 shadow-2xs transition-all",
        urgent
          ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-400"
          : accent
          ? "border-rome-200 dark:border-rome-900/60 bg-rome-50/20 dark:bg-rome-950/10 hover:border-rome-300"
          : "border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-1 truncate">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-surface-950 dark:text-white tabular-nums tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {sub && (
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 truncate">
            {sub}
          </p>
        )}
      </div>

      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          urgent
            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
            : accent
            ? "bg-rome-500 text-white"
            : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300"
        )}
      >
        <SolarIcon name={icon} size={20} />
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500 rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res: any = await api.getAdminOverview();
      setData(res.data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load admin overview metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-2 text-left">
        <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded-xl w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-red-800 dark:text-red-300 text-left space-y-3">
        <div className="flex items-center gap-2">
          <SolarIcon name="danger-circle-linear" size={20} />
          <h2 className="text-base font-bold">Failed to load admin overview</h2>
        </div>
        <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate items requiring immediate administrative attention
  const itemsNeedingAttention =
    (data.opportunities.needsReviewOpportunities || 0) +
    (data.opportunities.pendingVerification || 0) +
    (data.engagement.pendingReports || 0) +
    (data.engagement.pendingSubmissions || 0);

  return (
    <div className="space-y-8 py-2 text-left animate-in fade-in">
      {/* ─── 1. Page Header ─── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-white">
              Admin Overview
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rome-100 dark:bg-rome-950/60 text-rome-700 dark:text-rome-300 border border-rome-200 dark:border-rome-800">
              Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Real-time catalog health, moderation queues, and user engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors shadow-2xs cursor-pointer min-h-[38px] disabled:opacity-50"
            title="Refresh dashboard metrics"
          >
            <SolarIcon name="refresh-linear" size={14} className={cn(refreshing && "animate-spin")} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            to="/admin/opportunities"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rome-500 hover:bg-rome-600 text-white text-xs font-semibold shadow-xs transition-colors min-h-[38px]"
          >
            <span>Manage Catalog</span>
            <SolarIcon name="alt-arrow-right-linear" size={13} />
          </Link>
        </div>
      </header>

      {/* ─── 2. Operational Action Queue (Urgent Reviews) ─── */}
      {itemsNeedingAttention > 0 && (
        <section aria-label="Action required queue" className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-5 sm:p-6 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <SolarIcon name="shield-warning-linear" size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100">
                  {itemsNeedingAttention} items require administrative review
                </h2>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Pending provider submissions, candidate error reports, and opportunities awaiting verification.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <Link
              to="/admin/opportunities"
              className="p-3 bg-white dark:bg-surface-900 rounded-xl border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 transition-colors block"
            >
              <span className="text-xs text-surface-500 block">Needs Review</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-300 tabular-nums">
                {data.opportunities.needsReviewOpportunities}
              </span>
            </Link>

            <Link
              to="/admin/opportunities"
              className="p-3 bg-white dark:bg-surface-900 rounded-xl border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 transition-colors block"
            >
              <span className="text-xs text-surface-500 block">Pending Verification</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-300 tabular-nums">
                {data.opportunities.pendingVerification}
              </span>
            </Link>

            <Link
              to="/admin/reviews"
              className="p-3 bg-white dark:bg-surface-900 rounded-xl border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 transition-colors block"
            >
              <span className="text-xs text-surface-500 block">User Reports</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-300 tabular-nums">
                {data.engagement.pendingReports}
              </span>
            </Link>

            <Link
              to="/admin/opportunities"
              className="p-3 bg-white dark:bg-surface-900 rounded-xl border border-amber-200/80 dark:border-amber-900/60 hover:border-amber-400 transition-colors block"
            >
              <span className="text-xs text-surface-500 block">Provider Submissions</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-300 tabular-nums">
                {data.engagement.pendingSubmissions}
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ─── 3. Opportunities & Catalog Operations ─── */}
      <section aria-labelledby="heading-opportunities" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="heading-opportunities" className="text-sm font-bold text-surface-800 dark:text-surface-200 uppercase tracking-wider flex items-center gap-2">
            <SolarIcon name="case-linear" size={16} className="text-rome-500" />
            <span>Opportunities Catalog</span>
          </h2>
          <Link to="/admin/opportunities" className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline">
            View full catalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <MetricCard
            label="Total Opportunities"
            value={data.opportunities.totalOpportunities}
            icon="layers-minimalistic-linear"
            linkTo="/admin/opportunities"
          />
          <MetricCard
            label="Active (OPEN)"
            value={data.opportunities.activeOpportunities}
            icon="check-circle-linear"
            accent
            linkTo="/admin/opportunities"
          />
          <MetricCard
            label="Expiring (14d)"
            value={data.opportunities.expiringIn14Days}
            icon="clock-circle-linear"
            urgent={data.opportunities.expiringIn14Days > 0}
            linkTo="/admin/opportunities"
          />
          <MetricCard
            label="Expired Status"
            value={data.opportunities.expiredOpportunities}
            icon="close-circle-linear"
            linkTo="/admin/opportunities"
          />
          <MetricCard
            label="Needs Review"
            value={data.opportunities.needsReviewOpportunities}
            icon="eye-linear"
            urgent={data.opportunities.needsReviewOpportunities > 0}
            linkTo="/admin/opportunities"
          />
          <MetricCard
            label="Pending Verify"
            value={data.opportunities.pendingVerification}
            icon="shield-warning-linear"
            urgent={data.opportunities.pendingVerification > 0}
            linkTo="/admin/opportunities"
          />
        </div>
      </section>

      {/* ─── 4. User Base & Onboarding ─── */}
      <section aria-labelledby="heading-users" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="heading-users" className="text-sm font-bold text-surface-800 dark:text-surface-200 uppercase tracking-wider flex items-center gap-2">
            <SolarIcon name="users-group-rounded-linear" size={16} className="text-rome-500" />
            <span>Users & Community</span>
          </h2>
          <Link to="/admin/users" className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline">
            Manage users →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <MetricCard
            label="Total Accounts"
            value={data.users.totalUsers}
            icon="user-rounded-linear"
            accent
            linkTo="/admin/users"
          />
          <MetricCard
            label="New (Last 7d)"
            value={data.users.newUsersLast7Days}
            icon="add-circle-linear"
            linkTo="/admin/users"
          />
          <MetricCard
            label="New (Last 30d)"
            value={data.users.newUsersLast30Days}
            icon="add-circle-linear"
            linkTo="/admin/users"
          />
          <MetricCard
            label="Profiles Completed"
            value={data.users.onboardedUsers}
            icon="check-circle-linear"
            linkTo="/admin/users"
          />
          <MetricCard
            label="Onboarding Rate"
            value={`${data.users.onboardingRate}%`}
            icon="graph-up-linear"
            sub="Percent fully onboarded"
          />
        </div>
      </section>

      {/* ─── 5. Engagement & Application Funnel ─── */}
      <section aria-labelledby="heading-engagement" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="heading-engagement" className="text-sm font-bold text-surface-800 dark:text-surface-200 uppercase tracking-wider flex items-center gap-2">
            <SolarIcon name="graph-up-linear" size={16} className="text-rome-500" />
            <span>Platform Activity & Funnel</span>
          </h2>
          <Link to="/admin/analytics" className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline">
            Detailed analytics →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            label="Total Bookmarks"
            value={data.engagement.totalSaves}
            icon="heart-linear"
            sub="Saved opportunities"
          />
          <MetricCard
            label="Tracked Applications"
            value={data.engagement.totalTracked}
            icon="target-linear"
            sub="Active workspaces"
          />
          <MetricCard
            label="Applications Submitted"
            value={data.engagement.submittedApplications}
            icon="arrow-right-up-linear"
            sub="Candidate submissions"
          />
          <MetricCard
            label="Reported Acceptances"
            value={data.engagement.acceptedApplications}
            icon="cup-star-linear"
            accent
            sub="Successful outcomes"
          />
        </div>
      </section>

      {/* ─── 6. Transparency on Instrumentation Status ─── */}
      <section aria-labelledby="heading-instrumentation" className="pt-2">
        <div className="bg-surface-50 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <SolarIcon name="info-circle-linear" size={18} className="text-surface-400" />
            <h2 id="heading-instrumentation" className="text-xs sm:text-sm font-bold text-surface-900 dark:text-white uppercase tracking-wider">
              Instrumentation & System Event Note
            </h2>
          </div>
          <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed max-w-2xl">
            {data.instrumentation.note}
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs text-surface-500">
            <span>Stored signal events: <strong className="text-surface-800 dark:text-surface-200">{data.instrumentation.behaviourSignalCount}</strong></span>
            <span>•</span>
            <span className={cn(data.instrumentation.eventTrackingActive ? "text-emerald-600" : "text-amber-600")}>
              {data.instrumentation.eventTrackingActive ? "Active" : "Inactive (Offline aggregation)"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
