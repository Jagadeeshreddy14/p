export type UserRole =
  | 'SUPER_ADMIN'
  | 'PG_OWNER'
  | 'WARDEN'
  | 'RECEPTIONIST'
  | 'ACCOUNTANT'
  | 'RESIDENT'
  | 'PARENT'
  | 'MAINTENANCE_STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone: string;
  pgId?: string; // Associated PG if applicable
  buildingId?: string;
  roomNumber?: string;
  bedNumber?: string;
  parentId?: string; // For resident
  residentId?: string; // For parent
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';
  joinedDate: string;
  digitalIdUrl?: string;
}

export interface PG {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ownerId: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  upiId: string;
  totalBuildings: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  monthlyRevenue: number;
  rating: number;
  facilities: string[];
  rules: string[];
  images: string[];
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  subscriptionPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
}

export interface Building {
  id: string;
  pgId: string;
  name: string;
  code: string;
  totalFloors: number;
  wardenName?: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  name: string;
  totalRooms: number;
}

export type RoomType = 'SINGLE' | 'DOUBLE_SHARING' | 'TRIPLE_SHARING' | 'FOUR_SHARING';

export interface Room {
  id: string;
  pgId: string;
  buildingId: string;
  buildingName: string;
  floorId: string;
  floorNumber: number;
  roomNumber: string;
  roomType: RoomType;
  sharingCapacity: number;
  rentPerBed: number;
  securityDeposit: number;
  isAC: boolean;
  hasAttachedBathroom: boolean;
  hasBalcony: boolean;
  totalBeds: number;
  occupiedBeds: number;
  status: 'CLEAN' | 'MAINTENANCE' | 'OCCUPIED' | 'AVAILABLE';
  images: string[];
}

export interface Bed {
  id: string;
  roomId: string;
  roomNumber: string;
  bedCode: string; // e.g. "101-A"
  residentId?: string;
  residentName?: string;
  residentPhone?: string;
  status: 'VACANT' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  rentAmount: number;
}

export interface Resident {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  pgId: string;
  pgName: string;
  buildingName: string;
  roomNumber: string;
  bedCode: string;
  checkInDate: string;
  checkOutDate?: string;
  aadhaarNumber: string;
  aadhaarDocUrl?: string;
  collegeOrCompany: string;
  collegeIdDocUrl?: string;
  passportPhotoUrl?: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  emergencyContact: string;
  bloodGroup: string;
  rentStatus: 'PAID' | 'DUE' | 'OVERDUE' | 'PARTIAL';
  dueAmount: number;
  monthlyRent: number;
  securityDepositPaid: number;
  status: 'ACTIVE' | 'NOTICE_PERIOD' | 'CHECKED_OUT';
}

export interface Parent {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  residentId: string;
  residentName: string;
  relation: 'FATHER' | 'MOTHER' | 'GUARDIAN';
}

export interface Staff {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: 'WARDEN' | 'RECEPTIONIST' | 'ACCOUNTANT' | 'MAINTENANCE_STAFF' | 'COOK' | 'CLEANER';
  pgId: string;
  shift: 'MORNING' | 'EVENING' | 'NIGHT' | 'ROTATING';
  salary: number;
  joiningDate: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

export interface Visitor {
  id: string;
  pgId: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  visitorName: string;
  visitorPhone: string;
  relation: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  passCode: string;
  status: 'EXPECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'REJECTED';
  approvedByWarden: boolean;
}

export interface Attendance {
  id: string;
  pgId: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'NIGHT_OUT' | 'ON_LEAVE';
  gatePassReason?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface RentPayment {
  id: string;
  pgId: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  month: string; // e.g. "July 2026"
  amountDue: number;
  amountPaid: number;
  discount: number;
  lateFee: number;
  paymentMethod: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  transactionId?: string;
  upiScreenshotUrl?: string;
  paymentDate?: string;
  status: 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED' | 'DUE';
  verifiedBy?: string;
  rejectionReason?: string;
  receiptNumber: string;
}

export interface Complaint {
  id: string;
  pgId: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  category: 'ELECTRICAL' | 'PLUMBING' | 'CLEANING' | 'FOOD' | 'WIFI' | 'SECURITY' | 'OTHER';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  assignedStaffName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  aiSuggestedReply?: string;
}

export interface MaintenanceRequest {
  id: string;
  pgId: string;
  title: string;
  category: string;
  location: string; // Room number or common area
  description: string;
  costEstimate: number;
  actualCost?: number;
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  requestedDate: string;
  completedDate?: string;
}

export interface InventoryItem {
  id: string;
  pgId: string;
  itemName: string;
  category: 'FURNITURE' | 'APPLIANCE' | 'BEDDING' | 'KITCHEN' | 'CLEANING' | 'ELECTRONICS';
  totalQuantity: number;
  inUseQuantity: number;
  inStockQuantity: number;
  damagedQuantity: number;
  unitCost: number;
  lastRestockedDate: string;
}

export interface Notice {
  id: string;
  pgId: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'RENT' | 'MAINTENANCE' | 'EVENT' | 'EMERGENCY';
  targetAudience: 'ALL' | 'RESIDENTS' | 'STAFF' | 'PARENTS';
  postedBy: string;
  date: string;
  attachmentUrl?: string;
  isImportant: boolean;
}

export interface MenuItem {
  id: string;
  pgId: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  specialNote?: string;
  ratingAverage: number;
}

export interface LaundryRequest {
  id: string;
  pgId: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  itemCount: number;
  clothTypes: string;
  pickupDate: string;
  expectedDelivery: string;
  status: 'REQUESTED' | 'PICKED_UP' | 'WASHING' | 'READY' | 'DELIVERED';
  weightKg?: number;
}

export interface ParcelItem {
  id: string;
  pgId: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  courierCompany: string;
  trackingNumber: string;
  receivedDate: string;
  otp: string;
  status: 'RECEIVED' | 'DELIVERED';
  deliveredAt?: string;
}

export interface Notification {
  id: string;
  userId?: string;
  targetRoles?: (UserRole | 'ALL')[];
  title: string;
  message: string;
  type: 'RENT' | 'COMPLAINT' | 'NOTICE' | 'VISITOR' | 'SYSTEM' | 'PARCEL' | 'ATTENDANCE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  message: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface SubscriptionPlan {
  id: string;
  name: 'BASIC' | 'PRO' | 'ENTERPRISE';
  priceMonthly: number;
  maxPGs: number;
  maxResidents: number;
  features: string[];
}
