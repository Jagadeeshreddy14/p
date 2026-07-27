import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Building2,
  Sparkles,
  Bell,
  Moon,
  Sun,
  Shield,
  Search,
  UserCheck,
  ChevronDown,
  CheckCircle2,
  X,
  LogOut,
  User as UserIcon,
  Settings
} from 'lucide-react';

const ROLES: { role: UserRole; label: string; badgeColor: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  { role: 'PG_OWNER', label: 'PG Owner', badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
  { role: 'WARDEN', label: 'Warden / Manager', badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  { role: 'RECEPTIONIST', label: 'Receptionist', badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300' },
  { role: 'ACCOUNTANT', label: 'Accountant', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { role: 'RESIDENT', label: 'Resident (Tenant)', badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  { role: 'PARENT', label: 'Parent / Guardian', badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  { role: 'MAINTENANCE_STAFF', label: 'Maintenance Tech', badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
];

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUserRole,
    activePg,
    setActivePg,
    pgs,
    darkMode,
    setDarkMode,
    setAiDrawerOpen,
    notifications,
    setLogoutModalOpen
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [pgDropdownOpen, setPgDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const currentRoleObj = ROLES.find(r => r.role === currentUser.role) || ROLES[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Brand & Active PG Selection */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 shadow-md shadow-indigo-500/20 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Starlight<span className="text-indigo-600 dark:text-indigo-400">PG</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Enterprise Management System
            </p>
          </div>
        </div>

        {/* PG Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPgDropdownOpen(!pgDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Building2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="max-w-[120px] truncate sm:max-w-[200px]">{activePg.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {pgDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select PG Property
              </div>
              {pgs.map((pg) => (
                <button
                  key={pg.id}
                  onClick={() => {
                    setActivePg(pg);
                    setPgDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition ${
                    activePg.id === pg.id
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-semibold">{pg.name}</div>
                    <div className="text-[10px] text-slate-400">{pg.city} • {pg.occupiedBeds}/{pg.totalBeds} Beds</div>
                  </div>
                  {activePg.id === pg.id && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Search */}
      <div className="hidden md:flex items-center max-w-xs w-full relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search resident, room, payment..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold transition hover:border-indigo-300 dark:border-indigo-900/60 dark:bg-indigo-950/40"
          >
            <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className={`inline-block rounded-md px-1.5 py-0.5 text-[11px] font-bold ${currentRoleObj.badgeColor}`}>
              {currentRoleObj.label}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                Switch Role Mode (Demo)
              </div>
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setCurrentUserRole(r.role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition ${
                    currentUser.role === r.role
                      ? 'bg-slate-100 font-bold text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className={`rounded px-1.5 py-0.5 text-[10px] ${r.badgeColor}`}>
                    {r.label}
                  </span>
                  {currentUser.role === r.role && <UserCheck className="h-3.5 w-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={() => setAiDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-500/20 transition hover:opacity-95"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {notifications.length}
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <button onClick={() => setNotifOpen(false)}>
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs dark:border-slate-800/80 dark:bg-slate-800/40">
                    <div className="font-semibold text-slate-900 dark:text-white">{n.title}</div>
                    <p className="mt-0.5 text-slate-600 dark:text-slate-300 text-[11px]">{n.message}</p>
                    <span className="mt-1 block text-[9px] text-slate-400">{n.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Profile Avatar Dropdown */}
        <div className="relative border-l border-slate-200 pl-3 dark:border-slate-800">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.role.replace('_', ' ')}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-fade-in">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
