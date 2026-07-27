import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintProgressTracker } from '../components/ComplaintProgressTracker';
import {
  AlertCircle,
  Wrench,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Check,
  TrendingUp,
  ListFilter
} from 'lucide-react';

export const ComplaintsView: React.FC = () => {
  const { complaints, addComplaint, updateComplaint, activePg, currentUser } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [newComplaintModal, setNewComplaintModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<
    'ELECTRICAL' | 'PLUMBING' | 'CLEANING' | 'FOOD' | 'WIFI' | 'SECURITY' | 'OTHER'
  >('ELECTRICAL');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [generatingAi, setGeneratingAi] = useState<string | null>(null);

  // Stat Counters
  const totalCount = complaints.length;
  const openCount = complaints.filter((c) => c.status === 'OPEN').length;
  const inProgressCount = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const completedCount = complaints.filter((c) => c.status === 'COMPLETED').length;
  const resolutionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  const filtered = complaints.filter((c) => {
    const matchesCat = filterCategory === 'ALL' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesCat && matchesStatus;
  });

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    await addComplaint({
      title,
      category,
      description,
      priority
    });
    setNewComplaintModal(false);
    setTitle('');
    setDescription('');
  };

  const handleGenerateAiReply = async (complaintId: string) => {
    setGeneratingAi(complaintId);
    const cmp = complaints.find((c) => c.id === complaintId);
    if (!cmp) return;

    try {
      const res = await fetch('/api/ai/complaint-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cmp.category,
          title: cmp.title,
          description: cmp.description,
          residentName: cmp.residentName,
          roomNumber: cmp.roomNumber
        })
      });
      const data = await res.json();
      await updateComplaint(complaintId, { aiSuggestedReply: data.reply });
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAi(null);
    }
  };

  const handleStatusUpdate = (complaintId: string, newStatus: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED') => {
    const existing = complaints.find((c) => c.id === complaintId);
    updateComplaint(complaintId, {
      status: newStatus,
      assignedStaffName:
        newStatus === 'IN_PROGRESS'
          ? existing?.assignedStaffName || 'Ganesh Tech (Warden)'
          : existing?.assignedStaffName
    });
  };

  const canEditStatus =
    currentUser.role === 'WARDEN' ||
    currentUser.role === 'PG_OWNER' ||
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role === 'MAINTENANCE_STAFF';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Enterprise Complaints & Service Desk
          </h1>
          <p className="text-xs text-slate-500">
            Real-time visual progress tracking and SLA workflow for maintenance requests
          </p>
        </div>
        <button
          onClick={() => setNewComplaintModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> File Service Ticket
        </button>
      </div>

      {/* Visual Resolution Metrics Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              SLA Resolution Performance & Status Metrics
            </div>
            <p className="text-[11px] text-slate-500">
              Live resolution rate across Electrical, Plumbing, WiFi, and Room Housekeeping tickets
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Overall Resolution Rate:</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black">
              {resolutionPercentage}% Resolved
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
            <span>Progress Breakdown</span>
            <span>
              {completedCount} of {totalCount} Tickets Resolved
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
              title={`Completed: ${completedCount}`}
            />
            <div
              className="bg-indigo-500 h-full transition-all duration-500"
              style={{ width: totalCount > 0 ? `${(inProgressCount / totalCount) * 100}%` : '0%' }}
              title={`In Progress: ${inProgressCount}`}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: totalCount > 0 ? `${(openCount / totalCount) * 100}%` : '0%' }}
              title={`Open: ${openCount}`}
            />
          </div>
        </div>

        {/* Status Counter Pills / Quick Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`rounded-2xl border p-3 text-left transition ${
              filterStatus === 'ALL'
                ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">All Tickets</div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{totalCount}</div>
          </button>

          <button
            onClick={() => setFilterStatus('OPEN')}
            className={`rounded-2xl border p-3 text-left transition ${
              filterStatus === 'OPEN'
                ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 shadow-sm'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Step 1: Open
            </div>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">{openCount}</div>
          </button>

          <button
            onClick={() => setFilterStatus('IN_PROGRESS')}
            className={`rounded-2xl border p-3 text-left transition ${
              filterStatus === 'IN_PROGRESS'
                ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Wrench className="h-3 w-3" /> Step 2: In Progress
            </div>
            <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{inProgressCount}</div>
          </button>

          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`rounded-2xl border p-3 text-left transition ${
              filterStatus === 'COMPLETED'
                ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-sm'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Step 3: Completed
            </div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{completedCount}</div>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
          <ListFilter className="h-3.5 w-3.5" /> Category:
        </span>
        {['ALL', 'ELECTRICAL', 'PLUMBING', 'CLEANING', 'WIFI', 'FOOD', 'SECURITY'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Complaints List with Visual Progress Tracker */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
            No complaints found matching current filter criteria.
          </div>
        ) : (
          filtered.map((cmp) => (
            <div
              key={cmp.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 transition"
            >
              {/* Ticket Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-2xl p-2.5 text-white shadow-sm ${
                      cmp.category === 'ELECTRICAL'
                        ? 'bg-amber-500'
                        : cmp.category === 'PLUMBING'
                        ? 'bg-sky-500'
                        : 'bg-purple-500'
                    }`}
                  >
                    <Wrench className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {cmp.title}
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      Logged by{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {cmp.residentName} (Room {cmp.roomNumber})
                      </span>{' '}
                      • {cmp.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      cmp.priority === 'HIGH' || cmp.priority === 'URGENT'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {cmp.priority} PRIORITY
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                      cmp.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : cmp.status === 'IN_PROGRESS'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {cmp.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {cmp.description}
              </p>

              {/* Embedded Visual Progress Tracker Component */}
              <ComplaintProgressTracker
                complaint={cmp}
                canEditStatus={canEditStatus}
                onStatusChange={(newStatus) => handleStatusUpdate(cmp.id, newStatus)}
              />

              {/* AI Suggested Response */}
              {cmp.aiSuggestedReply ? (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-3 text-xs dark:border-purple-900/40 dark:bg-purple-950/30">
                  <div className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300 font-bold mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" /> AI Auto-Generated Resolution Update
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    {cmp.aiSuggestedReply}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => handleGenerateAiReply(cmp.id)}
                  disabled={generatingAi === cmp.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {generatingAi === cmp.id
                    ? 'Generating AI Response...'
                    : 'Auto-Generate AI Resolution Draft'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Complaint Modal */}
      {newComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              File Service / Complaint Ticket
            </h3>

            <form onSubmit={handleCreateComplaint} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Complaint Category
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="ELECTRICAL">Electrical (AC, Fans, Lights)</option>
                  <option value="PLUMBING">Plumbing (Tap leakage, Geyser)</option>
                  <option value="WIFI">WiFi & Internet Speed</option>
                  <option value="CLEANING">Room Housekeeping</option>
                  <option value="FOOD">Food Quality & Mess</option>
                  <option value="SECURITY">Security & Lock issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geyser not heating in Room 101"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe exact problem..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewComplaintModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
