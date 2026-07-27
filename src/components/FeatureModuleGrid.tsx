import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BedDouble,
  Users,
  QrCode,
  AlertCircle,
  Clock,
  UserCheck,
  Utensils,
  Shirt,
  Boxes,
  BellRing,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const FeatureModuleGrid: React.FC = () => {
  const { setActiveTab, complaints, payments, residents, rooms, visitors, parcels, inventory, notices } = useApp();

  const pendingPayments = payments.filter(p => p.status === 'PENDING_VERIFICATION').length;
  const openComplaints = complaints.filter(c => c.status === 'OPEN').length;

  const features = [
    {
      id: 'rooms',
      title: 'Rooms & Beds',
      desc: 'Interactive grid floor map & bed availability matrix.',
      icon: BedDouble,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: `${rooms.length} Rooms`
    },
    {
      id: 'residents',
      title: 'Resident Roster',
      desc: 'Admitted tenants directory, contact details & Aadhaar KYC.',
      icon: Users,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      badge: `${residents.length} Tenants`
    },
    {
      id: 'rent-upi',
      title: 'Rent & UPI QR',
      desc: 'Dynamic UPI QR generator, rent ledger & verification desk.',
      icon: QrCode,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: pendingPayments > 0 ? `${pendingPayments} Pending` : 'Auto UPI'
    },
    {
      id: 'upi-settings',
      title: 'UPI VPA Settings',
      desc: 'Configure bank VPA, merchant handle & automated QR code rules.',
      icon: QrCode,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      badge: 'Merchant UPI'
    },
    {
      id: 'complaints',
      title: 'Complaints Desk',
      desc: 'Maintenance ticketers with photo upload & warden SLA resolution.',
      icon: AlertCircle,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      badge: openComplaints > 0 ? `${openComplaints} Open` : 'Resolved'
    },
    {
      id: 'attendance',
      title: 'Attendance & Gate Pass',
      desc: 'Night-out passes, QR check-in & student attendance tracker.',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badge: 'QR Attendance'
    },
    {
      id: 'visitors',
      title: 'Visitor Pass QR',
      desc: 'Parent & guest entry passes, visitor logbook with OTP.',
      icon: UserCheck,
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      badge: `${visitors.length} Visitors`
    },
    {
      id: 'mess',
      title: 'Food & Mess Menu',
      desc: 'Weekly 4-meal plan schedule, dish ratings & dietary feedback.',
      icon: Utensils,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      badge: '4.8 ★ Menu'
    },
    {
      id: 'laundry-parcels',
      title: 'Laundry & Parcels',
      desc: 'Gate courier parcel intake OTP & washing machine slots.',
      icon: Shirt,
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      badge: `${parcels.length} Parcels`
    },
    {
      id: 'inventory',
      title: 'Inventory & Assets',
      desc: 'Hostel appliances, CCTV cameras, WiFi routers & asset audit.',
      icon: Boxes,
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      badge: `${inventory.length} Assets`
    },
    {
      id: 'notices',
      title: 'Notices & Broadcasts',
      desc: 'Emergency hostel announcements & WhatsApp broadcast alerts.',
      icon: BellRing,
      color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      badge: `${notices.length} Alerts`
    },
    {
      id: 'ai-hub',
      title: 'AI Features Suite',
      desc: 'Gemini Copilot, rent forecasting & automated FAQ bot.',
      icon: Sparkles,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      badge: 'Gemini Copilot'
    },
    {
      id: 'audit-logs',
      title: 'Platform Audit Logs',
      desc: 'AES-256 encrypted security events, login attempts & history.',
      icon: ShieldCheck,
      color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      badge: 'Security'
    }
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Hostel Management Features Hub
          </h2>
          <p className="text-[11px] text-slate-500">
            Quick access to all 12 operational modules & management workflows
          </p>
        </div>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
          All Features Unlocked
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-left transition hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:border-indigo-800 dark:hover:bg-slate-800"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${f.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
                    {f.badge}
                  </span>
                </div>

                <div className="mt-2.5 font-bold text-xs text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                  {f.title}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Module</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
