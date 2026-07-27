import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room, Bed } from '../types';
import { BedDouble, Wind, Bath, CheckCircle, AlertCircle, UserPlus, ArrowRightLeft, Plus } from 'lucide-react';

export const RoomBedGrid: React.FC = () => {
  const { rooms, beds, residents, addRoom, admitResident } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
  
  // New Room Form State
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState<'SINGLE' | 'DOUBLE_SHARING' | 'TRIPLE_SHARING'>('DOUBLE_SHARING');
  const [rentPerBed, setRentPerBed] = useState(9000);
  const [isAC, setIsAC] = useState(true);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const capacity = roomType === 'SINGLE' ? 1 : roomType === 'DOUBLE_SHARING' ? 2 : 3;
    await addRoom({
      buildingId: 'b-1',
      buildingName: 'Tower A',
      floorId: 'fl-1',
      floorNumber: 1,
      roomNumber,
      roomType,
      sharingCapacity: capacity,
      rentPerBed: Number(rentPerBed),
      securityDeposit: Number(rentPerBed) * 1.5,
      isAC,
      hasAttachedBathroom: true,
      hasBalcony: false,
      totalBeds: capacity
    });
    setAddRoomModalOpen(false);
    setRoomNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Room & Bed Allocation Matrix</h2>
          <p className="text-xs text-slate-500">Live floor-by-floor occupancy and vacancy view</p>
        </div>
        <button
          onClick={() => setAddRoomModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add New Room
        </button>
      </div>

      {/* Grid of Rooms */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((room) => {
          const roomBeds = beds.filter(b => b.roomId === room.id);
          const isFull = room.occupiedBeds >= room.sharingCapacity;

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:shadow-xl ${
                isFull
                  ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  : 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/50 dark:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">Room {room.roomNumber}</span>
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Floor {room.floorNumber}
                  </span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isFull ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {isFull ? 'FULL' : `${room.sharingCapacity - room.occupiedBeds} BEDS VACANT`}
                </span>
              </div>

              {/* Room Features */}
              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{room.roomType.replace('_', ' ')}</span>
                •
                {room.isAC && (
                  <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                    <Wind className="h-3 w-3" /> AC
                  </span>
                )}
                {room.hasAttachedBathroom && (
                  <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                    <Bath className="h-3 w-3" /> Bath
                  </span>
                )}
              </div>

              {/* Beds Status Bar */}
              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bed Allocation Status</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {roomBeds.map((bed) => (
                    <div
                      key={bed.id}
                      className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold ${
                        bed.status === 'OCCUPIED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-300'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold">{bed.bedCode}</span>
                        <span className="block text-[9px] opacity-80 truncate">{bed.residentName || 'Vacant'}</span>
                      </div>
                      <span className={`h-2 w-2 rounded-full ${bed.status === 'OCCUPIED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800 text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200">₹{room.rentPerBed.toLocaleString('en-IN')}/bed/mo</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">Manage Room →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      {addRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Room</h3>
            <form onSubmit={handleCreateRoom} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 104"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e: any) => setRoomType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                >
                  <option value="SINGLE">Single Room (1 Bed)</option>
                  <option value="DOUBLE_SHARING">Double Sharing (2 Beds)</option>
                  <option value="TRIPLE_SHARING">Triple Sharing (3 Beds)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Rent Per Bed (₹/mo)</label>
                <input
                  type="number"
                  value={rentPerBed}
                  onChange={(e) => setRentPerBed(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="acCheck"
                  checked={isAC}
                  onChange={(e) => setIsAC(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="acCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Air Conditioned Room (AC)</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddRoomModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
