import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, MessageSquare, Bell, CreditCard, TrendingUp, Copy, Check } from 'lucide-react';

export const AiHubView: React.FC = () => {
  const { setAiDrawerOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'reminder' | 'notice' | 'insights'>('reminder');

  // Reminder State
  const [residentName, setResidentName] = useState('Rohan Sharma');
  const [dueAmount, setDueAmount] = useState('9000');
  const [month, setMonth] = useState('July 2026');
  const [reminderText, setReminderText] = useState('');
  const [loadingReminder, setLoadingReminder] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateReminder = async () => {
    setLoadingReminder(true);
    try {
      const res = await fetch('/api/ai/rent-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ residentName, dueAmount, month })
      });
      const data = await res.json();
      setReminderText(data.reminderText);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReminder(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" /> Gemini AI Suite
            </span>
            <h1 className="mt-2 text-2xl font-black">AI Smart Tools for Hostel Operations</h1>
            <p className="mt-1 text-xs text-indigo-200">
              Generate automated rent reminders, draft broadcast notices, resolve complaints, and forecast occupancy.
            </p>
          </div>
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-purple-950 shadow hover:bg-purple-50"
          >
            Launch Live AI Chat Copilot
          </button>
        </div>
      </div>

      {/* AI Tool Sub-tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('reminder')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'reminder'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <CreditCard className="h-4 w-4" /> AI Rent Reminder Copywriter
        </button>
      </div>

      {/* AI Rent Reminder Generator */}
      {activeTab === 'reminder' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Rent Reminder Copywriter</h3>
          <p className="text-xs text-slate-500 mb-4">Generate polite, high-converting WhatsApp / SMS reminders for pending rent</p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Resident Name</label>
              <input
                type="text"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pending Rent (₹)</label>
                <input
                  type="text"
                  value={dueAmount}
                  onChange={(e) => setDueAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Month</label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateReminder}
              disabled={loadingReminder}
              className="w-full rounded-xl bg-purple-600 py-2.5 font-bold text-white shadow hover:bg-purple-700 disabled:opacity-50"
            >
              {loadingReminder ? 'Generating Copy...' : 'Generate WhatsApp Reminder Message'}
            </button>

            {reminderText && (
              <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950/40 relative">
                <button
                  onClick={() => copyToClipboard(reminderText)}
                  className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-purple-700 shadow"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 block mb-1">Generated Copy</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium whitespace-pre-wrap">{reminderText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
