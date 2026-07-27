import React from 'react';
import { Complaint } from '../types';
import {
  AlertCircle,
  Wrench,
  CheckCircle2,
  Clock,
  UserCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface ComplaintProgressTrackerProps {
  complaint: Complaint;
  onStatusChange?: (newStatus: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED') => void;
  canEditStatus?: boolean;
}

export const ComplaintProgressTracker: React.FC<ComplaintProgressTrackerProps> = ({
  complaint,
  onStatusChange,
  canEditStatus = false
}) => {
  const steps = [
    {
      key: 'OPEN',
      label: 'Ticket Filed',
      desc: 'Complaint registered',
      icon: AlertCircle,
      activeColor: 'bg-amber-500 text-white ring-amber-300 dark:ring-amber-900',
      completedColor: 'bg-amber-500 text-white',
      lineColor: 'bg-amber-500'
    },
    {
      key: 'IN_PROGRESS',
      label: 'In Progress',
      desc: complaint.assignedStaffName ? `Assigned: ${complaint.assignedStaffName}` : 'Technician assigned',
      icon: Wrench,
      activeColor: 'bg-indigo-600 text-white ring-indigo-300 dark:ring-indigo-900',
      completedColor: 'bg-indigo-600 text-white',
      lineColor: 'bg-indigo-600'
    },
    {
      key: 'COMPLETED',
      label: 'Resolved',
      desc: 'Issue fixed & verified',
      icon: CheckCircle2,
      activeColor: 'bg-emerald-600 text-white ring-emerald-300 dark:ring-emerald-900',
      completedColor: 'bg-emerald-600 text-white',
      lineColor: 'bg-emerald-600'
    }
  ];

  const getStepStatus = (stepKey: string) => {
    if (complaint.status === 'COMPLETED') return 'completed';
    if (complaint.status === 'IN_PROGRESS') {
      if (stepKey === 'OPEN') return 'completed';
      if (stepKey === 'IN_PROGRESS') return 'active';
      return 'pending';
    }
    // OPEN
    if (stepKey === 'OPEN') return 'active';
    return 'pending';
  };

  const currentStepIndex =
    complaint.status === 'COMPLETED' ? 2 : complaint.status === 'IN_PROGRESS' ? 1 : 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
      {/* Tracker Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-indigo-500" />
          Maintenance Request Workflow Status
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Step {currentStepIndex + 1} of 3 ({Math.round(((currentStepIndex + 1) / 3) * 100)}%)
        </span>
      </div>

      {/* Visual Progress Steps Bar */}
      <div className="relative flex items-center justify-between pt-2 pb-1">
        {/* Connector Lines */}
        <div className="absolute top-6 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-700 -z-0 rounded-full" />
        <div
          className="absolute top-6 left-8 h-1 bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-600 -z-0 rounded-full transition-all duration-500"
          style={{
            width:
              currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : 'calc(100% - 4rem)'
          }}
        />

        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.key);
          const StepIcon = step.icon;
          const isClickable = canEditStatus && onStatusChange;

          return (
            <div
              key={step.key}
              className={`flex flex-col items-center text-center relative z-10 group ${
                isClickable ? 'cursor-pointer' : ''
              }`}
              onClick={() => {
                if (isClickable && onStatusChange) {
                  onStatusChange(step.key as any);
                }
              }}
            >
              {/* Step Circle Node */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl font-bold transition-all duration-300 shadow-sm ${
                  stepStatus === 'completed'
                    ? 'bg-emerald-600 text-white scale-100'
                    : stepStatus === 'active'
                    ? `${step.activeColor} ring-4 scale-110 shadow-md`
                    : 'bg-white border-2 border-slate-300 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                }`}
              >
                {stepStatus === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>

              {/* Label & Description */}
              <div className="mt-2 space-y-0.5">
                <div
                  className={`text-xs font-bold ${
                    stepStatus === 'active'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : stepStatus === 'completed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[100px] hidden sm:block">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Action Buttons for Admin / Warden / Staff */}
      {canEditStatus && onStatusChange && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
          <span className="text-[11px] font-semibold text-slate-500">Update Request Status:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onStatusChange('OPEN')}
              disabled={complaint.status === 'OPEN'}
              className={`rounded-xl px-2.5 py-1 font-bold text-[11px] transition ${
                complaint.status === 'OPEN'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 opacity-60 cursor-not-allowed'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              Set Open
            </button>
            <button
              type="button"
              onClick={() => onStatusChange('IN_PROGRESS')}
              disabled={complaint.status === 'IN_PROGRESS'}
              className={`rounded-xl px-2.5 py-1 font-bold text-[11px] transition ${
                complaint.status === 'IN_PROGRESS'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 opacity-60 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
              }`}
            >
              In Progress
            </button>
            <button
              type="button"
              onClick={() => onStatusChange('COMPLETED')}
              disabled={complaint.status === 'COMPLETED'}
              className={`rounded-xl px-2.5 py-1 font-bold text-[11px] transition ${
                complaint.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 opacity-60 cursor-not-allowed'
                  : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              }`}
            >
              Mark Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
