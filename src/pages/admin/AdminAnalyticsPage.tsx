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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getAdminAnalytics()
      .then((res: any) => setData(res.data))
      .catch((e: any) => setError(e?.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Real metrics from available platform data only</p>
      </div>

      {/* Instrumentation Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex gap-3">
        <Icon icon="solar:info-circle-linear" width={18} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">{data.unavailable.note}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saves */}
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
            <Icon icon="solar:heart-linear" width={16} className="text-surface-400" />
            Saves
          </h2>
          <StatRow label="Total saves" value={data.saves.total.toLocaleString()} />
          <StatRow label="Last 7 days" value={data.saves.last7Days.toLocaleString()} />
          <StatRow label="Last 30 days" value={data.saves.last30Days.toLocaleString()} />
        </div>

        {/* Tracked Applications */}
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
            <Icon icon="solar:target-linear" width={16} className="text-surface-400" />
            Tracked Applications
          </h2>
          <StatRow label="Total tracked" value={data.tracked.total.toLocaleString()} />
          <StatRow label="Last 7 days" value={data.tracked.last7Days.toLocaleString()} />
          <StatRow label="Last 30 days" value={data.tracked.last30Days.toLocaleString()} />
        </div>

        {/* Task Completion */}
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
            <Icon icon="solar:check-circle-linear" width={16} className="text-surface-400" />
            Task Completion
          </h2>
          <StatRow label="Total tasks" value={data.tasks.total.toLocaleString()} />
          <StatRow label="Completed tasks" value={data.tasks.completed.toLocaleString()} />
          <StatRow label="Completion rate" value={data.tasks.completionRate !== null ? `${data.tasks.completionRate}%` : 'No tasks recorded yet'} />
        </div>

        {/* Applications by Status */}
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
            <Icon icon="solar:case-linear" width={16} className="text-surface-400" />
            Applications by Status
          </h2>
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
            <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:book-2-linear" width={16} className="text-surface-400" />
              Community Advice by Outcome
            </h2>
            {adviceEntries.map(([o, n]) => (
              <StatRow key={o} label={o} value={n.toLocaleString()} />
            ))}
          </div>
        )}

        {/* Reports by Reason */}
        {reportEntries.length > 0 && (
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
              <Icon icon="solar:shield-warning-linear" width={16} className="text-surface-400" />
              Reports by Reason
            </h2>
            {reportEntries.map(([r, n]) => (
              <StatRow key={r} label={r} value={n.toLocaleString()} />
            ))}
          </div>
        )}
      </div>

      {/* Unavailable Metrics */}
      <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Metrics requiring event instrumentation</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['Views / Impressions', 'Searches', 'CTA Click-Through Rate', 'View → Save Rate', 'View → Track Rate', 'Active Users'].map(m => (
            <div key={m} className="flex items-center gap-2 text-sm text-surface-400">
              <Icon icon="solar:close-circle-linear" width={14} className="text-surface-300 dark:text-surface-600 shrink-0" />
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
