import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BellRing, Sparkles, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { notices, addNotice, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'RENT' | 'MAINTENANCE' | 'EVENT' | 'EMERGENCY'>('GENERAL');
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleGenerateAiNotice = async () => {
    if (!topic.trim()) return;
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone: 'Courteous & Formal' })
      });
      const data = await res.json();
      setContent(data.noticeText);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNotice({
      title: topic || 'Hostel Notice',
      content,
      category,
      targetAudience: 'ALL',
      isImportant: category === 'EMERGENCY'
    });
    setModalOpen(false);
    setTopic('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Digital Notice Board & Broadcasts</h1>
          <p className="text-xs text-slate-500">Official hostel announcements, maintenance alerts, and mess updates</p>
        </div>
        {(currentUser.role === 'WARDEN' || currentUser.role === 'PG_OWNER' || currentUser.role === 'SUPER_ADMIN') && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Publish Broadcast Notice
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border p-5 shadow-sm transition ${
              n.isImportant
                ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BellRing className={`h-4 w-4 ${n.isImportant ? 'text-rose-500' : 'text-indigo-600'}`} />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
            </div>

            <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">
              {n.content}
            </p>

            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Posted by: <strong className="text-slate-700 dark:text-slate-200">{n.postedBy}</strong></span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Target: {n.targetAudience}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish Broadcast Notice</h3>

            <form onSubmit={handlePostNotice} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Topic / Subject</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scheduled power backup maintenance on Sunday"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiNotice}
                    disabled={generatingAi}
                    className="flex items-center gap-1 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white shadow hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                    {generatingAi ? 'Drafting...' : 'AI Draft'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Content Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Notice text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
