import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Shirt,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Truck,
  Sparkles,
  Calendar,
  X,
  BellRing
} from 'lucide-react';

export const LaundryParcelsView: React.FC = () => {
  const { parcels, laundry, addParcel, activePg, residents } = useApp();
  const [activeTab, setActiveTab] = useState<'parcels' | 'laundry'>('parcels');
  const [newParcelModal, setNewParcelModal] = useState(false);

  // New Parcel Form State
  const [courier, setCourier] = useState('Amazon Logistics');
  const [residentName, setResidentName] = useState('Aarav Mehta');
  const [roomNumber, setRoomNumber] = useState('101');
  const [trackingId, setTrackingId] = useState('AMZ-99381029');

  const handleAddParcel = (e: React.FormEvent) => {
    e.preventDefault();
    addParcel({
      residentName,
      roomNumber,
      courierName: courier,
      trackingId,
      receivedDate: new Date().toISOString().split('T')[0]
    });
    alert(`Parcel logged for ${residentName} (Room ${roomNumber})! SMS notification queued.`);
    setNewParcelModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Gate Parcels & Laundry Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activePg.name} • Gate courier intake, resident OTP pickup & washing machine schedule
          </p>
        </div>

        <button
          onClick={() => setNewParcelModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Log Incoming Courier Parcel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('parcels')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'parcels'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Gate Deliveries & Courier Parcels ({parcels.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('laundry')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'laundry'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <Shirt className="h-4 w-4" />
          <span>Washing & Ironing Laundry Slots ({laundry.length})</span>
        </button>
      </div>

      {activeTab === 'parcels' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parcels.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{p.courierName}</div>
                      <div className="text-[10px] text-slate-400">ID: {p.trackingId}</div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.status === 'COLLECTED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">{p.residentName}</div>
                  <div className="text-[11px] text-slate-500">Room {p.roomNumber}</div>
                  <div className="text-[10px] text-slate-400">Received at gate: {p.receivedDate}</div>
                </div>

                {p.status === 'RECEIVED_AT_GATE' && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => alert(`Marked parcel ${p.trackingId} as collected by resident!`)}
                      className="w-full rounded-xl bg-slate-100 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Verify Resident OTP & Hand Over
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {laundry.map((l) => (
              <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      <Shirt className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{l.residentName}</div>
                      <div className="text-[10px] text-slate-400">Room {l.roomNumber}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {l.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="text-slate-700 dark:text-slate-300">
                    Cloth Count: <span className="font-bold">{l.clothesCount} items</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Service: {l.serviceType}</div>
                  <div className="text-[10px] text-slate-400">Drop Date: {l.dropDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Parcel Modal */}
      {newParcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Incoming Courier Parcel</h3>
              </div>
              <button onClick={() => setNewParcelModal(false)} className="rounded-lg p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddParcel} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Resident Name</label>
                <select
                  value={residentName}
                  onChange={(e) => {
                    setResidentName(e.target.value);
                    const res = residents.find(r => r.name === e.target.value);
                    if (res) setRoomNumber(res.roomNumber);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {residents.map(r => (
                    <option key={r.id} value={r.name}>
                      {r.name} (Room {r.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Courier Company</label>
                <input
                  type="text"
                  required
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tracking Ref / Order ID</label>
                <input
                  type="text"
                  required
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewParcelModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  Log Parcel & Notify Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
