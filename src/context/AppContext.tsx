import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  PG,
  Room,
  Bed,
  Resident,
  RentPayment,
  Complaint,
  Visitor,
  Attendance,
  Notice,
  MenuItem,
  LaundryRequest,
  ParcelItem,
  InventoryItem,
  AuditLog,
  Notification
} from '../types';

interface AppContextType {
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role?: UserRole, customUser?: Partial<User>) => void;
  logout: () => void;
  logoutModalOpen: boolean;
  setLogoutModalOpen: (val: boolean) => void;
  activePg: PG;
  setActivePg: (pg: PG) => void;
  pgs: PG[];
  rooms: Room[];
  beds: Bed[];
  residents: Resident[];
  payments: RentPayment[];
  complaints: Complaint[];
  visitors: Visitor[];
  attendance: Attendance[];
  notices: Notice[];
  menu: MenuItem[];
  laundry: LaundryRequest[];
  parcels: ParcelItem[];
  inventory: InventoryItem[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  realTimeConnected: boolean;
  toastNotification: Notification | null;
  setToastNotification: (notif: Notification | null) => void;
  markNotificationRead: (notifId: string) => Promise<void>;
  triggerTestRoleBroadcast: (targetRoles: string[], title: string, message: string) => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (val: boolean) => void;
  refreshData: () => Promise<void>;
  submitUpiPayment: (data: { residentId: string; month: string; amount: number; transactionId?: string; screenshotUrl?: string }) => Promise<void>;
  verifyPayment: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => Promise<void>;
  addComplaint: (data: Partial<Complaint>) => Promise<void>;
  updateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
  addNotice: (data: Partial<Notice>) => Promise<void>;
  addVisitor: (data: Partial<Visitor>) => Promise<void>;
  markAttendance: (residentId: string, status: 'PRESENT' | 'ABSENT' | 'NIGHT_OUT', reason?: string) => Promise<void>;
  addRoom: (roomData: Partial<Room>) => Promise<void>;
  admitResident: (residentData: Partial<Resident>) => Promise<void>;
  deleteResident: (id: string) => Promise<{ success: boolean; message?: string }>;
  updateUpiSettings: (newUpiId: string, merchantName?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u-superadmin',
    name: 'Vikramaditya Sharma',
    email: 'superadmin@pghub.com',
    role: 'SUPER_ADMIN',
    phone: '+91 98765 00001',
    status: 'ACTIVE',
    joinedDate: '2025-01-10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const [activePg, setActivePg] = useState<PG>({
    id: 'pg-1',
    name: 'Royal Palms Executive PG & Hostel',
    code: 'RP-BLR-01',
    address: '#42, 10th Main, HSR Layout Sector 7',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    ownerId: 'u-owner-1',
    ownerName: 'Rajesh Kumar Agarwal',
    contactEmail: 'contact@royalpalms.com',
    contactPhone: '+91 98765 12345',
    upiId: 'royalpalms@upi',
    totalBuildings: 2,
    totalRooms: 24,
    totalBeds: 54,
    occupiedBeds: 46,
    monthlyRevenue: 414000,
    rating: 4.8,
    facilities: ['High-Speed WiFi', '3-Time Meals', 'Daily Housekeeping', 'AC Rooms', 'Attached Bath', 'CCTV Security'],
    rules: ['Gate closes strictly at 10:30 PM', 'No alcohol/smoking'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80'],
    status: 'VERIFIED',
    subscriptionPlan: 'ENTERPRISE'
  });

  const [pgs, setPgs] = useState<PG[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [laundry, setLaundry] = useState<LaundryRequest[]>([]);
  const [parcels, setParcels] = useState<ParcelItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshData = async () => {
    try {
      const [
        resPgs, resRooms, resBeds, resResidents, resPayments,
        resComplaints, resVisitors, resAttendance, resNotices,
        resMenu, resLaundry, resParcels, resInventory, resLogs, resNotifs
      ] = await Promise.all([
        fetch('/api/pgs').then(r => r.json()),
        fetch('/api/rooms').then(r => r.json()),
        fetch('/api/beds').then(r => r.json()),
        fetch('/api/residents').then(r => r.json()),
        fetch('/api/payments').then(r => r.json()),
        fetch('/api/complaints').then(r => r.json()),
        fetch('/api/visitors').then(r => r.json()),
        fetch('/api/attendance').then(r => r.json()),
        fetch('/api/notices').then(r => r.json()),
        fetch('/api/menu').then(r => r.json()),
        fetch('/api/laundry').then(r => r.json()),
        fetch('/api/parcels').then(r => r.json()),
        fetch('/api/inventory').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch(`/api/notifications?role=${currentUser?.role || 'ALL'}&userId=${currentUser?.id || ''}`).then(r => r.json())
      ]);

      if (Array.isArray(resPgs)) setPgs(resPgs);
      if (Array.isArray(resRooms)) setRooms(resRooms);
      if (Array.isArray(resBeds)) setBeds(resBeds);
      if (Array.isArray(resResidents)) setResidents(resResidents);
      if (Array.isArray(resPayments)) setPayments(resPayments);
      if (Array.isArray(resComplaints)) setComplaints(resComplaints);
      if (Array.isArray(resVisitors)) setVisitors(resVisitors);
      if (Array.isArray(resAttendance)) setAttendance(resAttendance);
      if (Array.isArray(resNotices)) setNotices(resNotices);
      if (Array.isArray(resMenu)) setMenu(resMenu);
      if (Array.isArray(resLaundry)) setLaundry(resLaundry);
      if (Array.isArray(resParcels)) setParcels(resParcels);
      if (Array.isArray(resInventory)) setInventory(resInventory);
      if (Array.isArray(resLogs)) setAuditLogs(resLogs);
      if (Array.isArray(resNotifs)) setNotifications(resNotifs);
    } catch (err) {
      console.warn("Failed fetching backend data, using local state", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const [realTimeConnected, setRealTimeConnected] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<Notification | null>(null);

  // Real-Time EventSource Subscription Effect based on active role and user ID
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      const sseUrl = `/api/notifications/subscribe?role=${encodeURIComponent(
        currentUser.role
      )}&userId=${encodeURIComponent(currentUser.id)}`;

      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('init', (e: MessageEvent) => {
        setRealTimeConnected(true);
        try {
          const data = JSON.parse(e.data);
          if (data.notifications && Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          }
        } catch (err) {
          console.error('Error parsing SSE init payload:', err);
        }
      });

      eventSource.addEventListener('notification', (e: MessageEvent) => {
        try {
          const newNotif: Notification = JSON.parse(e.data);
          setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
          setToastNotification(newNotif);
          refreshData();
        } catch (err) {
          console.error('Error parsing SSE notification payload:', err);
        }
      });

      eventSource.onerror = () => {
        setRealTimeConnected(false);
      };
    } catch (e) {
      console.error('Failed establishing EventSource subscription:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [currentUser.role, currentUser.id]);

  const markNotificationRead = async (notifId: string) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifId, role: currentUser.role })
      });
      setNotifications((prev) =>
        prev.map((n) => (notifId === 'ALL' || n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const triggerTestRoleBroadcast = async (targetRoles: string[], title: string, message: string) => {
    await fetch('/api/notifications/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRoles, title, message, priority: 'HIGH', type: 'SYSTEM' })
    });
  };

  const setCurrentUserRole = async (role: UserRole) => {
    try {
      const res = await fetch(`/api/auth/me?role=${role}`);
      const userData = await res.json();
      setCurrentUser(userData);
      setActiveTab('dashboard');
    } catch (e) {
      console.error("Error setting user role:", e);
    }
  };

  const login = async (role?: UserRole, customUser?: Partial<User>) => {
    if (role) {
      try {
        const res = await fetch(`/api/auth/me?role=${role}`);
        const userData = await res.json();
        setCurrentUser({ ...userData, ...customUser });
      } catch (e) {
        console.error("Error logging in:", e);
      }
    } else if (customUser) {
      setCurrentUser(prev => ({ ...prev, ...customUser }));
    }
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setLogoutModalOpen(false);
    setActiveTab('dashboard');
  };

  const submitUpiPayment = async (data: { residentId: string; month: string; amount: number; transactionId?: string; screenshotUrl?: string }) => {
    const res = await fetch('/api/payments/submit-upi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) await refreshData();
  };

  const verifyPayment = async (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    const res = await fetch(`/api/payments/${id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': currentUser.role
      },
      body: JSON.stringify({ status, rejectionReason: reason, verifiedBy: currentUser.name })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Verification error' }));
      alert(`Permission Denied: ${err.message || 'You lack authorization to verify payments.'}`);
    } else {
      await refreshData();
    }
  };

  const addComplaint = async (data: Partial<Complaint>) => {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pgId: activePg.id,
        residentId: 'res-1',
        residentName: currentUser.name,
        roomNumber: currentUser.roomNumber || '101',
        ...data
      })
    });
    if (res.ok) await refreshData();
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    const res = await fetch(`/api/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) await refreshData();
  };

  const addNotice = async (data: Partial<Notice>) => {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgId: activePg.id, postedBy: currentUser.name, ...data })
    });
    if (res.ok) await refreshData();
  };

  const addVisitor = async (data: Partial<Visitor>) => {
    const res = await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgId: activePg.id, ...data })
    });
    if (res.ok) await refreshData();
  };

  const markAttendance = async (residentId: string, status: 'PRESENT' | 'ABSENT' | 'NIGHT_OUT', reason?: string) => {
    const res = await fetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ residentId, status, gatePassReason: reason })
    });
    if (res.ok) await refreshData();
  };

  const addRoom = async (roomData: Partial<Room>) => {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgId: activePg.id, ...roomData })
    });
    if (res.ok) await refreshData();
  };

  const admitResident = async (residentData: Partial<Resident>) => {
    const res = await fetch('/api/residents/admission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': currentUser.role
      },
      body: JSON.stringify({ pgId: activePg.id, pgName: activePg.name, ...residentData })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Admission error' }));
      alert(`Permission Denied: ${err.message || 'You lack authorization to admit residents.'}`);
    } else {
      await refreshData();
    }
  };

  const deleteResident = async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/residents/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUser.role
        }
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Permission denied' };
      }
      await refreshData();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network failure' };
    }
  };

  const updateUpiSettings = (newUpiId: string, merchantName?: string) => {
    const updatedName = merchantName || activePg.name;
    const updatedPg = { ...activePg, upiId: newUpiId, name: updatedName };
    setActivePg(updatedPg);
    setPgs(prev => prev.map(p => p.id === activePg.id ? updatedPg : p));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        isAuthenticated,
        login,
        logout,
        logoutModalOpen,
        setLogoutModalOpen,
        activePg,
        setActivePg,
        pgs,
        rooms,
        beds,
        residents,
        payments,
        complaints,
        visitors,
        attendance,
        notices,
        menu,
        laundry,
        parcels,
        inventory,
        auditLogs,
        notifications,
        realTimeConnected,
        toastNotification,
        setToastNotification,
        markNotificationRead,
        triggerTestRoleBroadcast,
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        aiDrawerOpen,
        setAiDrawerOpen,
        refreshData,
        submitUpiPayment,
        verifyPayment,
        addComplaint,
        updateComplaint,
        addNotice,
        addVisitor,
        markAttendance,
        addRoom,
        admitResident,
        deleteResident,
        updateUpiSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
