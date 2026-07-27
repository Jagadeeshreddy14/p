import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Save,
  Copy,
  Check,
  Edit2,
  AlertCircle,
  HelpCircle,
  Sliders,
  DollarSign
} from 'lucide-react';

export const UpiSettingsView: React.FC = () => {
  const { activePg, setActivePg, pgs, currentUser, updateUpiSettings } = useApp();

  const [upiId, setUpiId] = useState(activePg.upiId || 'royalpalms@icici');
  const [merchantName, setMerchantName] = useState(activePg.name || 'Royal Palms Executive PG');
  const [bankName, setBankName] = useState('ICICI Bank - HSR Layout Branch');
  const [accountNumber, setAccountNumber] = useState('9182300049281');
  const [ifsc, setIfsc] = useState('ICIC0000102');
  const [accountHolder, setAccountHolder] = useState(activePg.ownerName || 'Rajesh Kumar Agarwal');

  // Automation Options
  const [autoOcr, setAutoOcr] = useState(true);
  const [autoTaxReceipt, setAutoTaxReceipt] = useState(true);
  const [appendRoomInNotes, setAppendRoomInNotes] = useState(true);

  // Testing QR
  const [testAmount, setTestAmount] = useState('9500');
  const [copied, setCopied] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);

  // Sync state if activePg changes
  React.useEffect(() => {
    if (activePg) {
      setUpiId(activePg.upiId || 'royalpalms@icici');
      setMerchantName(activePg.name || 'Royal Palms Executive PG');
    }
  }, [activePg]);

  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${testAmount}&cu=INR${
    appendRoomInNotes ? '&tn=Hostel_Rent_Payment' : ''
  }`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateUpiSettings) {
      updateUpiSettings(upiId, merchantName);
    } else {
      // Fallback: update activePg directly
      setActivePg({ ...activePg, upiId, name: merchantName });
    }
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3500);
  };

  const copyVpa = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">
                UPI & Dynamic QR Code Configuration
              </h1>
              <p className="text-xs text-slate-500">
                Manage bank VPA handle, merchant details & automated rent payment QR codes for residents
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {currentUser.role.replace('_', ' ')} MODE
          </span>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
          >
            <Save className="h-4 w-4" /> Save UPI Settings
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            UPI VPA handle updated! Dynamic QR codes across all resident apps now point to "{upiId}".
          </div>
          <span className="text-[10px] font-mono text-emerald-600">Active PG: {activePg.name}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Property Banner */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Active PG Property: {activePg.name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Code: {activePg.code} | {activePg.city}, {activePg.state}
                </div>
              </div>
            </div>

            {pgs.length > 1 && (
              <select
                value={activePg.id}
                onChange={(e) => {
                  const selected = pgs.find(p => p.id === e.target.value);
                  if (selected) setActivePg(selected);
                }}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {pgs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Form Card */}
          <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-500" />
              VPA Handle & Merchant Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  UPI VPA ID (Virtual Payment Address) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white pr-10"
                    placeholder="e.g. pgowner@icici"
                  />
                  <button
                    type="button"
                    onClick={copyVpa}
                    className="absolute right-2 top-2 rounded-lg p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    title="Copy VPA"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Supported banks: ICICI, HDFC, SBI, Axis, Paytm, PhonePe Merchant.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Display Merchant / Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="e.g. Royal Palms Executive PG"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This name will appear on GPay/PhonePe payment confirmation screens.
                </p>
              </div>
            </div>

            {/* Bank Settlement Section */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" /> Settlement Bank Account Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Bank Name & Branch</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Automation Rules */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-500" />
                Dynamic QR & Verification Preferences
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">AI OCR Auto-Scan</span>
                    <input
                      type="checkbox"
                      checked={autoOcr}
                      onChange={(e) => setAutoOcr(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Auto-verifies uploaded payment screenshots using UTR & reference numbers.
                  </p>
                </label>

                <label className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Auto Tax Receipt</span>
                    <input
                      type="checkbox"
                      checked={autoTaxReceipt}
                      onChange={(e) => setAutoTaxReceipt(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Generates PDF HRA receipts automatically upon payment approval.
                  </p>
                </label>

                <label className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Append Room Note</span>
                    <input
                      type="checkbox"
                      checked={appendRoomInNotes}
                      onChange={(e) => setAppendRoomInNotes(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Includes transaction note 'Hostel_Rent_Payment' in UPI URL.
                  </p>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Interactive QR Preview */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 p-6 shadow-sm dark:border-indigo-950 dark:from-indigo-950/30 dark:to-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-200/60 pb-3 dark:border-indigo-900/50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  Live Dynamic Resident QR Preview
                </h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                LIVE
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              This is the exact QR code residents will see in their app for rent payments.
            </p>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl bg-white p-4 shadow-md dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiDeepLink)}`}
                alt="Dynamic UPI QR Code"
                className="h-40 w-40 rounded-xl object-contain border border-slate-100 dark:border-slate-800 p-1"
              />

              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">{merchantName}</div>
                <div className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{upiId}</div>
                <div className="text-[10px] text-slate-400">{bankName}</div>
              </div>

              {/* Test Amount Simulator */}
              <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800 text-left">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Test Rent Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-6 pr-3 text-xs font-bold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={copyVpa}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'VPA Copied!' : 'Copy UPI String'}</span>
            </button>

            <div className="rounded-xl bg-indigo-50/70 p-3 text-[10px] text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>
                Residents can scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI app to make instant payments.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
