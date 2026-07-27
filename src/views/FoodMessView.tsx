import React from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Star, Coffee, Clock } from 'lucide-react';

export const FoodMessView: React.FC = () => {
  const { menu } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Utensils className="h-5 w-5 text-amber-500" /> Weekly Hostel Mess Menu Plan
        </h1>
        <p className="text-xs text-slate-500">Hygiene certified 3-meal & evening snacks schedule with student rating feedback</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((day) => (
          <div
            key={day.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{day.dayOfWeek}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {day.ratingAverage} ★
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Breakfast (7:30 - 9:30 AM)</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{day.breakfast}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Lunch (12:30 - 2:30 PM)</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{day.lunch}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Snacks & Tea (5:00 - 6:00 PM)</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{day.snacks}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dinner (8:00 - 10:00 PM)</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{day.dinner}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
