import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, QrCode, Plus, CheckCircle2 } from 'lucide-react';

export const VisitorsView: React.FC = () => {
  const { visitors, addVisitor, residents } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [relation, setRelation] = useState('BROTHER');
  const [purpose, setPurpose] = useState('');
  const [residentId, setResidentId] = useState(residents[0]?.id || 'res-1');

  const handleCreateVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetRes = residents.find(r => r.id === residentId) || residents[0];
    await addVisitor({
      residentId: targetRes.id,
      residentName: targetRes.name,
      roomNumber: targetRes.roomNumber,
      visitorName,
      visitorPhone,
      relation,
      purpose
    });
    setModalOpen(false);
    setVisitorName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Visitor Pass Management</h1>
          <p className="text-xs text-slate-500">QR Gate pass generator for parents and family visitors</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow"
        >
          <Plus className="h-4 w-4" /> Issue Digital Gate Pass
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visitors.map((vis) => (
          <div key={vis.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="font-bold text-xs text-slate-900 dark:text-white">{vis.visitorName}</span>
              <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">{vis.passCode}</span>
            </div>

            <div className="mt-2 text-xs space-y-1">
              <p className="text-slate-600 dark:text-slate-300">Visiting: <span className="font-bold text-slate-800 dark:text-white">{vis.residentName} (Room {vis.roomNumber})</span></p>
              <p className="text-slate-500">Relation: {vis.relation}</p>
              <p className="text-slate-500">Purpose: {vis.purpose}</p>
              <p className="text-[10px] text-slate-400 mt-2">Entry: {vis.entryTime}</p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Generate Visitor Gate Pass</h3>
            
            <form onSubmit={handleCreateVisitor} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Resident</label>
                <select
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (Room {r.roomNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Visitor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Visitor Name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delivering home documents"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
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
                  Generate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
