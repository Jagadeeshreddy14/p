import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, AlertCircle, CheckCircle2, ShieldAlert, X, Sparkles, Zap, ArrowRight } from 'lucide-react';

export const RealTimeNotificationToast: React.FC = () => {
  const { toastNotification, setToastNotification, setActiveTab, currentUser } = useApp();

  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification, setToastNotification]);

  if (!toastNotification) return null;

  const isUrgent = toastNotification.priority === 'URGENT' || toastNotification.priority === 'HIGH';

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-bounce-short transition-all duration-300">
      <div
        className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition ${
          isUrgent
            ? 'border-rose-500 bg-rose-950/90 text-white ring-4 ring-rose-500/30'
            : 'border-indigo-500/80 bg-slate-900/90 text-white ring-2 ring-indigo-500/20'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`rounded-xl p-2.5 shadow-md flex-shrink-0 ${
                isUrgent ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 text-white'
              }`}
            >
              {isUrgent ? <ShieldAlert className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
            </div>

            <div className="space-y-1">
              {/* Real-time Push Badge */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black tracking-wider text-emerald-300 uppercase border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Role Push
                </span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  Role: {currentUser.role.replace('_', ' ')}
                </span>
                {isUrgent && (
                  <span className="rounded-full bg-rose-500/80 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wide">
                    URGENT ALERT
                  </span>
                )}
              </div>

              <h4 className="text-sm font-extrabold tracking-tight text-white">
                {toastNotification.title}
              </h4>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {toastNotification.message}
              </p>

              <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                Target Roles: {toastNotification.targetRoles?.join(', ') || 'ALL'} • {toastNotification.createdAt}
              </div>
            </div>
          </div>

          <button
            onClick={() => setToastNotification(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-3 flex items-center justify-end gap-2 border-t border-white/10 pt-2.5 text-xs">
          <button
            onClick={() => {
              if (toastNotification.type === 'COMPLAINT') setActiveTab('complaints');
              if (toastNotification.type === 'RENT') setActiveTab('financials');
              if (toastNotification.type === 'NOTICE') setActiveTab('noticeboard');
              setToastNotification(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 font-bold text-slate-900 shadow hover:bg-slate-100 transition"
          >
            Open Related Desk
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
