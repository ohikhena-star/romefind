import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';

interface QualitySummary {
  total: number;
  missingUrl: number;
  missingDeadline: number;
  missingField: number;
  expiredStillOpen: number;
  needsReview: number;
}

interface AdminOpportunity {
  id: string;
  title: string;
  opportunityType: string;
  field: string[];
  location: string;
  deadline: string | null;
  status: string;
  verificationStatus: string;
  isFeatured: boolean;
  applicationUrl: string | null;
  createdAt: string;
  organization: { id: string; name: string } | null;
  missingUrl: boolean;
  missingDeadline: boolean;
  missingField: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CLOSED: 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
  EXPIRED: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  UPCOMING: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
};

const VERIFY_COLORS: Record<string, string> = {
  VERIFIED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  NEEDS_REVIEW: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  UNVERIFIED: 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
};

export default function AdminOpportunitiesPage() {
  const [opps, setOpps] = useState<AdminOpportunity[]>([]);
  const [quality, setQuality] = useState<QualitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [oppRes, qualRes]: [any, any] = await Promise.all([
        api.getAdminOpportunities({ search, page, limit, status, verificationStatus }),
        quality === null ? api.getAdminOpportunityQuality() : Promise.resolve(null),
      ]);
      setOpps(oppRes.data || []);
      setTotal(oppRes.pagination?.total || 0);
      if (qualRes) setQuality(qualRes.data?.summary || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, [search, page, status, verificationStatus]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Opportunities</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{total.toLocaleString()} total opportunities</p>
      </div>

      {/* Quality Summary */}
      {quality && (
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
            <Icon icon="solar:shield-warning-linear" width={16} className="text-amber-500" />
            Quality Issues — {quality.total} opportunities affected
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Missing URL', count: quality.missingUrl, color: 'text-red-500' },
              { label: 'Missing Deadline', count: quality.missingDeadline, color: 'text-amber-500' },
              { label: 'Missing Field', count: quality.missingField, color: 'text-orange-500' },
              { label: 'Expired but Open', count: quality.expiredStillOpen, color: 'text-red-600' },
              { label: 'Needs Review', count: quality.needsReview, color: 'text-surface-500' },
            ].map(item => (
              <div key={item.label} className="text-center p-2 rounded-lg bg-surface-50 dark:bg-surface-800">
                <p className={`text-2xl font-bold tabular-nums ${item.color}`}>{item.count}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Icon icon="solar:magnifer-linear" width={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search by title or organization…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/40"
          />
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg text-surface-700 dark:text-surface-300 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
          <option value="EXPIRED">EXPIRED</option>
          <option value="UPCOMING">UPCOMING</option>
        </select>
        <select
          value={verificationStatus}
          onChange={e => { setVerificationStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg text-surface-700 dark:text-surface-300 focus:outline-none"
        >
          <option value="">All verification</option>
          <option value="VERIFIED">VERIFIED</option>
          <option value="PENDING">PENDING</option>
          <option value="NEEDS_REVIEW">NEEDS_REVIEW</option>
          <option value="UNVERIFIED">UNVERIFIED</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">{error}</div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Opportunity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Type / Field</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Deadline</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Verification</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : opps.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-surface-400 text-sm">No opportunities found</td>
              </tr>
            ) : opps.map(o => (
              <tr key={o.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30">
                <td className="px-4 py-3 max-w-xs">
                  <div className="font-medium text-surface-900 dark:text-white line-clamp-1">{o.title}</div>
                  <div className="text-xs text-surface-400">{o.organization?.name || '—'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-surface-700 dark:text-surface-300">{o.opportunityType}</div>
                  <div className="text-xs text-surface-400">{o.field[0] || '—'}</div>
                </td>
                <td className="px-4 py-3 text-xs text-surface-500">{o.deadline || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[o.status] || ''}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${VERIFY_COLORS[o.verificationStatus] || ''}`}>{o.verificationStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {o.missingUrl && <span title="Missing URL" className="text-red-400"><Icon icon="solar:link-broken-minimalistic-linear" width={14} /></span>}
                    {o.missingDeadline && <span title="Missing deadline" className="text-amber-400"><Icon icon="solar:clock-circle-linear" width={14} /></span>}
                    {o.missingField && <span title="Missing field" className="text-orange-400"><Icon icon="solar:tag-linear" width={14} /></span>}
                    {!o.missingUrl && !o.missingDeadline && !o.missingField && (
                      <Icon icon="solar:check-circle-linear" width={14} className="text-emerald-400" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {!loading && opps.map(o => (
          <div key={o.id} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <p className="font-medium text-surface-900 dark:text-white text-sm line-clamp-2">{o.title}</p>
            <p className="text-xs text-surface-400 mt-0.5">{o.organization?.name || '—'}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[o.status] || ''}`}>{o.status}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${VERIFY_COLORS[o.verificationStatus] || ''}`}>{o.verificationStatus}</span>
              {o.missingUrl && <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">No URL</span>}
              {o.missingDeadline && <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">No deadline</span>}
              {o.missingField && <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700">No field</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-surface-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-800">
              Previous
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-800">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
