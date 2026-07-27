import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FeatureModuleGrid } from '../components/FeatureModuleGrid';
import { QrCode, CheckCircle2, XCircle, FileText, Download, ShieldCheck, Search } from 'lucide-react';

export const AccountantView: React.FC = () => {
  const { payments, verifyPayment } = useApp();
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const pendingList = payments.filter(p => p.status === 'PENDING_VERIFICATION');
  const verifiedList = payments.filter(p => p.status === 'APPROVED');

  const exportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Receipt No,Resident,Room,Month,Amount,Status,Transaction ID"].join(",") + "\n"
      + payments.map(p => `${p.receiptNumber},${p.residentName},${p.roomNumber},${p.month},${p.amountPaid},${p.status},${p.transactionId || ''}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rent_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Accountant Rent & UPI Receipts Portal</h1>
          <p className="text-xs text-slate-500">Verify tenant payment screenshots and generate digital GST receipts</p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" /> Export CSV Financial Report
        </button>
      </div>

      {/* Pending Verification Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <QrCode className="h-4 w-4 text-amber-500" /> Pending UPI Payment Verifications ({pendingList.length})
        </h3>
        <p className="text-xs text-slate-500 mb-4">Review transaction UTR against tenant screenshot proof</p>

        {pendingList.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No pending UPI screenshots awaiting verification right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pendingList.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 dark:border-slate-700">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{p.residentName}</div>
                    <div className="text-[10px] text-slate-400">Room {p.roomNumber} • {p.month} Rent</div>
                  </div>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{p.amountPaid.toLocaleString('en-IN')}</span>
                </div>

                <div className="mt-3 text-xs space-y-1">
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Ref UTR: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.transactionId}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Submitted: {p.paymentDate}</div>
                </div>

                {p.upiScreenshotUrl && (
                  <button
                    onClick={() => setSelectedScreenshot(p.upiScreenshotUrl!)}
                    className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline block"
                  >
                    🔍 Inspect Payment Screenshot Proof
                  </button>
                )}

                <div className="mt-4 flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => verifyPayment(p.id, 'APPROVED')}
                    className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700"
                  >
                    Approve & Issue Receipt
                  </button>
                  <button
                    onClick={() => verifyPayment(p.id, 'REJECTED', 'UTR mismatch')}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Receipts List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Approved Rent Receipts History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/50">
                <th className="p-2.5">Receipt No</th>
                <th className="p-2.5">Resident</th>
                <th className="p-2.5">Month</th>
                <th className="p-2.5">Amount Paid</th>
                <th className="p-2.5">Verified By</th>
                <th className="p-2.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {verifiedList.map((v) => (
                <tr key={v.id}>
                  <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{v.receiptNumber}</td>
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{v.residentName} (Room {v.roomNumber})</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-300">{v.month}</td>
                  <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">₹{v.amountPaid.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-slate-500">{v.verifiedBy || 'Accountant'}</td>
                  <td className="p-2.5 text-slate-400">{v.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Inspection Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="relative max-w-lg rounded-3xl bg-white p-4 dark:bg-slate-900">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute right-3 top-3 rounded-full bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200"
            >
              <XCircle className="h-5 w-5" />
            </button>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">UPI Transaction Proof Screenshot</h4>
            <img src={selectedScreenshot} alt="Payment Proof" className="max-h-[70vh] w-full rounded-2xl object-contain border border-slate-200" />
          </div>
        </div>
      )}

      {/* Feature Modules Grid */}
      <FeatureModuleGrid />
    </div>
  );
};
