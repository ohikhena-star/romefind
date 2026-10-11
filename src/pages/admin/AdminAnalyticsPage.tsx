import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';

interface AnalyticsData {
  saves: { total: number; last7Days: number; last30Days: number };
  tracked: { total: number; last7Days: number; last30Days: number };
  applicationsByStatus: Record<string, number>;
  tasks: { total: number; completed: number; completionRate: number | null };
  communityAdviceByOutcome: Record<string, number>;
  reportsByReason: Record<string, number>;
  unavailable: { note: string };
}

interface ShareAnalyticsData {
  range: '7d' | '30d' | '90d' | 'all';
  totals: {
    shares: number;
    sharedLinkVisits: number;
    applicationLinkClicks: number;
  };
  sharesByMethod: Record<string, number>;
  topShared: Array<{
    opportunityId: string;
    title: string;
    organization: string;
    count: number;
  }>;
  topClicked: Array<{
    opportunityId: string;
    title: string;
    organization: string;
    count: number;
  }>;
  collectionStartedAt: string | null;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
      <span className="text-sm text-surface-600 dark:text-surface-400">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-white">{value}</span>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [shareData, setShareData] = useState<ShareAnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load: base analytics + share analytics
  useEffect(() => {
    Promise.all([
      api.getAdminAnalytics(),
      api.getAdminShareAnalytics({ range: dateRange })
    ])
      .then(([baseRes, shareRes]: [any, any]) => {
        setData(baseRes.data);
        setShareData(shareRes.data);
      })
      .catch((e: any) => setError(e?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  // When date range changes, re-fetch share analytics
  const handleRangeChange = (newRange: '7d' | '30d' | '90d' | 'all') => {
    setDateRange(newRange);
    setShareLoading(true);
    api.getAdminShareAnalytics({ range: newRange })
      .then((res: any) => setShareData(res.data))
      .catch((e: any) => console.error('Failed to update share analytics:', e))
      .finally(() => setShareLoading(false));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-surface-200 dark:bg-surface-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-400">
        <p className="font-semibold">Failed to load analytics</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const statusEntries = Object.entries(data.applicationsByStatus).sort(([, a], [, b]) => b - a);
  const adviceEntries = Object.entries(data.communityAdviceByOutcome).sort(([, a], [, b]) => b - a);
  const reportEntries = Object.entries(data.reportsByReason).sort(([, a], [, b]) => b - a);

  // Derived metrics
  const totalShares = shareData?.totals.shares ?? 0;
  const totalVisits = shareData?.totals.sharedLinkVisits ?? 0;
  const totalAppClicks = shareData?.totals.applicationLinkClicks ?? 0;
  const visitToShareRatio = totalShares > 0
    ? (totalVisits / totalShares).toFixed(1)
    : null;

  return (
    <div className="space-y-8">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            Real metrics from platform interactions and link engagement
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="inline-flex rounded-xl bg-surface-100 dark:bg-surface-800 p-1 self-start sm:self-auto border border-surface-200/60 dark:border-surface-700/60">
          {(['7d', '30d', '90d', 'all'] as const).map(r => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                dateRange === r
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-xs'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              {r === 'all' ? 'All time' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Link Sharing & External Click Analytics Section ──────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Icon icon="solar:share-linear" width={18} className="text-rome-500" />
            Link Sharing & External Click Analytics
            {shareLoading && (
              <span className="text-xs text-surface-400 font-normal">Updating...</span>
            )}
          </h2>
          {shareData?.collectionStartedAt && (
            <span className="text-xs text-surface-400">
              Active since {new Date(shareData.collectionStartedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-surface-500 dark:text-surface-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Opportunity Shares</span>
              <Icon icon="solar:share-linear" width={16} className="text-rome-500" />
            </div>
            <div className="text-2xl font-bold tabular-nums text-surface-900 dark:text-white">
              {totalShares.toLocaleString()}
            </div>
            <p className="text-xs text-surface-400 mt-1">Copy, WhatsApp & Twitter shares</p>
          </div>

          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-surface-500 dark:text-surface-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Shared Link Visits</span>
              <Icon icon="solar:link-linear" width={16} className="text-sky-500" />
            </div>
            <div className="text-2xl font-bold tabular-nums text-surface-900 dark:text-white">
              {totalVisits.toLocaleString()}
            </div>
            <p className="text-xs text-surface-400 mt-1">
              {visitToShareRatio ? `${visitToShareRatio}x visits per share` : 'Attributed via ?ref=share'}
            </p>
          </div>

          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-surface-500 dark:text-surface-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">External App Clicks</span>
              <Icon icon="solar:arrow-right-up-linear" width={16} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-bold tabular-nums text-surface-900 dark:text-white">
              {totalAppClicks.toLocaleString()}
            </div>
            <p className="text-xs text-surface-400 mt-1">Clicks to official application URLs</p>
          </div>

          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-surface-500 dark:text-surface-400 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Top Share Method</span>
              <Icon icon="solar:tuning-2-linear" width={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-bold capitalize text-surface-900 dark:text-white">
              {shareData?.sharesByMethod && Object.keys(shareData.sharesByMethod).length > 0
                ? Object.entries(shareData.sharesByMethod).sort(([, a], [, b]) => b - a)[0][0].replace('_', ' ')
                : 'None yet'}
            </div>
            <p className="text-xs text-surface-400 mt-1">
              {shareData?.sharesByMethod && Object.keys(shareData.sharesByMethod).length > 0
                ? `${Object.entries(shareData.sharesByMethod).sort(([, a], [, b]) => b - a)[0][1]} shares`
                : 'No shares recorded yet'}
            </p>
          </div>
        </div>

        {/* Share Breakdown by Channel */}
        {shareData?.sharesByMethod && Object.keys(shareData.sharesByMethod).length > 0 && (
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
              Shares by Channel
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(shareData.sharesByMethod).map(([method, count]) => (
                <div key={method} className="p-3 bg-surface-50 dark:bg-surface-800/60 rounded-xl">
                  <div className="text-xs text-surface-400 capitalize">{method.replace('_', ' ')}</div>
                  <div className="text-lg font-bold text-surface-900 dark:text-white tabular-nums mt-0.5">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 10 Shared & Top 10 App Clicked Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most-Shared Opportunities */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:share-linear" width={16} className="text-rome-500" />
              Most-Shared Opportunities
            </h3>
            {shareData?.topShared && shareData.topShared.length > 0 ? (
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {shareData.topShared.map((item, idx) => (
                  <div key={item.opportunityId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-bold text-surface-400 w-4 text-right shrink-0">{idx + 1}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-surface-900 dark:text-surface-100 truncate">
                          {item.title}
                        </div>
                        {item.organization && (
                          <div className="text-surface-400 truncate">{item.organization}</div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-surface-900 dark:text-white tabular-nums shrink-0">
                      {item.count} shares
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-400 py-4 text-center">No shares recorded in this period</p>
            )}
          </div>

          {/* Most External App-Link Clicked Opportunities */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:arrow-right-up-linear" width={16} className="text-emerald-500" />
              Top Opportunities by External App Clicks
            </h3>
            {shareData?.topClicked && shareData.topClicked.length > 0 ? (
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {shareData.topClicked.map((item, idx) => (
                  <div key={item.opportunityId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-bold text-surface-400 w-4 text-right shrink-0">{idx + 1}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-surface-900 dark:text-surface-100 truncate">
                          {item.title}
                        </div>
                        {item.organization && (
                          <div className="text-surface-400 truncate">{item.organization}</div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-surface-900 dark:text-white tabular-nums shrink-0">
                      {item.count} clicks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-400 py-4 text-center">No external application clicks recorded in this period</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Platform Oversight & Lifecycle Metrics ───────────────────────── */}
      <div>
        <h2 className="text-base font-bold text-surface-900 dark:text-white mb-4">
          Platform Activity & Lifecycle Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saves */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:heart-linear" width={16} className="text-surface-400" />
              Saves
            </h3>
            <StatRow label="Total saves" value={data.saves.total.toLocaleString()} />
            <StatRow label="Last 7 days" value={data.saves.last7Days.toLocaleString()} />
            <StatRow label="Last 30 days" value={data.saves.last30Days.toLocaleString()} />
          </div>

          {/* Tracked Applications */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:target-linear" width={16} className="text-surface-400" />
              Tracked Applications
            </h3>
            <StatRow label="Total tracked" value={data.tracked.total.toLocaleString()} />
            <StatRow label="Last 7 days" value={data.tracked.last7Days.toLocaleString()} />
            <StatRow label="Last 30 days" value={data.tracked.last30Days.toLocaleString()} />
          </div>

          {/* Task Completion */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:check-circle-linear" width={16} className="text-surface-400" />
              Task Completion
            </h3>
            <StatRow label="Total tasks" value={data.tasks.total.toLocaleString()} />
            <StatRow label="Completed tasks" value={data.tasks.completed.toLocaleString()} />
            <StatRow label="Completion rate" value={data.tasks.completionRate !== null ? `${data.tasks.completionRate}%` : 'No tasks recorded yet'} />
          </div>

          {/* Applications by Status */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:case-linear" width={16} className="text-surface-400" />
              Applications by Status
            </h3>
            {statusEntries.length === 0 ? (
              <p className="text-sm text-surface-400">No applications recorded yet</p>
            ) : (
              statusEntries.map(([s, n]) => (
                <StatRow key={s} label={s} value={n.toLocaleString()} />
              ))
            )}
          </div>

          {/* Community Advice by Outcome */}
          {adviceEntries.length > 0 && (
            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
                <Icon icon="solar:book-2-linear" width={16} className="text-surface-400" />
                Community Advice by Outcome
              </h3>
              {adviceEntries.map(([o, n]) => (
                <StatRow key={o} label={o} value={n.toLocaleString()} />
              ))}
            </div>
          )}

          {/* Reports by Reason */}
          {reportEntries.length > 0 && (
            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
                <Icon icon="solar:shield-warning-linear" width={16} className="text-surface-400" />
                Reports by Reason
              </h3>
              {reportEntries.map(([r, n]) => (
                <StatRow key={r} label={r} value={n.toLocaleString()} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
