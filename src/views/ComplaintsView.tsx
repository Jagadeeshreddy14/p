import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Wrench, Sparkles, CheckCircle2, Clock, Plus, Filter } from 'lucide-react';

export const ComplaintsView: React.FC = () => {
  const { complaints, addComplaint, updateComplaint, activePg, currentUser } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [newComplaintModal, setNewComplaintModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'ELECTRICAL' | 'PLUMBING' | 'CLEANING' | 'FOOD' | 'WIFI' | 'SECURITY' | 'OTHER'>('ELECTRICAL');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [generatingAi, setGeneratingAi] = useState<string | null>(null);

  const filtered = filterCategory === 'ALL' 
    ? complaints 
    : complaints.filter(c => c.category === filterCategory);

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
    const cmp = complaints.find(c => c.id === complaintId);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Complaints & Service Desk</h1>
          <p className="text-xs text-slate-500">Track resolution workflow for Electrical, Plumbing, WiFi, and Food issues</p>
        </div>
        <button
          onClick={() => setNewComplaintModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> File Service Ticket
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.map((cmp) => (
          <div
            key={cmp.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className={`rounded-xl p-2 text-white ${
                  cmp.category === 'ELECTRICAL' ? 'bg-amber-500' : cmp.category === 'PLUMBING' ? 'bg-sky-500' : 'bg-purple-500'
                }`}>
                  <Wrench className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cmp.title}</h3>
                  <div className="text-[11px] text-slate-400">
                    Logged by <span className="font-semibold text-slate-700 dark:text-slate-200">{cmp.residentName} (Room {cmp.roomNumber})</span> • {cmp.createdAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  cmp.priority === 'HIGH' || cmp.priority === 'URGENT' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {cmp.priority} PRIORITY
                </span>

                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  cmp.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : cmp.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {cmp.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{cmp.description}</p>

            {/* AI Suggested Response */}
            {cmp.aiSuggestedReply ? (
              <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3 text-xs dark:border-purple-900/40 dark:bg-purple-950/30">
                <div className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300 font-bold mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" /> AI Auto-Generated Resolution Update
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">{cmp.aiSuggestedReply}</p>
              </div>
            ) : (
              <button
                onClick={() => handleGenerateAiReply(cmp.id)}
                disabled={generatingAi === cmp.id}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {generatingAi === cmp.id ? 'Generating AI Response...' : 'Auto-Generate AI Resolution Draft'}
              </button>
            )}

            {/* Warden Actions */}
            {(currentUser.role === 'WARDEN' || currentUser.role === 'PG_OWNER') && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Set Status:</span>
                <button
                  onClick={() => updateComplaint(cmp.id, { status: 'IN_PROGRESS', assignedStaffName: 'Ganesh Tech' })}
                  className="rounded-lg bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700 hover:bg-indigo-100"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateComplaint(cmp.id, { status: 'COMPLETED' })}
                  className="rounded-lg bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  Mark Completed
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Complaint Modal */}
      {newComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">File Service / Complaint Ticket</h3>
            
            <form onSubmit={handleCreateComplaint} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Complaint Category</label>
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Description</label>
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
