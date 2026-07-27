import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Sliders,
  Save,
  RefreshCw,
  Copy,
  Check,
  Edit2
} from 'lucide-react';

export const SuperAdminUpiSettings: React.FC = () => {
  const { pgs, activePg } = useApp();

  // Settings State
  const [masterUpi, setMasterUpi] = useState('starlightpg.master@icici');
  const [merchantName, setMerchantName] = useState('Starlight PG & Hostel Enterprises');
  const [bankName, setBankName] = useState('ICICI Bank - HSR Layout Branch');
  const [accountNumber, setAccountNumber] = useState('9182300049281');
  const [ifsc, setIfsc] = useState('ICIC0000102');
  
  // Toggles
  const [autoVerifyAi, setAutoVerifyAi] = useState(true);
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [gstEnabled, setGstEnabled] = useState(false);

  // Live QR Preview State
  const [previewAmount, setPreviewAmount] = useState('9000');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Property UPI Overrides State
  const [pgUpiList, setPgUpiList] = useState(
    pgs.map(p => ({ id: p.id, name: p.name, upiId: p.upiId || `${p.code.toLowerCase()}@icici`, code: p.code }))
  );
  const [editingPgId, setEditingPgId] = useState<string | null>(null);
  const [editUpiVal, setEditUpiVal] = useState('');

  const upiDeepLink = `upi://pay?pa=${masterUpi}&pn=${encodeURIComponent(merchantName)}&am=${previewAmount}&cu=INR&tn=Hostel_Rent_Payment`;

  const copyUpiLink = () => {
    navigator.clipboard.writeText(upiDeepLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSavePgUpi = (pgId: string) => {
    setPgUpiList(prev => prev.map(item => item.id === pgId ? { ...item, upiId: editUpiVal } : item));
    setEditingPgId(null);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <QrCode className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Global UPI & Payment Gateway Control</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Super Admin settings for master bank VPA handles, AI receipt parsers & PG-specific UPI QR routing
          </p>
        </div>

        <button
          onClick={handleSaveGlobal}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700"
        >
          <Save className="h-4 w-4" /> Save UPI Configuration
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Master UPI VPA settings & gateway rules saved successfully!
          </div>
          <span className="text-[10px] font-mono text-emerald-600">Updated just now</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Gateway Parameters */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSaveGlobal} className="space-y-4 text-xs">
            {/* Master VPA & Merchant Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Master Default UPI VPA ID
                </label>
                <input
                  type="text"
                  value={masterUpi}
                  onChange={(e) => setMasterUpi(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono text-xs text-slate-900 focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g. starlightpg@icici"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Merchant Name
                </label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Legal Business Name"
                />
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Primary Settlement Bank Account
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* AI Auto Verification Controls */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Automation & Verification Rules
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">AI OCR Rent Screenshot Verification</div>
                    <div className="text-[10px] text-slate-400">Auto-matches UTR / Transaction ID from uploaded GPay/PhonePe receipts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoVerifyAi}
                    onChange={(e) => setAutoVerifyAi(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Auto-Generate Rent Tax Receipt PDFs</div>
                    <div className="text-[10px] text-slate-400">Sends instant HRA tax receipt directly to tenant WhatsApp & Email upon payment approval</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoReceipts}
                    onChange={(e) => setAutoReceipts(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Dynamic QR & Deep Link Preview */}
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-5 dark:border-purple-900/40 dark:from-purple-950/20 dark:to-slate-900 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-purple-200/60 pb-3 dark:border-purple-900/50">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-purple-600" /> Dynamic Live UPI QR Preview
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ACTIVE VPA
              </span>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center space-y-3 text-center">
              {/* QR Container */}
              <div className="relative rounded-2xl bg-white p-3 shadow-lg border border-purple-200 dark:bg-slate-900 dark:border-slate-700">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`}
                  alt="Live UPI QR"
                  className="h-36 w-36 rounded-lg object-contain"
                />
                <div className="mt-1 text-[10px] font-mono font-bold text-slate-500">
                  {masterUpi}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">{merchantName}</div>
                <div className="text-[10px] text-slate-500">{bankName}</div>
              </div>

              {/* Sample Amount Input */}
              <div className="w-full max-w-[200px] text-left">
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Test Amount (₹)</label>
                <input
                  type="number"
                  value={previewAmount}
                  onChange={(e) => setPreviewAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/50">
            <button
              onClick={copyUpiLink}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-purple-300 bg-white py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'UPI Link Copied!' : 'Copy UPI Deep Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Level Custom UPI Routing */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
          Property-Specific Custom UPI Handles
        </h3>
        <p className="text-[11px] text-slate-500 mb-3">
          Configure distinct bank VPA IDs for individual PG properties to route tenant payments directly to specific bank accounts.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                <th className="p-3">PG Property Name</th>
                <th className="p-3">Property Code</th>
                <th className="p-3">Assigned UPI VPA ID</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pgUpiList.map((pg) => (
                <tr key={pg.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    {pg.name}
                  </td>
                  <td className="p-3 font-mono text-slate-500">
                    {pg.code}
                  </td>
                  <td className="p-3 font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {editingPgId === pg.id ? (
                      <input
                        type="text"
                        value={editUpiVal}
                        onChange={(e) => setEditUpiVal(e.target.value)}
                        className="rounded-lg border border-purple-500 bg-white px-2 py-1 text-xs text-slate-900 dark:bg-slate-800 dark:text-white"
                      />
                    ) : (
                      pg.upiId
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {editingPgId === pg.id ? (
                      <button
                        onClick={() => handleSavePgUpi(pg.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingPgId(pg.id);
                          setEditUpiVal(pg.upiId);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <Edit2 className="h-3 w-3 text-purple-600" /> Edit VPA
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
