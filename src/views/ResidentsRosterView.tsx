import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { hasPermission, PermissionGuard, getRoleAccessLevel } from '../utils/permissions';
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Phone,
  Mail,
  Home,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  X,
  CreditCard,
  Trash2,
  ShieldAlert,
  Lock
} from 'lucide-react';

export const ResidentsRosterView: React.FC = () => {
  const { residents, admitResident, deleteResident, activePg, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRent, setFilterRent] = useState<'ALL' | 'PAID' | 'DUE' | 'OVERDUE'>('ALL');
  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<typeof residents[0] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const roleInfo = getRoleAccessLevel(currentUser.role);
  const canDelete = hasPermission(currentUser.role, 'DELETE_RESIDENT');
  const canAdmit = hasPermission(currentUser.role, 'ADMIT_RESIDENT');

  const handleDeleteResident = async (resId: string, resName: string) => {
    if (!confirm(`Are you sure you want to permanently delete/evict resident "${resName}"? This operation requires SUPER_ADMIN or PG_OWNER clearance.`)) {
      return;
    }
    setDeletingId(resId);
    const result = await deleteResident(resId);
    setDeletingId(null);
    if (result.success) {
      alert(`Resident ${resName} removed successfully from directory.`);
      setSelectedResident(null);
    } else {
      alert(`Permission Denied / Error: ${result.message || 'You lack authorization to delete residents.'}`);
    }
  };

  // Form State
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resRoom, setResRoom] = useState('101');
  const [resBed, setResBed] = useState('101-A');
  const [aadhaar, setAadhaar] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const filteredResidents = residents.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.includes(searchTerm) ||
      r.phone.includes(searchTerm) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterRent === 'ALL') return matchesSearch;
    return matchesSearch && r.rentStatus === filterRent;
  });

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await admitResident({
      name: resName,
      phone: resPhone,
      email: `${resName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      roomNumber: resRoom,
      bedCode: resBed,
      checkInDate: new Date().toISOString().split('T')[0],
      aadhaarNumber: aadhaar || '9988 7766 5544',
      collegeOrCompany: 'Software Engineer',
      parentName: parentName || 'Guardian',
      parentPhone: parentPhone || '+91 98765 43210',
      parentEmail: 'parent@gmail.com',
      emergencyContact: parentPhone || '+91 98765 43210',
      bloodGroup: 'O+ Positive',
      monthlyRent: 9000,
      securityDepositPaid: 15000
    });
    alert(`Resident ${resName} successfully admitted to Room ${resRoom} (Bed ${resBed})!`);
    setResName('');
    setResPhone('');
    setAdmitModalOpen(false);
  };

  const exportRosterCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Room,Bed,Phone,Email,Rent Status,Due Amount,CheckIn Date,Emergency Contact"].join(",") + "\n"
      + residents.map(r => `${r.id},"${r.name}",${r.roomNumber},${r.bedCode},${r.phone},${r.email},${r.rentStatus},${r.dueAmount},${r.checkInDate},${r.emergencyContact}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Resident_Roster_${activePg.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Role Access Level Notice Banner */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-3.5 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-indigo-600 p-2 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white">Active Permission Scope:</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${roleInfo.badgeBg} ${roleInfo.badgeText}`}>
                {roleInfo.label}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
              {roleInfo.scope} • Sensitive actions (Admit, Evict) are strictly validated against API endpoint matrices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className={`rounded-lg px-2 py-1 font-bold ${canAdmit ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
            Admit: {canAdmit ? 'ALLOWED' : 'LOCKED'}
          </span>
          <span className={`rounded-lg px-2 py-1 font-bold ${canDelete ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
            Evict: {canDelete ? 'ALLOWED' : 'LOCKED'}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Resident Roster & Tenant Directory</h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
              {residents.length} Active Tenants
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activePg.name} • Full directory of admitted residents, room allocations & KYC status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportRosterCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>

          <PermissionGuard
            role={currentUser.role}
            action="ADMIT_RESIDENT"
            fallback={
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                title="Admitting residents requires Super Admin, PG Owner, or Warden privilege"
              >
                <Lock className="h-3.5 w-3.5" /> Admit Resident
              </button>
            }
          >
            <button
              onClick={() => setAdmitModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <UserPlus className="h-4 w-4" /> Admit New Resident
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, room #, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Rent Status:</span>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(['ALL', 'PAID', 'DUE', 'OVERDUE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterRent(st)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  filterRent === st
                    ? 'bg-white text-indigo-700 shadow dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Residents Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                <th className="p-3.5">Resident</th>
                <th className="p-3.5">Room & Bed</th>
                <th className="p-3.5">Contact Info</th>
                <th className="p-3.5">Rent Status</th>
                <th className="p-3.5">Check-In Date</th>
                <th className="p-3.5">KYC Aadhaar</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredResidents.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/60 transition dark:hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {res.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{res.name}</div>
                        <div className="text-[10px] text-slate-400">{res.collegeOrCompany || 'Resident'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                      <Home className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Room {res.roomNumber}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Bed {res.bedCode}
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{res.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-[180px]">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{res.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        res.rentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : res.rentStatus === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {res.rentStatus === 'PAID' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5" />
                      )}
                      {res.rentStatus} {res.dueAmount > 0 && `(₹${res.dueAmount})`}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    {res.checkInDate || '2025-01-15'}
                  </td>

                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      {res.aadhaarNumber ? `••• ${res.aadhaarNumber.slice(-4)}` : 'Verified'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedResident(res)}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resident Detail Modal */}
      {selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                  {selectedResident.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedResident.name}</h3>
                  <p className="text-xs text-slate-500">Room {selectedResident.roomNumber} (Bed {selectedResident.bedCode})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResident(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Contact Phone</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedResident.phone}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Email</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{selectedResident.email}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Parent / Guardian</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedResident.parentName || 'Mahesh Mehta'}</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400">{selectedResident.parentPhone || '+91 98765 00000'}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Monthly Rent</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{selectedResident.monthlyRent || 9000} / mo</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <PermissionGuard
                role={currentUser.role}
                action="DELETE_RESIDENT"
                fallback={
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Lock className="h-3 w-3 text-amber-500" />
                    <span>Eviction / Deletion restricted to SUPER_ADMIN & PG_OWNER</span>
                  </div>
                }
              >
                <button
                  disabled={deletingId === selectedResident.id}
                  onClick={() => handleDeleteResident(selectedResident.id, selectedResident.name)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deletingId === selectedResident.id ? 'Deleting...' : 'Delete / Evict Tenant'}
                </button>
              </PermissionGuard>

              <button
                onClick={() => setSelectedResident(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Resident Admission Modal */}
      {admitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Admit New Resident</h3>
              </div>
              <button onClick={() => setAdmitModalOpen(false)} className="rounded-lg p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 00000"
                    value={resPhone}
                    onChange={(e) => setResPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Aadhaar No</label>
                  <input
                    type="text"
                    placeholder="12 digit Aadhaar"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Assign Room</label>
                  <input
                    type="text"
                    value={resRoom}
                    onChange={(e) => setResRoom(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Assign Bed</label>
                  <input
                    type="text"
                    value={resBed}
                    onChange={(e) => setResBed(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdmitModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-md hover:bg-indigo-700"
                >
                  Admit Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
