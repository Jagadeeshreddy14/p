import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  INITIAL_USERS,
  INITIAL_PGS,
  INITIAL_BUILDINGS,
  INITIAL_ROOMS,
  INITIAL_BEDS,
  INITIAL_RESIDENTS,
  INITIAL_RENT_PAYMENTS,
  INITIAL_COMPLAINTS,
  INITIAL_VISITORS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTICES,
  INITIAL_MENU,
  INITIAL_LAUNDRY,
  INITIAL_PARCELS,
  INITIAL_INVENTORY,
  INITIAL_STAFF,
  INITIAL_AUDIT_LOGS
} from "./src/data/mockData";

// Server State Store
const db = {
  users: [...INITIAL_USERS],
  pgs: [...INITIAL_PGS],
  buildings: [...INITIAL_BUILDINGS],
  rooms: [...INITIAL_ROOMS],
  beds: [...INITIAL_BEDS],
  residents: [...INITIAL_RESIDENTS],
  payments: [...INITIAL_RENT_PAYMENTS],
  complaints: [...INITIAL_COMPLAINTS],
  visitors: [...INITIAL_VISITORS],
  attendance: [...INITIAL_ATTENDANCE],
  notices: [...INITIAL_NOTICES],
  menu: [...INITIAL_MENU],
  laundry: [...INITIAL_LAUNDRY],
  parcels: [...INITIAL_PARCELS],
  inventory: [...INITIAL_INVENTORY],
  staff: [...INITIAL_STAFF],
  auditLogs: [...INITIAL_AUDIT_LOGS]
};

// Initialize Gemini Client
let genAI: GoogleGenAI | null = null;
try {
  genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "dummy_key",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
} catch (e) {
  console.warn("Gemini client fallback initialization warning:", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper log audit
  const logAudit = (action: string, performedBy: string, role: any, details: string) => {
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      action,
      performedBy,
      role,
      details,
      timestamp: new Date().toLocaleString('en-IN'),
      ipAddress: '127.0.0.1'
    });
  };

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "PG & Hostel Management System" });
  });

  // Auth / Role Switcher
  app.get("/api/users", (_req, res) => {
    res.json(db.users);
  });

  app.get("/api/auth/me", (req, res) => {
    const role = (req.query.role as string) || "SUPER_ADMIN";
    const user = db.users.find(u => u.role === role) || db.users[0];
    res.json(user);
  });

  // PGs API
  app.get("/api/pgs", (_req, res) => {
    res.json(db.pgs);
  });

  app.get("/api/pgs/:id", (req, res) => {
    const pg = db.pgs.find(p => p.id === req.params.id);
    if (!pg) return res.status(404).json({ error: "PG not found" });
    res.json(pg);
  });

  app.put("/api/pgs/:id", (req, res) => {
    const pgIndex = db.pgs.findIndex(p => p.id === req.params.id);
    if (pgIndex === -1) return res.status(404).json({ error: "PG not found" });
    db.pgs[pgIndex] = { ...db.pgs[pgIndex], ...req.body };
    logAudit("PG_SETTINGS_UPDATED", "PG Owner", "PG_OWNER", `Updated settings for ${db.pgs[pgIndex].name}`);
    res.json(db.pgs[pgIndex]);
  });

  // Rooms & Beds API
  app.get("/api/rooms", (req, res) => {
    const pgId = req.query.pgId as string;
    const rooms = pgId ? db.rooms.filter(r => r.pgId === pgId) : db.rooms;
    res.json(rooms);
  });

  app.get("/api/beds", (req, res) => {
    const roomId = req.query.roomId as string;
    const beds = roomId ? db.beds.filter(b => b.roomId === roomId) : db.beds;
    res.json(beds);
  });

  app.post("/api/rooms", (req, res) => {
    const newRoom = {
      id: `rm-${Date.now()}`,
      occupiedBeds: 0,
      status: "AVAILABLE",
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80'],
      ...req.body
    };
    db.rooms.push(newRoom);

    // Create beds for room
    for (let i = 1; i <= newRoom.sharingCapacity; i++) {
      const bedLetter = String.fromCharCode(64 + i); // A, B, C...
      db.beds.push({
        id: `bed-${newRoom.roomNumber}${bedLetter}-${Date.now()}`,
        roomId: newRoom.id,
        roomNumber: newRoom.roomNumber,
        bedCode: `${newRoom.roomNumber}-${bedLetter}`,
        status: "VACANT",
        rentAmount: newRoom.rentPerBed
      });
    }

    logAudit("ROOM_ADDED", "Admin", "PG_OWNER", `Added Room ${newRoom.roomNumber}`);
    res.status(201).json(newRoom);
  });

  // Residents API
  app.get("/api/residents", (req, res) => {
    const pgId = req.query.pgId as string;
    const residents = pgId ? db.residents.filter(r => r.pgId === pgId) : db.residents;
    res.json(residents);
  });

  app.post("/api/residents/admission", (req, res) => {
    const data = req.body;
    const newResident = {
      id: `res-${Date.now()}`,
      userId: `u-res-${Date.now()}`,
      rentStatus: "DUE",
      dueAmount: data.monthlyRent || 9000,
      status: "ACTIVE",
      ...data
    };
    db.residents.push(newResident);

    // Update bed allocation
    const bed = db.beds.find(b => b.bedCode === data.bedCode);
    if (bed) {
      bed.status = "OCCUPIED";
      bed.residentId = newResident.id;
      bed.residentName = newResident.name;
      bed.residentPhone = newResident.phone;
    }

    logAudit("RESIDENT_ADMITTED", "Warden", "WARDEN", `Admitted ${newResident.name} to Room ${newResident.roomNumber}`);
    res.status(201).json(newResident);
  });

  // Rent Payments API
  app.get("/api/payments", (req, res) => {
    const residentId = req.query.residentId as string;
    const payments = residentId ? db.payments.filter(p => p.residentId === residentId) : db.payments;
    res.json(payments);
  });

  app.post("/api/payments/submit-upi", (req, res) => {
    const { residentId, month, amount, transactionId, screenshotUrl } = req.body;
    const resident = db.residents.find(r => r.id === residentId);
    if (!resident) return res.status(404).json({ error: "Resident not found" });

    const newPayment = {
      id: `pay-${Date.now()}`,
      pgId: resident.pgId,
      residentId: resident.id,
      residentName: resident.name,
      roomNumber: resident.roomNumber,
      month: month || "July 2026",
      amountDue: amount,
      amountPaid: amount,
      discount: 0,
      lateFee: 0,
      paymentMethod: "UPI" as const,
      transactionId: transactionId || `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      upiScreenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
      paymentDate: new Date().toLocaleString('en-IN'),
      status: "PENDING_VERIFICATION" as const,
      receiptNumber: `RP-RCP-${Math.floor(1000 + Math.random() * 9000)}`
    };

    db.payments.unshift(newPayment);
    logAudit("UPI_PAYMENT_SUBMITTED", resident.name, "RESIDENT", `Uploaded UPI screenshot for ${month}`);
    res.json(newPayment);
  });

  app.post("/api/payments/:id/verify", (req, res) => {
    const { status, rejectionReason, verifiedBy } = req.body;
    const payment = db.payments.find(p => p.id === req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.status = status;
    payment.verifiedBy = verifiedBy || "Accountant";
    if (rejectionReason) payment.rejectionReason = rejectionReason;

    if (status === "APPROVED") {
      const resident = db.residents.find(r => r.id === payment.residentId);
      if (resident) {
        resident.rentStatus = "PAID";
        resident.dueAmount = 0;
      }
    }

    logAudit("PAYMENT_VERIFIED", verifiedBy || "Accountant", "ACCOUNTANT", `Status set to ${status} for ${payment.residentName}`);
    res.json(payment);
  });

  // Complaints API
  app.get("/api/complaints", (req, res) => {
    const pgId = req.query.pgId as string;
    const complaints = pgId ? db.complaints.filter(c => c.pgId === pgId) : db.complaints;
    res.json(complaints);
  });

  app.post("/api/complaints", (req, res) => {
    const newComplaint = {
      id: `cmp-${Date.now()}`,
      status: "OPEN" as const,
      createdAt: new Date().toLocaleString('en-IN'),
      updatedAt: new Date().toLocaleString('en-IN'),
      ...req.body
    };
    db.complaints.unshift(newComplaint);
    logAudit("COMPLAINT_FILED", newComplaint.residentName, "RESIDENT", `Filed complaint: ${newComplaint.title}`);
    res.status(201).json(newComplaint);
  });

  app.put("/api/complaints/:id", (req, res) => {
    const cmp = db.complaints.find(c => c.id === req.params.id);
    if (!cmp) return res.status(404).json({ error: "Complaint not found" });
    Object.assign(cmp, req.body, { updatedAt: new Date().toLocaleString('en-IN') });
    res.json(cmp);
  });

  // Visitors API
  app.get("/api/visitors", (_req, res) => {
    res.json(db.visitors);
  });

  app.post("/api/visitors", (req, res) => {
    const newVisitor = {
      id: `vis-${Date.now()}`,
      passCode: `VIS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "CHECKED_IN" as const,
      entryTime: new Date().toLocaleString('en-IN'),
      approvedByWarden: true,
      ...req.body
    };
    db.visitors.unshift(newVisitor);
    res.status(201).json(newVisitor);
  });

  // Attendance API
  app.get("/api/attendance", (_req, res) => {
    res.json(db.attendance);
  });

  app.post("/api/attendance/mark", (req, res) => {
    const { residentId, status, gatePassReason } = req.body;
    const resident = db.residents.find(r => r.id === residentId);
    if (!resident) return res.status(404).json({ error: "Resident not found" });

    const record = {
      id: `att-${Date.now()}`,
      pgId: resident.pgId,
      residentId,
      residentName: resident.name,
      roomNumber: resident.roomNumber,
      date: new Date().toISOString().split('T')[0],
      status,
      gatePassReason,
      checkInTime: status === 'PRESENT' ? new Date().toLocaleTimeString('en-IN') : undefined,
      checkOutTime: status === 'NIGHT_OUT' ? new Date().toLocaleTimeString('en-IN') : undefined
    };
    db.attendance.unshift(record);
    res.json(record);
  });

  // Food Menu API
  app.get("/api/menu", (_req, res) => {
    res.json(db.menu);
  });

  // Notices API
  app.get("/api/notices", (_req, res) => {
    res.json(db.notices);
  });

  app.post("/api/notices", (req, res) => {
    const newNotice = {
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.notices.unshift(newNotice);
    logAudit("NOTICE_PUBLISHED", newNotice.postedBy, "WARDEN", `Published notice: ${newNotice.title}`);
    res.status(201).json(newNotice);
  });

  // Laundry & Parcels
  app.get("/api/laundry", (_req, res) => res.json(db.laundry));
  app.get("/api/parcels", (_req, res) => res.json(db.parcels));
  app.get("/api/inventory", (_req, res) => res.json(db.inventory));
  app.get("/api/audit-logs", (_req, res) => res.json(db.auditLogs));

  // --- AI FEATURES API ---

  // AI Hostel Assistant Copilot
  app.post("/api/ai/chat", async (req, res) => {
    const { prompt, role, pgContext } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
      if (process.env.GEMINI_API_KEY && genAI) {
        const response = await genAI.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction: `You are the AI Hostel Copilot for "PG & Hostel Management System". Current User Role: ${role || 'RESIDENT'}.
Context: ${JSON.stringify(pgContext || { name: 'Royal Palms PG' })}.
Provide polite, highly structured, clear, actionable responses regarding hostel policies, rent payments, mess menus, complaint updates, maintenance schedules, and emergency contacts.`
          }
        });
        return res.json({ reply: response.text });
      }
    } catch (err) {
      console.error("Gemini API error in /api/ai/chat:", err);
    }

    // Fallback response if key missing or request fails
    res.json({
      reply: `[AI Hostel Assistant]: Regarding your query "${prompt}", our hostel policy specifies 24/7 power backup, gate entry until 10:30 PM, and immediate assignment of maintenance tickets via the complaint desk.`
    });
  });

  // AI Complaint Auto-Reply Generator
  app.post("/api/ai/complaint-reply", async (req, res) => {
    const { category, title, description, residentName, roomNumber } = req.body;
    try {
      if (process.env.GEMINI_API_KEY && genAI) {
        const response = await genAI.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Generate an empathetic, professional response to resident ${residentName} (Room ${roomNumber}) for a ${category} complaint titled "${title}". Description: "${description}". Specify estimated resolution timeline. Keep it under 60 words.`
        });
        return res.json({ reply: response.text });
      }
    } catch (err) {
      console.error("Gemini error in complaint reply:", err);
    }
    res.json({
      reply: `Dear ${residentName || 'Resident'}, we have received your ${category || 'maintenance'} complaint regarding "${title || 'issue'}". Our warden and technician have been dispatched to Room ${roomNumber || ''} and will resolve it within 4 hours.`
    });
  });

  // AI Notice / Broadcast Writer
  app.post("/api/ai/generate-notice", async (req, res) => {
    const { topic, tone } = req.body;
    try {
      if (process.env.GEMINI_API_KEY && genAI) {
        const response = await genAI.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Write a clear hostel notice about: "${topic}". Tone: ${tone || 'Professional & Courteous'}. Include title, key details, and warden signature.`
        });
        return res.json({ noticeText: response.text });
      }
    } catch (err) {
      console.error("Gemini notice error:", err);
    }
    res.json({
      noticeText: `📢 NOTICE: ${topic.toUpperCase()}\n\nPlease be informed that ${topic}. For queries, contact the Warden Office.`
    });
  });

  // AI Rent Reminder Generator
  app.post("/api/ai/rent-reminder", async (req, res) => {
    const { residentName, dueAmount, month } = req.body;
    try {
      if (process.env.GEMINI_API_KEY && genAI) {
        const response = await genAI.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Draft a polite SMS / WhatsApp rent reminder for resident ${residentName} who has a pending rent of ₹${dueAmount} for ${month}. Include instructions to pay via dynamic UPI QR code in the dashboard.`
        });
        return res.json({ reminderText: response.text });
      }
    } catch (err) {
      console.error("Gemini rent reminder error:", err);
    }
    res.json({
      reminderText: `Dear ${residentName}, gentle reminder that your rent of ₹${dueAmount} for ${month} is pending. Please upload your UPI screenshot on the Resident Portal to avoid late fees. Thank you!`
    });
  });

  // AI Occupancy & Revenue Insights
  app.post("/api/ai/occupancy-insights", async (req, res) => {
    try {
      if (process.env.GEMINI_API_KEY && genAI) {
        const response = await genAI.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Analyze PG hostel data: Total Beds: 54, Occupied: 46 (85% Occupancy), Monthly Revenue: ₹4,14,000, Pending Rent: ₹9,000, Open Maintenance: 2. Provide 3 executive recommendations for the PG owner to maximize occupancy and profit.`
        });
        return res.json({ insights: response.text });
      }
    } catch (err) {
      console.error("Gemini insights error:", err);
    }
    res.json({
      insights: `1. **Pricing Optimization**: Your double-sharing rooms have an 85% occupancy rate. Consider offering a 5% early payment discount for upfront semester bookings.\n2. **Vacancy Reduction**: Offer corporate referral incentives to IT employees in nearby HSR Layout hubs.\n3. **Cost Efficiency**: Solar water heater installation can reduce electricity overheads by 18% monthly.`
    });
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
