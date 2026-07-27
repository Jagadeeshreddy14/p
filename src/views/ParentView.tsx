import React from 'react';
import { useApp } from '../context/AppContext';
import { FeatureModuleGrid } from '../components/FeatureModuleGrid';
import { ShieldCheck, Clock, PhoneCall, QrCode, Heart, CheckCircle2 } from 'lucide-react';

export const ParentView: React.FC = () => {
  const { residents, attendance, payments, activePg } = useApp();
  const child = residents[0]; // Aarav Mehta

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
          <Heart className="h-3.5 w-3.5 text-rose-400" /> Parent & Guardian Safety Portal
        </span>
        <h1 className="mt-2 text-xl font-black">Child Security & Attendance Overview</h1>
        <p className="mt-1 text-xs text-rose-200">
          Monitoring live gate check-in status, weekend passes, and rent payments for <span className="font-bold text-white">{child?.name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hostel & Room</span>
          <div className="mt-1 font-bold text-slate-900 dark:text-white text-sm">{activePg.name}</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Room {child?.roomNumber} (Bed {child?.bedCode})</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Attendance</span>
          <div className="mt-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="h-4 w-4" /> Present inside Hostel
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">In-time recorded: 09:12 PM</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rent Status</span>
          <div className="mt-1 font-bold text-slate-900 dark:text-white text-sm">₹9,000 / Month</div>
          <span className="inline-block mt-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            PAID FOR JULY
          </span>
        </div>
      </div>

      {/* Attendance & Pass History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gate Pass & Night Out Approvals</h3>
        <p className="text-xs text-slate-500 mb-3">Live audit log of child gate entries and weekend family leaves</p>

        <div className="space-y-2">
          {attendance.map((att) => (
            <div key={att.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{att.date}</span>
                <p className="text-slate-500 text-[11px] mt-0.5">Status: <span className="font-semibold text-slate-800 dark:text-slate-200">{att.status}</span></p>
                {att.gatePassReason && <p className="text-[10px] text-indigo-600 dark:text-indigo-400">Reason: {att.gatePassReason}</p>}
              </div>
              <span className="text-[10px] font-mono text-slate-400">{att.checkInTime || att.checkOutTime || '09:00 PM'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Modules Grid */}
      <FeatureModuleGrid />
    </div>
  );
};
