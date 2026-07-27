import React, { useState } from 'react';
import { Resident } from '../types';
import { ShieldCheck, QrCode, PhoneCall, RefreshCw, Award, MapPin } from 'lucide-react';

interface Props {
  resident: Resident;
}

export const DigitalIdCard: React.FC<Props> = ({ resident }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Digital Resident Pass</span>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <RefreshCw className="h-3 w-3" /> Flip Card
        </button>
      </div>

      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer transition-all duration-500 transform perspective-1000"
      >
        {!isFlipped ? (
          /* FRONT OF CARD */
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-2xl border border-indigo-500/30">
            {/* Hologram Accent */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold">
                  RP
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-tight">{resident.pgName || 'Royal Palms Executive PG'}</h4>
                  <p className="text-[9px] text-indigo-300">Official Tenant Identity</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="h-3 w-3" /> VERIFIED
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <img
                src={resident.passportPhotoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'}
                alt={resident.name}
                className="h-20 w-20 rounded-2xl border-2 border-indigo-400 object-cover shadow-md"
              />
              <div>
                <h3 className="text-base font-extrabold text-white">{resident.name}</h3>
                <p className="text-xs text-indigo-200 mt-0.5">{resident.collegeOrCompany}</p>
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-800/80 px-2 py-1 text-[11px] font-bold text-indigo-100">
                    Room: {resident.roomNumber}
                  </span>
                  <span className="rounded-lg bg-emerald-800/80 px-2 py-1 text-[11px] font-bold text-emerald-100">
                    Bed: {resident.bedCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px]">
              <div>
                <span className="text-indigo-300 block">Aadhaar (Last 4)</span>
                <span className="font-mono font-bold text-white">•••• {resident.aadhaarNumber?.slice(-4) || '8831'}</span>
              </div>
              <div>
                <span className="text-indigo-300 block">Emergency Contact</span>
                <span className="font-bold text-white">{resident.emergencyContact}</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1">
                <QrCode className="h-full w-full text-slate-900" />
              </div>
            </div>
          </div>
        ) : (
          /* BACK OF CARD */
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-700">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tenant Rules & Details</span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">Blood Group:</span>
                <p className="font-bold text-rose-400">{resident.bloodGroup || 'O+ Positive'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Parent / Guardian Name:</span>
                <p className="font-medium text-slate-200">{resident.parentName}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Check-In Date:</span>
                <p className="font-mono text-slate-300">{resident.checkInDate}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Security Deposit Paid:</span>
                <p className="font-bold text-emerald-400">₹{resident.securityDepositPaid?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-800/80 p-2.5 text-[10px] text-slate-300">
              <p className="font-semibold text-white">Hostel Gate Pass Rule:</p>
              <p className="mt-0.5">Digital pass must be presented at main security gate for entry post 10:00 PM.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
