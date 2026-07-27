import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

const DEMO_ROLES: {
  role: UserRole;
  label: string;
  name: string;
  email: string;
  badgeColor: string;
  description: string;
  avatar: string;
}[] = [
  {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    name: 'Vikramaditya Sharma',
    email: 'superadmin@pghub.com',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    description: 'Full system audit logs, subscription management & multi-PG access.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'PG_OWNER',
    label: 'PG Owner',
    name: 'Rajesh Kumar Agarwal',
    email: 'rajesh@royalpalms.com',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    description: 'Revenue analytics, occupancy stats, bank UPI setup & staff payroll.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'WARDEN',
    label: 'Warden / Manager',
    name: 'Ramesh Sundaram',
    email: 'warden.ramesh@royalpalms.com',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description: 'Night-out gate passes, daily attendance, resident admission & notices.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'RESIDENT',
    label: 'Resident (Tenant)',
    name: 'Aarav Mehta',
    email: 'aarav.m@gmail.com',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    description: 'Rent UPI payment upload, complaint desk, food rating & digital ID.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'PARENT',
    label: 'Parent / Guardian',
    name: 'Mahesh Mehta',
    email: 'mahesh.mehta@gmail.com',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    description: 'Child attendance history, fee payment status & emergency contacts.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'ACCOUNTANT',
    label: 'Accountant',
    name: 'Suresh Patel',
    email: 'accounts@royalpalms.com',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description: 'Verify UPI screenshots, generate tax invoices & expense tracking.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const LoginView: React.FC = () => {
  const { login, darkMode, setDarkMode } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [emailInput, setEmailInput] = useState('superadmin@pghub.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotToast, setForgotToast] = useState(false);

  const handleRoleSelect = (roleObj: typeof DEMO_ROLES[0]) => {
    setSelectedRole(roleObj.role);
    setEmailInput(roleObj.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole, { email: emailInput });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 text-white font-bold">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              Starlight<span className="text-indigo-400">PG</span>
            </span>
            <span className="ml-2.5 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
              Enterprise Suite v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
            Secure SSL Encrypted Portal
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 border border-slate-700/60 text-xs font-medium text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Server Active</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Demo Role Selector & Platform Info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Instant Demo Access</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Sign in to your <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Hostel & PG Portal</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Choose a role persona below to instantly experience StarlightPG with full administrative permissions, live rent ledgers, attendance, and AI copilot.
              </p>
            </div>

            {/* Quick Demo Role Cards */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Select Persona Portal to Test:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_ROLES.map((r) => {
                  const isSelected = selectedRole === r.role;
                  return (
                    <button
                      type="button"
                      key={r.role}
                      onClick={() => handleRoleSelect(r)}
                      className={`flex items-start gap-3 rounded-2xl p-3.5 text-left border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                          : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${r.badgeColor}`}>
                            {r.label}
                          </span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />}
                        </div>
                        <div className="mt-1 text-xs font-bold text-white truncate">{r.name}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{r.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Credentials Form */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-800/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Logging in as <span className="font-semibold text-indigo-300">{DEMO_ROLES.find(r => r.role === selectedRole)?.label}</span>
                </p>
              </div>

              {forgotToast && (
                <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center justify-between">
                  <span>Demo Mode: You can log in directly with any credentials.</span>
                  <button onClick={() => setForgotToast(false)} className="text-amber-400 font-bold hover:underline">Dismiss</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Email / Phone
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password / Security Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotToast(true)}
                      className="text-[11px] font-semibold text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0" />
                    <span>Keep me logged in</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Workspace...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In to Workspace</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
                <p className="text-[11px] text-slate-400">
                  Protected by Starlight Security Engine. Contact PG Administration for staff credentials.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-4 px-6 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>© 2026 StarlightPG Enterprise Management. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Support Desk</span>
        </div>
      </footer>
    </div>
  );
};
