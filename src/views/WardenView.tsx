import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Clock, UserPlus, AlertCircle, ShieldAlert, Check, X, QrCode } from 'lucide-react';

export const WardenView: React.FC<{ initialTab?: 'attendance' | 'visitors' | 'admission' }> = ({ initialTab = 'attendance' }) => {
  const { residents, visitors, attendance, markAttendance, addVisitor, admitResident, activePg } = useApp();
  const [activeTab, setActiveTab] = useState<'attendance' | 'visitors' | 'admission'>(initialTab);

  // Admission Form State
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resRoom, setResRoom] = useState('101');
  const [resBed, setResBed] = useState('101-A');
  const [aadhaar, setAadhaar] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await admitResident({
      name: resName,
      phone: resPhone,
      email: `${resName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      roomNumber: resRoom,
      bedCode: resBed,
      checkInDate: new Date().toISOString().split('T')[0],
      aadhaarNumber: aadhaar,
      collegeOrCompany: 'Software Engineer',
      parentName,
      parentPhone,
      parentEmail: `${parentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      emergencyContact: parentPhone,
      bloodGroup: 'B+ Positive',
      monthlyRent: 9000,
      securityDepositPaid: 15000
    });
    alert(`Resident ${resName} successfully admitted and allocated Bed ${resBed}!`);
    setResName('');
    setResPhone('');
    setActiveTab('attendance');
  };

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Daily Attendance & Gate Passes
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'visitors'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Visitor Passes ({visitors.filter(v => v.status === 'CHECKED_IN').length})
          </button>
          <button
            onClick={() => setActiveTab('admission')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'admission'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            New Resident Check-In
          </button>
        </div>
      </div>

      {/* Attendance View */}
      {activeTab === 'attendance' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Resident Daily Gate & In-Time Tracker</h3>
          <p className="text-xs text-slate-500 mb-4">Mark present, absent, or register weekend night-out permissions</p>

          <div className="space-y-3">
            {residents.map((res) => {
              const todayAtt = attendance.find(a => a.residentId === res.id);
              return (
                <div
                  key={res.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs">
                      {res.roomNumber}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{res.name}</div>
                      <div className="text-[10px] text-slate-400">Bed: {res.bedCode} • Phone: {res.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAttendance(res.id, 'PRESENT')}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        todayAtt?.status === 'PRESENT'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(res.id, 'NIGHT_OUT', 'Family Visit')}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        todayAtt?.status === 'NIGHT_OUT'
                          ? 'bg-amber-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Night Out Gate Pass
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visitor Management View */}
      {activeTab === 'visitors' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Visitor Passes</h3>
          <p className="text-xs text-slate-500 mb-4">Gate log for parents, family, and contractors</p>

          <div className="space-y-3">
            {visitors.map((vis) => (
              <div
                key={vis.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{vis.visitorName}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Visiting: <span className="font-semibold text-slate-800 dark:text-slate-200">{vis.residentName} (Room {vis.roomNumber})</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Purpose: {vis.purpose}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">{vis.passCode}</span>
                  <span className="text-[10px] text-slate-400 block">Entry: {vis.entryTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admission View */}
      {activeTab === 'admission' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Admit New Resident</h3>
          <p className="text-xs text-slate-500 mb-4">Complete Aadhaar document check and bed allocation</p>

          <form onSubmit={handleAdmissionSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Singh"
                value={resName}
                onChange={(e) => setResName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98888 11111"
                  value={resPhone}
                  onChange={(e) => setResPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  required
                  placeholder="12 digit Aadhaar"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  required
                  placeholder="Parent Name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Emergency Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 Parent Contact"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700"
            >
              Confirm Admission & Generate Digital Pass
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
