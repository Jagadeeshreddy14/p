import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export const LogoutModal: React.FC = () => {
  const { logoutModalOpen, setLogoutModalOpen, logout, currentUser } = useApp();

  if (!logoutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Log Out</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">End active session for StarlightPG</p>
            </div>
          </div>
          <button
            onClick={() => setLogoutModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.email}</div>
              <span className="mt-1 inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to log out? Any unsaved form drafts will be discarded and you will need to authenticate again to access the portal.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setLogoutModalOpen(false)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
