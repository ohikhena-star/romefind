import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import api from '@/api/client';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  onboardingCompleted: boolean;
  createdAt: string;
  profile: {
    completeness: number;
    currentStatus: string | null;
    experienceLevel: string | null;
    interests: string[];
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [onboarded, setOnboarded] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.getAdminUsers({ search, page, limit, onboarded, role });
      setUsers(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (e: any) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, page, onboarded, role]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Users</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{total.toLocaleString()} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Icon icon="solar:magnifer-linear" width={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/40"
          />
        </div>
        <select
          value={onboarded}
          onChange={e => { setOnboarded(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg text-surface-700 dark:text-surface-300 focus:outline-none"
        >
          <option value="">All onboarding</option>
          <option value="true">Onboarded</option>
          <option value="false">Not onboarded</option>
        </select>
        <select
          value={role}
          onChange={e => { setRole(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg text-surface-700 dark:text-surface-300 focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="USER">USER</option>
          <option value="PROVIDER">PROVIDER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-800">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Onboarded</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Experience</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Completeness</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-48" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-12" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-24" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-surface-400 text-sm">No users found</td>
              </tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-surface-900 dark:text-white">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-surface-400">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    u.role === 'ADMIN'
                      ? 'bg-rome-500/10 text-rome-600 dark:text-rome-400'
                      : u.role === 'PROVIDER'
                      ? 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'
                      : 'text-surface-400'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Icon
                    icon={u.onboardingCompleted ? 'solar:check-circle-bold' : 'solar:close-circle-linear'}
                    width={16}
                    className={u.onboardingCompleted ? 'text-emerald-500' : 'text-surface-300 dark:text-surface-600'}
                  />
                </td>
                <td className="px-4 py-3 text-surface-600 dark:text-surface-300 text-xs">{u.profile?.experienceLevel || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full max-w-16">
                      <div
                        className="h-1.5 bg-rome-500 rounded-full"
                        style={{ width: `${u.profile?.completeness ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-surface-400 tabular-nums">{u.profile?.completeness ?? 0}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-surface-400">
                  {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
          ))
        ) : users.map(u => (
          <div key={u.id} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-surface-900 dark:text-white text-sm">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-surface-400">{u.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${
                u.role === 'ADMIN' ? 'bg-rome-500/10 text-rome-600' : 'bg-surface-100 dark:bg-surface-800 text-surface-500'
              }`}>{u.role}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-surface-400">
              <span>{u.onboardingCompleted ? '✓ Onboarded' : 'Not onboarded'}</span>
              <span>·</span>
              <span>Profile {u.profile?.completeness ?? 0}%</span>
              <span>·</span>
              <span>{new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-surface-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-800"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 disabled:opacity-40 hover:bg-surface-50 dark:hover:bg-surface-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
