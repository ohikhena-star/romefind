import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';

interface FieldData {
  fieldName: string;
  totalCount: number;
  activeCount: number;
  saves: number;
  types: string[];
  coverage: 'Healthy' | 'Limited' | 'Very Limited' | 'Zero';
}

const COVERAGE_CONFIG: Record<FieldData['coverage'], { label: string; color: string; badge: string }> = {
  Healthy: { label: 'Healthy', color: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  Limited: { label: 'Limited', color: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'Very Limited': { label: 'Very Limited', color: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  Zero: { label: 'Zero', color: 'text-red-600 dark:text-red-400', badge: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
};

export default function AdminFieldsPage() {
  const [fields, setFields] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    api.getAdminFields()
      .then((res: any) => setFields(res.data || []))
      .catch((e: any) => setError(e?.message || 'Failed to load fields'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = fields.filter(f =>
    !filter || f.coverage === filter || f.fieldName.toLowerCase().includes(filter.toLowerCase())
  );

  const summary = {
    healthy: fields.filter(f => f.coverage === 'Healthy').length,
    limited: fields.filter(f => f.coverage === 'Limited').length,
    veryLimited: fields.filter(f => f.coverage === 'Very Limited').length,
    zero: fields.filter(f => f.coverage === 'Zero').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Fields & Coverage</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
          Opportunity inventory coverage across all {fields.length} canonical fields
        </p>
      </div>

      {/* Coverage Summary */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Healthy (≥3 active)', count: summary.healthy, color: 'text-emerald-600' },
            { label: 'Limited (1–2 active)', count: summary.limited, color: 'text-amber-600' },
            { label: 'Very Limited (0 active)', count: summary.veryLimited, color: 'text-orange-600' },
            { label: 'Zero (no opps)', count: summary.zero, color: 'text-red-600' },
          ].map(item => (
            <div key={item.label} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4 text-center">
              <p className={`text-3xl font-bold tabular-nums ${item.color}`}>{item.count}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        {['', 'Zero', 'Very Limited', 'Limited', 'Healthy'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              filter === f
                ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent'
                : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800'
            }`}
          >
            {f || 'All fields'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">{error}</div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Field</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Active</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Total</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Saves</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Types</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-surface-400 text-sm">No fields match this filter</td>
              </tr>
            ) : filtered.map(f => {
              const cfg = COVERAGE_CONFIG[f.coverage];
              return (
                <tr key={f.fieldName} className="hover:bg-surface-50 dark:hover:bg-surface-800/30">
                  <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">{f.fieldName}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-surface-900 dark:text-white">{f.activeCount}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-surface-500">{f.totalCount}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-surface-500">{f.saves}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {f.types.slice(0, 3).map(t => (
                        <span key={t} className="text-xs bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                      {f.types.length > 3 && <span className="text-xs text-surface-400">+{f.types.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${cfg.badge}`}>{cfg.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {!loading && filtered.map(f => {
          const cfg = COVERAGE_CONFIG[f.coverage];
          return (
            <div key={f.fieldName} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">{f.fieldName}</p>
                <p className="text-xs text-surface-400">{f.activeCount} active · {f.totalCount} total · {f.saves} saves</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ml-2 ${cfg.badge}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
