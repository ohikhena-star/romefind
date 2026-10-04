import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';

type Tab = 'reviews' | 'reports';

const REPORT_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  REVIEWED: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  RESOLVED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  DISMISSED: 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
};

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<Tab>('reviews');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reportStatus, setReportStatus] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reportTotal, setReportTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res: any = await api.getAdminReviews({ search: reviewSearch, page: reviewPage });
      setReviews(res.data || []);
      setReviewTotal(res.pagination?.total || 0);
    } finally {
      setLoadingReviews(false);
    }
  }, [reviewSearch, reviewPage]);

  const loadReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const res: any = await api.getAdminReports({ status: reportStatus || undefined, page: reportPage });
      setReports(res.data || []);
      setReportTotal(res.pagination?.total || 0);
    } finally {
      setLoadingReports(false);
    }
  }, [reportStatus, reportPage]);

  useEffect(() => { loadReviews(); }, [loadReviews]);
  useEffect(() => { loadReports(); }, [loadReports]);

  const handleUpdateReport = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.updateAdminReport(id, status);
      await loadReports();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Reviews & Reports</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Moderate community advice and opportunity reports</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-200 dark:border-surface-800">
        {(['reviews', 'reports'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-rome-500 text-rome-500'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
            }`}
          >
            {t === 'reviews' ? `Community Advice (${reviewTotal})` : `Reports (${reportTotal})`}
          </button>
        ))}
      </div>

      {/* Reviews Tab */}
      {tab === 'reviews' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Icon icon="solar:magnifer-linear" width={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search advice content…"
              value={reviewSearch}
              onChange={e => { setReviewSearch(e.target.value); setReviewPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/40"
            />
          </div>

          {loadingReviews ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-surface-200 dark:bg-surface-800 rounded-xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-surface-400 text-sm">No community advice found</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r: any) => (
                <div key={r.id} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{r.title || '(untitled)'}</p>
                      <p className="text-xs text-surface-400">
                        by {r.authorName} · {r.authorRole} ·{' '}
                        <span className="text-rome-500">{r.opportunity?.title}</span>
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {r.adviceType && (
                        <span className="text-xs px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-500">{r.adviceType}</span>
                      )}
                      {r.outcomeStatus && (
                        <span className="text-xs px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-500">{r.outcomeStatus}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">{r.content}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-surface-400">
                    <span>👍 {r.upvotes ?? 0}</span>
                    {r.isVerified && <span className="text-emerald-500">✓ Verified</span>}
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {Math.ceil(reviewTotal / 20) > 1 && (
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReviewPage(p => Math.max(1, p - 1))} disabled={reviewPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40">Previous</button>
              <button onClick={() => setReviewPage(p => p + 1)} disabled={reviewPage >= Math.ceil(reviewTotal / 20)}
                className="px-3 py-1.5 text-sm rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            {['', 'PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].map(s => (
              <button
                key={s}
                onClick={() => { setReportStatus(s); setReportPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  reportStatus === s
                    ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent'
                    : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>

          {loadingReports ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-surface-200 dark:bg-surface-800 rounded-xl" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-surface-400 text-sm">No reports found</div>
          ) : (
            <div className="space-y-3">
              {reports.map((r: any) => (
                <div key={r.id} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{r.reason}</p>
                      <p className="text-xs text-surface-400">
                        Opportunity: <span className="text-rome-500">{r.opportunity?.title || r.opportunity?.id}</span>
                        {r.user && ` · Reporter: ${r.user.email}`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${REPORT_STATUS_COLORS[r.status] || ''}`}>
                      {r.status}
                    </span>
                  </div>
                  {r.details && <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">{r.details}</p>}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-surface-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    {r.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateReport(r.id, 'RESOLVED')}
                          disabled={updatingId === r.id}
                          className="ml-auto px-2.5 py-1 text-xs rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleUpdateReport(r.id, 'DISMISSED')}
                          disabled={updatingId === r.id}
                          className="px-2.5 py-1 text-xs rounded-lg border border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {Math.ceil(reportTotal / 20) > 1 && (
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReportPage(p => Math.max(1, p - 1))} disabled={reportPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40">Previous</button>
              <button onClick={() => setReportPage(p => p + 1)} disabled={reportPage >= Math.ceil(reportTotal / 20)}
                className="px-3 py-1.5 text-sm rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
