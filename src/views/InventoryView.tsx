import React from 'react';
import { useApp } from '../context/AppContext';
import { Boxes, PackageCheck, AlertTriangle } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Boxes className="h-5 w-5 text-indigo-600" /> Hostel Inventory & Fixed Asset Tracking
        </h1>
        <p className="text-xs text-slate-500">Live stock counts for AC units, mattresses, study desks, and kitchen appliances</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span className="font-bold text-xs text-slate-900 dark:text-white">{item.itemName}</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {item.category}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">In Use</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">{item.inUseQuantity}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">In Stock</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{item.inStockQuantity}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/50">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Damaged</span>
                <span className="font-extrabold text-rose-500 text-sm">{item.damagedQuantity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Unit Cost: <strong>₹{item.unitCost.toLocaleString('en-IN')}</strong></span>
              <span>Restocked: {item.lastRestockedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
