import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';
import { useOpportunityStore } from '@/store/opportunityStore';

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
  description?: string;
  shortDescription?: string | null;
  opportunityType: string;
  field: string[];
  subfields?: string[];
  location: string;
  country?: string | null;
  remoteStatus?: string;
  deadline: string | null;
  status: string;
  verificationStatus: string;
  isFeatured: boolean;
  applicationUrl: string | null;
  officialSource?: string;
  sourceName?: string | null;
  funding?: string | null;
  fundingType?: string | null;
  fundingAmount?: string | null;
  eligibility?: string[];
  requirements?: string[];
  benefits?: string[];
  createdAt: string;
  updatedAt?: string;
  organization: { id: string; name: string; website?: string } | null;
  missingUrl: boolean;
  missingDeadline: boolean;
  missingField: boolean;
  missingEligibility?: boolean;
  isExpired?: boolean;
  isExpiredStillOpen?: boolean;
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
  EXPIRED: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  REJECTED: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
};

export default function AdminOpportunitiesPage() {
  const { fetchOpportunities } = useOpportunityStore();
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

  // Selected for View / Edit Modal
  const [viewingOpp, setViewingOpp] = useState<AdminOpportunity | null>(null);
  const [editingOpp, setEditingOpp] = useState<AdminOpportunity | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminOpportunity>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Delete confirm modal
  const [deletingOpp, setDeletingOpp] = useState<AdminOpportunity | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [oppRes, qualRes]: [any, any] = await Promise.all([
        api.getAdminOpportunities({ search, page, limit, status, verificationStatus }),
        api.getAdminOpportunityQuality(),
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

  // Quick Action: Toggle Verification (VERIFIED <-> NEEDS_REVIEW)
  const handleToggleVerification = async (opp: AdminOpportunity) => {
    const nextStatus = opp.verificationStatus === 'VERIFIED' ? 'NEEDS_REVIEW' : 'VERIFIED';
    setActionLoading(true);
    try {
      await api.updateAdminOpportunity(opp.id, { verificationStatus: nextStatus });
      setActionSuccess(`Verification updated to ${nextStatus} for "${opp.title}"`);
      await load();
      fetchOpportunities(); // sync public store
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Failed to update verification status');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Action: Toggle Status (OPEN <-> CLOSED)
  const handleToggleStatus = async (opp: AdminOpportunity) => {
    const nextStatus = opp.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    setActionLoading(true);
    try {
      await api.updateAdminOpportunity(opp.id, { status: nextStatus });
      setActionSuccess(`Status changed to ${nextStatus} for "${opp.title}"`);
      await load();
      fetchOpportunities(); // sync public store
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (opp: AdminOpportunity) => {
    setEditingOpp(opp);
    setEditForm({
      title: opp.title,
      description: opp.description || '',
      opportunityType: opp.opportunityType,
      location: opp.location,
      deadline: opp.deadline || '',
      applicationUrl: opp.applicationUrl || '',
      officialSource: opp.officialSource || '',
      status: opp.status,
      verificationStatus: opp.verificationStatus,
      isFeatured: opp.isFeatured,
      funding: opp.funding || '',
      fundingType: opp.fundingType || '',
      field: opp.field || [],
    });
  };

  // Save Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp) return;
    setActionLoading(true);
    try {
      await api.updateAdminOpportunity(editingOpp.id, editForm);
      setActionSuccess(`Updated "${editForm.title || editingOpp.title}" successfully`);
      setEditingOpp(null);
      await load();
      fetchOpportunities();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Failed to save changes');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingOpp) return;
    setActionLoading(true);
    try {
      await api.deleteAdminOpportunity(deletingOpp.id);
      setActionSuccess(`Deleted "${deletingOpp.title}"`);
      setDeletingOpp(null);
      await load();
      fetchOpportunities();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete opportunity');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">Opportunity Management</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            {total.toLocaleString()} total database records · verify, publish, edit, and clean up listings
          </p>
        </div>
        <button
          onClick={() => load()}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <Icon icon="solar:refresh-linear" width={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Action Success Alert */}
      {actionSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 text-emerald-800 dark:text-emerald-300 text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Icon icon="solar:check-circle-linear" width={18} className="text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <Icon icon="solar:close-circle-linear" width={16} />
          </button>
        </div>
      )}

      {/* Quality Summary */}
      {quality && (
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center gap-2">
            <Icon icon="solar:shield-warning-linear" width={16} className="text-amber-500" />
            Quality Audits — {quality.total} opportunities with quality flags
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
          <option value="EXPIRED">EXPIRED</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">{error}</div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Opportunity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Type / Field</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Deadline</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Verification</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Audits</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : opps.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-surface-400 text-sm">No opportunities match the criteria</td>
              </tr>
            ) : opps.map(o => (
              <tr key={o.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <button
                    onClick={() => setViewingOpp(o)}
                    className="font-medium text-surface-900 dark:text-white line-clamp-1 hover:text-rome-500 text-left cursor-pointer"
                    title={o.title}
                  >
                    {o.title}
                  </button>
                  <div className="text-xs text-surface-400">{o.organization?.name || '—'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-surface-700 dark:text-surface-300 text-xs font-medium">{o.opportunityType}</div>
                  <div className="text-xs text-surface-400">{o.field[0] || '—'}</div>
                </td>
                <td className="px-4 py-3 text-xs text-surface-500">
                  <span className={o.isExpired ? "text-red-500 font-medium" : ""}>
                    {o.deadline || '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(o)}
                    title="Click to toggle OPEN / CLOSED"
                    className={`text-xs px-2 py-0.5 rounded font-medium cursor-pointer transition-opacity hover:opacity-80 ${STATUS_COLORS[o.status] || ''}`}
                  >
                    {o.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleVerification(o)}
                    title="Click to toggle VERIFIED / NEEDS_REVIEW"
                    className={`text-xs px-2 py-0.5 rounded font-medium cursor-pointer transition-opacity hover:opacity-80 ${VERIFY_COLORS[o.verificationStatus] || ''}`}
                  >
                    {o.verificationStatus}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    {o.missingUrl && <span title="Missing Application URL" className="text-red-400"><Icon icon="solar:link-broken-minimalistic-linear" width={15} /></span>}
                    {o.missingDeadline && <span title="Missing deadline" className="text-amber-400"><Icon icon="solar:clock-circle-linear" width={15} /></span>}
                    {o.missingField && <span title="Missing field" className="text-orange-400"><Icon icon="solar:tag-linear" width={15} /></span>}
                    {o.isExpiredStillOpen && <span title="Expired deadline but status still OPEN" className="text-red-500 font-bold text-xs">EXP</span>}
                    {!o.missingUrl && !o.missingDeadline && !o.missingField && !o.isExpiredStillOpen && (
                      <Icon icon="solar:check-circle-linear" width={15} className="text-emerald-400" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setViewingOpp(o)}
                      className="p-1.5 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                      title="View details"
                    >
                      <Icon icon="solar:eye-linear" width={15} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(o)}
                      className="p-1.5 text-surface-500 hover:text-rome-500 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                      title="Edit record"
                    >
                      <Icon icon="solar:pen-2-linear" width={15} />
                    </button>
                    <button
                      onClick={() => setDeletingOpp(o)}
                      className="p-1.5 text-surface-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      title="Delete record"
                    >
                      <Icon icon="solar:trash-bin-minimalistic-linear" width={15} />
                    </button>
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
          <div key={o.id} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4 space-y-3 shadow-2xs">
            <div>
              <p className="font-medium text-surface-900 dark:text-white text-sm line-clamp-2">{o.title}</p>
              <p className="text-xs text-surface-400 mt-0.5">{o.organization?.name || '—'}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className={`px-2 py-0.5 rounded font-medium ${STATUS_COLORS[o.status] || ''}`}>{o.status}</span>
              <span className={`px-2 py-0.5 rounded font-medium ${VERIFY_COLORS[o.verificationStatus] || ''}`}>{o.verificationStatus}</span>
              {o.deadline && <span className="px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">{o.deadline}</span>}
              {o.missingUrl && <span className="px-2 py-0.5 rounded bg-red-50 text-red-600">No URL</span>}
              {o.missingDeadline && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700">No deadline</span>}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-800 text-xs">
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleVerification(o)}
                  className="text-rome-600 hover:underline font-medium"
                >
                  {o.verificationStatus === 'VERIFIED' ? 'Unverify' : 'Verify'}
                </button>
                <span>·</span>
                <button
                  onClick={() => handleToggleStatus(o)}
                  className="text-surface-600 dark:text-surface-300 hover:underline"
                >
                  {o.status === 'OPEN' ? 'Close' : 'Reopen'}
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(o)} className="text-rome-600 hover:underline font-medium">Edit</button>
                <span>·</span>
                <button onClick={() => setDeletingOpp(o)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm pt-2">
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

      {/* ─── 1. View Detail Modal ─── */}
      {viewingOpp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-surface-200 dark:border-surface-800 shadow-xl text-left">
            <div className="flex items-start justify-between gap-4 border-b border-surface-100 dark:border-surface-800 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rome-500">{viewingOpp.opportunityType}</span>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mt-0.5">{viewingOpp.title}</h2>
                <p className="text-xs text-surface-400">{viewingOpp.organization?.name || 'Unknown Provider'}</p>
              </div>
              <button onClick={() => setViewingOpp(null)} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200">
                <Icon icon="solar:close-circle-linear" width={22} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <span className="text-surface-400 block mb-0.5">Status</span>
                <span className={`px-2 py-0.5 rounded font-medium inline-block ${STATUS_COLORS[viewingOpp.status] || ''}`}>{viewingOpp.status}</span>
              </div>
              <div className="p-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <span className="text-surface-400 block mb-0.5">Verification</span>
                <span className={`px-2 py-0.5 rounded font-medium inline-block ${VERIFY_COLORS[viewingOpp.verificationStatus] || ''}`}>{viewingOpp.verificationStatus}</span>
              </div>
              <div className="p-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <span className="text-surface-400 block mb-0.5">Deadline</span>
                <span className="font-semibold text-surface-900 dark:text-white">{viewingOpp.deadline || 'Rolling / None'}</span>
              </div>
              <div className="p-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <span className="text-surface-400 block mb-0.5">Location</span>
                <span className="font-semibold text-surface-900 dark:text-white">{viewingOpp.location || 'Global'}</span>
              </div>
            </div>

            {viewingOpp.description && (
              <div>
                <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Description</h3>
                <p className="text-xs sm:text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line bg-surface-50 dark:bg-surface-800/30 p-3 rounded-xl border border-surface-100 dark:border-surface-800">
                  {viewingOpp.description}
                </p>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <p><strong className="text-surface-500">Official Portal:</strong>{' '}
                {viewingOpp.applicationUrl ? (
                  <a href={viewingOpp.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-rome-600 hover:underline break-all">
                    {viewingOpp.applicationUrl}
                  </a>
                ) : <span className="text-red-500">None</span>}
              </p>
              {viewingOpp.officialSource && (
                <p><strong className="text-surface-500">Source:</strong>{' '}
                  <a href={viewingOpp.officialSource} target="_blank" rel="noopener noreferrer" className="text-surface-600 hover:underline break-all">
                    {viewingOpp.officialSource}
                  </a>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
              <button
                onClick={() => { setViewingOpp(null); handleOpenEdit(viewingOpp); }}
                className="px-4 py-2 bg-rome-500 hover:bg-rome-600 text-white rounded-xl text-xs font-semibold"
              >
                Edit Record
              </button>
              <button
                onClick={() => setViewingOpp(null)}
                className="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. Edit Record Modal ─── */}
      {editingOpp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white dark:bg-surface-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-surface-200 dark:border-surface-800 shadow-xl text-left">
            <div className="flex items-start justify-between border-b border-surface-100 dark:border-surface-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white">Edit Opportunity Record</h2>
                <p className="text-xs text-surface-400">ID: {editingOpp.id}</p>
              </div>
              <button type="button" onClick={() => setEditingOpp(null)} className="text-surface-400 hover:text-surface-600">
                <Icon icon="solar:close-circle-linear" width={22} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Opportunity Type</label>
                  <input
                    type="text"
                    value={editForm.opportunityType || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, opportunityType: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Deadline (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={editForm.deadline || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, deadline: e.target.value || null }))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Publication Status</label>
                  <select
                    value={editForm.status || 'OPEN'}
                    onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                  >
                    <option value="OPEN">OPEN (Published)</option>
                    <option value="CLOSED">CLOSED (Unpublished)</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="UPCOMING">UPCOMING</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Verification Status</label>
                  <select
                    value={editForm.verificationStatus || 'VERIFIED'}
                    onChange={e => setEditForm(prev => ({ ...prev, verificationStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="NEEDS_REVIEW">NEEDS_REVIEW</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Application URL</label>
                <input
                  type="url"
                  required
                  value={editForm.applicationUrl || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, applicationUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editForm.description || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
              <button
                type="button"
                onClick={() => setEditingOpp(null)}
                className="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 bg-rome-500 hover:bg-rome-600 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── 3. Delete Confirmation Modal ─── */}
      {deletingOpp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-surface-200 dark:border-surface-800 shadow-xl text-left">
            <div className="flex items-center gap-2.5 text-red-600">
              <Icon icon="solar:danger-circle-linear" width={24} />
              <h2 className="text-base font-bold">Delete Opportunity Record?</h2>
            </div>
            <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-surface-900 dark:text-white">"{deletingOpp.title}"</strong>?
              This will remove the opportunity from the catalog and cascade to related saved bookmarks. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-100 dark:border-surface-800">
              <button
                type="button"
                onClick={() => setDeletingOpp(null)}
                className="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
