import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  Search,
  Filter,
  Lock,
  Terminal,
  Activity,
  CheckCircle2,
  KeyRound,
  UserCheck
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-27 00:04:12',
    user: 'Vikramaditya Sharma',
    role: 'SUPER_ADMIN',
    action: 'LOGIN_AUTHENTICATED',
    ipAddress: '103.220.12.89',
    status: 'SUCCESS',
    details: 'Authenticated via OAuth JWT bearer token.'
  },
  {
    id: 'log-102',
    timestamp: '2026-07-26 22:15:40',
    user: 'Suresh Patel',
    role: 'ACCOUNTANT',
    action: 'VERIFY_UPI_PAYMENT',
    ipAddress: '115.110.45.12',
    status: 'SUCCESS',
    details: 'Approved rent receipt #REC-2026-8831 for Aarav Mehta (₹9,000).'
  },
  {
    id: 'log-103',
    timestamp: '2026-07-26 21:05:18',
    user: 'Ramesh Sundaram',
    role: 'WARDEN',
    action: 'ADMIT_RESIDENT',
    ipAddress: '103.220.12.92',
    status: 'SUCCESS',
    details: 'Allocated Bed 102-B to Ananya Sharma with verified Aadhaar.'
  },
  {
    id: 'log-104',
    timestamp: '2026-07-26 19:40:02',
    user: 'Unknown User',
    role: 'ANONYMOUS',
    action: 'LOGIN_ATTEMPT_FAILED',
    ipAddress: '45.122.89.10',
    status: 'WARNING',
    details: 'Failed password challenge for admin account. Rate limit triggered.'
  },
  {
    id: 'log-105',
    timestamp: '2026-07-26 18:30:00',
    user: 'Rajesh Kumar Agarwal',
    role: 'PG_OWNER',
    action: 'UPDATE_BANK_UPI',
    ipAddress: '103.220.12.89',
    status: 'SUCCESS',
    details: 'Updated PG UPI VPA to royalpalms@icici and refreshed QR code.'
  }
];

export const AuditLogsView: React.FC = () => {
  const { activePg } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'FAILED'>('ALL');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && log.status === statusFilter;
  });

  const exportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Timestamp,User,Role,Action,IP Address,Status,Details"].join(",") + "\n"
      + MOCK_AUDIT_LOGS.map(l => `${l.id},"${l.timestamp}","${l.user}",${l.role},${l.action},${l.ipAddress},${l.status},"${l.details}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Security_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Platform Security & Audit Logs</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> AES-256 Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activePg.name} • Immutable system activity stream, IP tracking, and role permission history
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <Download className="h-4 w-4" /> Export Security Audit CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total System Events</div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">1,482 Logs</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Admin Sessions</div>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">6 Authenticated</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Failed Access Blocked</div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">2 Attempts</div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, action, IP address or log details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(['ALL', 'SUCCESS', 'WARNING', 'FAILED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  statusFilter === st
                    ? 'bg-white text-indigo-700 shadow dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User Persona</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-white">{log.user}</div>
                    <div className="text-[10px] text-slate-400">{log.role.replace('_', ' ')}</div>
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {log.status === 'SUCCESS' ? <CheckCircle2 className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      {log.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-600 dark:text-slate-300 text-[11px]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
