import React from 'react';
import { useApp } from '../context/AppContext';
import { SuperAdminUpiSettings } from '../components/SuperAdminUpiSettings';
import { Building2, ShieldCheck, DollarSign, Users, CheckCircle2, AlertTriangle, ArrowUpRight, Plus, Award } from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { pgs, auditLogs } = useApp();

  const totalRevenue = pgs.reduce((acc, pg) => acc + pg.monthlyRevenue, 0);
  const totalBeds = pgs.reduce((acc, pg) => acc + pg.totalBeds, 0);
  const totalOccupied = pgs.reduce((acc, pg) => acc + pg.occupiedBeds, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
              <ShieldCheck className="h-3.5 w-3.5" /> Super Admin Command Center
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight">Platform Master Control</h1>
            <p className="mt-1 text-xs text-indigo-200">
              Managing enterprise PG properties, subscription tiers, platform revenue, and security compliance.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-purple-950 shadow-lg hover:bg-slate-100">
            <Plus className="h-4 w-4" /> Onboard New PG Owner
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Total PG Properties</span>
            <div className="mt-1 text-xl font-black">{pgs.length} Active</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Network Capacity</span>
            <div className="mt-1 text-xl font-black">{totalOccupied} / {totalBeds} Beds</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Monthly Gross Rent</span>
            <div className="mt-1 text-xl font-black text-emerald-400">₹{(totalRevenue / 100000).toFixed(2)} Lakhs</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Subscription Tiers</span>
            <div className="mt-1 text-xl font-black text-amber-300">Enterprise Tiers</div>
          </div>
        </div>
      </div>

      {/* PG Properties Directory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered PG & Hostel Properties</h3>
        <p className="text-xs text-slate-500 mb-4">Verification status and subscription plan management</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="p-3">PG Property</th>
                <th className="p-3">Owner & Contact</th>
                <th className="p-3">Occupancy</th>
                <th className="p-3">Monthly Rent</th>
                <th className="p-3">Subscription</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pgs.map((pg) => (
                <tr key={pg.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{pg.name}</div>
                    <div className="text-[10px] text-slate-400">{pg.city}, {pg.state} • Code: {pg.code}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{pg.ownerName}</div>
                    <div className="text-[10px] text-slate-400">{pg.contactPhone}</div>
                  </td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                    {pg.occupiedBeds} / {pg.totalBeds} Beds ({Math.round((pg.occupiedBeds / pg.totalBeds) * 100)}%)
                  </td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{pg.monthlyRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                      {pg.subscriptionPlan}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                      Settings
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Security Audit Logs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Platform Audit Trail</h3>
        <p className="text-xs text-slate-500 mb-3">Real-time system events, payment verifications, and user actions</p>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{log.action}</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">{log.details}</p>
                <span className="text-[10px] text-slate-400">By {log.performedBy} ({log.role})</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Super Admin Global UPI & Gateway Settings */}
      <SuperAdminUpiSettings />
    </div>
  );
};
