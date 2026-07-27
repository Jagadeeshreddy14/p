import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Building2, DollarSign, TrendingUp, AlertCircle, Users, Sparkles, CheckCircle2, ChevronRight, QrCode } from 'lucide-react';

export const OwnerView: React.FC = () => {
  const { activePg, rooms, beds, residents, payments, complaints } = useApp();
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const pendingRent = payments
    .filter(p => p.status === 'DUE' || p.status === 'PENDING_VERIFICATION')
    .reduce((acc, p) => acc + p.amountDue, 0);

  const totalBeds = activePg.totalBeds;
  const occupiedBeds = activePg.occupiedBeds;
  const occupancyPercent = Math.round((occupiedBeds / totalBeds) * 100);

  // Revenue chart data
  const revenueData = [
    { month: 'Feb', Revenue: 380000, Occupancy: 80 },
    { month: 'Mar', Revenue: 395000, Occupancy: 82 },
    { month: 'Apr', Revenue: 405000, Occupancy: 84 },
    { month: 'May', Revenue: 410000, Occupancy: 85 },
    { month: 'Jun', Revenue: 412000, Occupancy: 85 },
    { month: 'Jul', Revenue: 414000, Occupancy: 85 }
  ];

  const handleGenerateAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/occupancy-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pgId: activePg.id })
      });
      const data = await res.json();
      setAiInsights(data.insights);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Property Hero */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activePg.name}</h1>
          <p className="text-xs text-slate-500">{activePg.address} • UPI ID: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{activePg.upiId}</span></p>
        </div>
        <button
          onClick={handleGenerateAiInsights}
          disabled={loadingAi}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-95 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
          {loadingAi ? 'Analyzing Metrics...' : 'Generate AI Revenue Insights'}
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Occupancy Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{occupancyPercent}%</span>
            <span className="text-xs font-bold text-emerald-500">({occupiedBeds}/{totalBeds} Beds)</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${occupancyPercent}%` }}></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">₹{activePg.monthlyRevenue.toLocaleString('en-IN')}</span>
          </div>
          <span className="mt-2 block text-[11px] font-semibold text-emerald-600">+4.2% vs last month</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Rent</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{pendingRent.toLocaleString('en-IN')}</span>
          </div>
          <span className="mt-2 block text-[11px] text-slate-400">2 Residents pending verification</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Available Beds</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalBeds - occupiedBeds} Beds</span>
          </div>
          <span className="mt-2 block text-[11px] text-slate-400">Ready for instant admission</span>
        </div>
      </div>

      {/* AI Insights Card */}
      {aiInsights && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
          <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold text-xs mb-2">
            <Sparkles className="h-4 w-4 text-purple-600" /> AI Executive Insights & Recommendations
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
            {aiInsights}
          </div>
        </div>
      )}

      {/* Analytics Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">6-Month Revenue & Occupancy Growth</h3>
        <p className="text-xs text-slate-500 mb-4">Gross monthly rental earnings vs percentage occupancy</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
              <Bar yAxisId="left" dataKey="Revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
