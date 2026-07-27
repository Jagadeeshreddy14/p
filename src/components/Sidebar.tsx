import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  QrCode,
  AlertCircle,
  Clock,
  UserCheck,
  Utensils,
  Shirt,
  Package,
  Boxes,
  BellRing,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  allowedRoles?: string[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, complaints, payments, setLogoutModalOpen } = useApp();

  const pendingPayments = payments.filter(p => p.status === 'PENDING_VERIFICATION').length;
  const openComplaints = complaints.filter(c => c.status === 'OPEN').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'ACCOUNTANT', 'RESIDENT', 'PARENT', 'RECEPTIONIST', 'MAINTENANCE_STAFF'] },
    { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'RECEPTIONIST'] },
    { id: 'residents', label: 'Resident Roster', icon: Users, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'ACCOUNTANT', 'RECEPTIONIST'] },
    { id: 'rent-upi', label: 'Rent & UPI QR', icon: QrCode, badge: pendingPayments > 0 ? pendingPayments : undefined, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'ACCOUNTANT', 'RESIDENT', 'PARENT'] },
    { id: 'upi-settings', label: 'UPI VPA Settings', icon: QrCode, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER'] },
    { id: 'complaints', label: 'Complaints Desk', icon: AlertCircle, badge: openComplaints > 0 ? openComplaints : undefined, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'ACCOUNTANT', 'RESIDENT', 'MAINTENANCE_STAFF'] },
    { id: 'attendance', label: 'Attendance & Gate Pass', icon: Clock, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'RESIDENT', 'PARENT', 'RECEPTIONIST'] },
    { id: 'visitors', label: 'Visitor Pass QR', icon: UserCheck, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'RESIDENT', 'PARENT', 'RECEPTIONIST'] },
    { id: 'mess', label: 'Food & Mess Menu', icon: Utensils, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'RESIDENT', 'PARENT'] },
    { id: 'laundry-parcels', label: 'Laundry & Parcels', icon: Shirt, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'RESIDENT', 'RECEPTIONIST'] },
    { id: 'inventory', label: 'Inventory & Assets', icon: Boxes, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'MAINTENANCE_STAFF'] },
    { id: 'notices', label: 'Notices & Broadcasts', icon: BellRing, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'ACCOUNTANT', 'RESIDENT', 'PARENT', 'RECEPTIONIST', 'MAINTENANCE_STAFF'] },
    { id: 'ai-hub', label: 'AI Features Suite', icon: Sparkles, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'RESIDENT'] },
    { id: 'audit-logs', label: 'Platform Audit Logs', icon: ShieldCheck, allowedRoles: ['SUPER_ADMIN', 'PG_OWNER'] },
  ];

  const filteredNav = navItems.filter(item => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(currentUser.role);
  });

  React.useEffect(() => {
    const isCurrentTabAllowed = filteredNav.some(item => item.id === activeTab);
    if (!isCurrentTabAllowed && filteredNav.length > 0) {
      setActiveTab('dashboard');
    }
  }, [currentUser.role, activeTab]);

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 hidden md:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Card */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-3.5 dark:border-slate-800/80 dark:from-slate-800/50 dark:to-indigo-950/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Active Workspace
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">
            {currentUser.name}
          </div>
          <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Role: <span className="font-semibold text-slate-700 dark:text-slate-200">{currentUser.role.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Log Out & System Status */}
      <div className="border-t border-slate-100 pt-3 space-y-3 dark:border-slate-800">
        <button
          onClick={() => setLogoutModalOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>System Status</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
