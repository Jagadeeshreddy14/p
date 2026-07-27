import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { UpiPaymentModal } from '../components/UpiPaymentModal';
import { FeatureModuleGrid } from '../components/FeatureModuleGrid';
import { QrCode, AlertCircle, Utensils, Shirt, Package, Sparkles, CheckCircle2, ChevronRight, Phone } from 'lucide-react';

export const ResidentView: React.FC = () => {
  const { residents, payments, complaints, menu, parcels, laundry, activePg, setAiDrawerOpen } = useApp();
  const [upiModalOpen, setUpiModalOpen] = useState(false);

  // Active Resident
  const resident = residents[0] || {
    id: 'res-1',
    name: 'Aarav Mehta',
    roomNumber: '101',
    bedCode: '101-A',
    pgName: activePg.name,
    dueAmount: 9000,
    rentStatus: 'DUE',
    emergencyContact: '+91 98777 66554',
    aadhaarNumber: '4829 1029 8831'
  };

  const todayMenu = menu[0] || { breakfast: 'Idli Vada', lunch: 'North Indian Thali', snacks: 'Samosa Chai', dinner: 'Paneer Butter Masala' };
  const userParcels = parcels.filter(p => p.residentName === resident.name);
  const userLaundry = laundry.filter(l => l.residentName === resident.name);

  return (
    <div className="space-y-6">
      <UpiPaymentModal
        isOpen={upiModalOpen}
        onClose={() => setUpiModalOpen(false)}
        monthName="July 2026"
        amount={9000}
      />

      {/* Hero Welcome Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back, {resident.name}!</h1>
          <p className="text-xs text-slate-500">
            {activePg.name} • Room {resident.roomNumber} (Bed {resident.bedCode})
          </p>
        </div>
        <button
          onClick={() => setAiDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-95"
        >
          <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
          Ask AI Hostel Assistant
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Digital ID Card Column */}
        <div className="space-y-4">
          <DigitalIdCard resident={resident as any} />

          {/* Quick Warden Line */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emergency & Gate Desk</span>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">Warden Ramesh Sundaram</div>
                <div className="text-[10px] text-slate-400">+91 98111 22233</div>
              </div>
              <a
                href="tel:+919811122233"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Center Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rent Status Card */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl border border-indigo-500/30">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                <QrCode className="h-3.5 w-3.5" /> Rent Status • July 2026
              </span>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                DUE
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <span className="text-xs text-indigo-200">Monthly Rent Amount</span>
                <div className="text-3xl font-black">₹9,000</div>
              </div>
              <button
                onClick={() => setUpiModalOpen(true)}
                className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg hover:brightness-105"
              >
                <QrCode className="h-4 w-4" /> Pay Rent via Dynamic UPI QR
              </button>
            </div>
          </div>

          {/* Today's Mess Menu Widget */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Today's Hostel Mess Plan</h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">4.8 ★ Rating</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Breakfast</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{todayMenu.breakfast}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Lunch</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{todayMenu.lunch}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Snacks</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{todayMenu.snacks}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dinner</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{todayMenu.dinner}</p>
              </div>
            </div>
          </div>

          {/* Laundry & Parcels Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                <Package className="h-4 w-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Parcel Pickup Gate OTP</h4>
              </div>
              {userParcels.length > 0 ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-indigo-50 p-3 dark:bg-indigo-950/40">
                  <div>
                    <div className="font-bold text-xs text-indigo-900 dark:text-indigo-200">{userParcels[0].courierCompany}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400">Tracking: {userParcels[0].trackingNumber}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block">OTP Code</span>
                    <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-300">{userParcels[0].otp}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">No incoming parcels currently at main desk.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                <Shirt className="h-4 w-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Laundry Status</h4>
              </div>
              {userLaundry.length > 0 ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-purple-50 p-3 dark:bg-purple-950/40">
                  <div>
                    <div className="font-bold text-xs text-purple-900 dark:text-purple-200">{userLaundry[0].itemCount} Clothes ({userLaundry[0].clothTypes})</div>
                    <div className="text-[10px] text-purple-600 dark:text-purple-400">Pickup: {userLaundry[0].pickupDate}</div>
                  </div>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {userLaundry[0].status}
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">No active laundry requests.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Platform Feature Modules Grid */}
      <FeatureModuleGrid />
    </div>
  );
};
