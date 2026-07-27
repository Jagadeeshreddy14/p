import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, Upload, Check, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  monthName: string;
  amount: number;
}

export const UpiPaymentModal: React.FC<Props> = ({ isOpen, onClose, monthName, amount }) => {
  const { activePg, currentUser, submitUpiPayment } = useApp();
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const upiString = `upi://pay?pa=${activePg.upiId}&pn=${encodeURIComponent(activePg.name)}&am=${amount}&cu=INR`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitUpiPayment({
      residentId: 'res-1',
      month: monthName,
      amount,
      transactionId: transactionId || `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      screenshotUrl
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
        >
          <X className="h-4 w-4" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Proof Submitted!</h3>
            <p className="text-xs text-slate-500">Accountant will verify your UPI screenshot and issue receipt within 2 hours.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">UPI Rent Gateway</h3>
                <p className="text-xs text-slate-500">{monthName} Rent • ₹{amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Dynamic UPI QR Code Display Box */}
            <div className="mt-4 rounded-2xl bg-gradient-to-b from-indigo-50 to-purple-50 p-4 text-center dark:from-slate-800 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-2">
                Scan with GPay / PhonePe / Paytm
              </span>

              <div className="mx-auto my-2 flex h-40 w-40 items-center justify-center rounded-2xl bg-white p-3 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`}
                  alt="Dynamic UPI QR"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                UPI ID: <span className="font-mono text-indigo-600 dark:text-indigo-400">{activePg.upiId}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Payee Name: {activePg.name}</p>
            </div>

            {/* Screenshot Upload Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  UPI Ref / Transaction UTR Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 619283741029"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Payment Screenshot
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                  <Upload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-white">Screenshot attached</span>
                    <p className="text-[10px] text-slate-400">Supported: PNG, JPG, WEBP</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Submitting Payment Proof...' : 'Confirm & Submit Receipt Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
