import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';

interface HealthData {
  api: { status: string; timestamp: string };
  database: { status: string; message: string };
  opportunities: { active: number; expired: number; needsReview: number };
  eventInstrumentation: { status: string; behaviourSignalCount: number; note: string };
  version: string;
}

type StatusLevel = 'ok' | 'warning' | 'error' | 'info';

function StatusDot({ level }: { level: StatusLevel }) {
  const colors = {
    ok: 'bg-emerald-500',
    warning: 'bg-amber-400',
    error: 'bg-red-500',
    info: 'bg-surface-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${colors[level]}`} />;
}

function HealthCard({ title, icon, status, children }: { title: string; icon: string; status: StatusLevel; children: React.ReactNode }) {
  const borderColors = { ok: '', warning: 'border-amber-200 dark:border-amber-800', error: 'border-red-200 dark:border-red-800', info: '' };
  return (
    <div className={`bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 ${borderColors[status]} rounded-xl p-5`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-400">
          <Icon icon={icon} width={18} />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">{title}</h3>
          <StatusDot level={status} />
        </div>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm border-b border-surface-100 dark:border-surface-800 last:border-0">
      <span className="text-surface-500 dark:text-surface-400">{label}</span>
      <span className="font-medium text-surface-900 dark:text-white text-right">{value}</span>
    </div>
  );
}

export default function AdminSystemHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshed, setRefreshed] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getAdminSystemHealth()
      .then((res: any) => setData(res.data))
      .catch((e: any) => setError(e?.message || 'Failed to load system health'))
      .finally(() => setLoading(false));
  }, [refreshed]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 bg-surface-200 dark:bg-surface-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-400">
        <p className="font-semibold">Failed to load system health</p>
        <p className="text-sm mt-1">{error}</p>
        <button onClick={() => setRefreshed(r => r + 1)} className="mt-3 text-sm text-rome-500 hover:underline">Retry</button>
      </div>
    );
  }

  const apiLevel: StatusLevel = data.api.status === 'ok' ? 'ok' : 'error';
  const dbLevel: StatusLevel = data.database.status === 'ok' ? 'ok' : 'error';
  const instrLevel: StatusLevel = data.eventInstrumentation.status === 'not_active' ? 'warning' : 'ok';
  const oppsLevel: StatusLevel = data.opportunities.needsReview > 0 ? 'warning' : 'ok';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">System Health</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Last checked: {new Date(data.api.timestamp).toLocaleTimeString()}</p>
        </div>
        <button
          onClick={() => setRefreshed(r => r + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-800 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800"
        >
          <Icon icon="solar:refresh-linear" width={14} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* API */}
        <HealthCard title="API" icon="solar:server-linear" status={apiLevel}>
          <Row label="Status" value={<span className="text-emerald-500 font-semibold">Operational</span>} />
          <Row label="Version" value={data.version} />
          <Row label="Timestamp" value={new Date(data.api.timestamp).toLocaleTimeString()} />
        </HealthCard>

        {/* Database */}
        <HealthCard title="Database" icon="solar:database-linear" status={dbLevel}>
          <Row label="Status" value={
            dbLevel === 'ok'
              ? <span className="text-emerald-500 font-semibold">Connected</span>
              : <span className="text-red-500 font-semibold">Error</span>
          } />
          <Row label="Message" value={data.database.message} />
        </HealthCard>

        {/* Opportunities */}
        <HealthCard title="Opportunities" icon="solar:case-linear" status={oppsLevel}>
          <Row label="Active (OPEN)" value={data.opportunities.active.toLocaleString()} />
          <Row label="Expired" value={data.opportunities.expired.toLocaleString()} />
          <Row label="Needs Review" value={
            <span className={data.opportunities.needsReview > 0 ? 'text-amber-500 font-semibold' : ''}>
              {data.opportunities.needsReview.toLocaleString()}
            </span>
          } />
        </HealthCard>

        {/* Event Instrumentation */}
        <HealthCard title="Event Instrumentation" icon="solar:graph-up-linear" status={instrLevel}>
          <Row label="Status" value={<span className="text-amber-500 font-semibold">Not Active</span>} />
          <Row label="BehaviourSignal records" value={data.eventInstrumentation.behaviourSignalCount.toLocaleString()} />
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400">{data.eventInstrumentation.note}</p>
          </div>
        </HealthCard>
      </div>
    </div>
  );
}
