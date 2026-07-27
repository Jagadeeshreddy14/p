import {
  PG,
  Building,
  Room,
  Bed,
  Resident,
  Parent,
  Staff,
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
  Notification,
  User
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-superadmin',
    name: 'Vikramaditya Sharma',
    email: 'superadmin@pghub.com',
    role: 'SUPER_ADMIN',
    phone: '+91 98765 00001',
    status: 'ACTIVE',
    joinedDate: '2025-01-10',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-owner-1',
    name: 'Rajesh Kumar Agarwal',
    email: 'rajesh@royalpalms.com',
    role: 'PG_OWNER',
    phone: '+91 98765 12345',
    pgId: 'pg-1',
    status: 'ACTIVE',
    joinedDate: '2025-02-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-warden-1',
    name: 'Ramesh Sundaram',
    email: 'warden.ramesh@royalpalms.com',
    role: 'WARDEN',
    phone: '+91 98111 22233',
    pgId: 'pg-1',
    buildingId: 'b-1',
    status: 'ACTIVE',
    joinedDate: '2025-03-15',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-receptionist-1',
    name: 'Priya Verma',
    email: 'reception@royalpalms.com',
    role: 'RECEPTIONIST',
    phone: '+91 98222 33344',
    pgId: 'pg-1',
    status: 'ACTIVE',
    joinedDate: '2025-04-01',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-accountant-1',
    name: 'Suresh Patel',
    email: 'accounts@royalpalms.com',
    role: 'ACCOUNTANT',
    phone: '+91 98333 44455',
    pgId: 'pg-1',
    status: 'ACTIVE',
    joinedDate: '2025-04-10',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-resident-1',
    name: 'Aarav Mehta',
    email: 'aarav.m@gmail.com',
    role: 'RESIDENT',
    phone: '+91 99887 76655',
    pgId: 'pg-1',
    buildingId: 'b-1',
    roomNumber: '101',
    bedNumber: '101-A',
    parentId: 'u-parent-1',
    status: 'ACTIVE',
    joinedDate: '2025-05-01',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    digitalIdUrl: 'DIGITAL_ID_AARAV_2026'
  },
  {
    id: 'u-resident-2',
    name: 'Rohan Sharma',
    email: 'rohan.s@gmail.com',
    role: 'RESIDENT',
    phone: '+91 99887 11223',
    pgId: 'pg-1',
    buildingId: 'b-1',
    roomNumber: '101',
    bedNumber: '101-B',
    status: 'ACTIVE',
    joinedDate: '2025-05-10',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-parent-1',
    name: 'Mahesh Mehta',
    email: 'mahesh.mehta@yahoo.com',
    role: 'PARENT',
    phone: '+91 98777 66554',
    pgId: 'pg-1',
    residentId: 'u-resident-1',
    status: 'ACTIVE',
    joinedDate: '2025-05-01',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-maint-1',
    name: 'Ganesh Technician',
    email: 'ganesh.service@royalpalms.com',
    role: 'MAINTENANCE_STAFF',
    phone: '+91 98444 55566',
    pgId: 'pg-1',
    status: 'ACTIVE',
    joinedDate: '2025-03-20',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PGS: PG[] = [
  {
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
    facilities: ['High-Speed WiFi', '3-Time Meals', 'Daily Housekeeping', 'AC Rooms', 'Attached Bath', 'Power Backup', 'CCTV Security', 'Laundry & Ironing', 'Biometric Gate Access'],
    rules: ['Gate closes strictly at 10:30 PM', 'No guests inside bedrooms post 8 PM', 'Alcohol and smoking strictly prohibited', 'Mess timings: Breakfast 7:30-9:30, Dinner 8:00-10:00'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'VERIFIED',
    subscriptionPlan: 'ENTERPRISE'
  },
  {
    id: 'pg-2',
    name: 'Starlight Luxury Girls Hostel',
    code: 'SL-BLR-02',
    address: '#18, 5th Cross, Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    ownerId: 'u-owner-1',
    ownerName: 'Rajesh Kumar Agarwal',
    contactEmail: 'starlight@hostels.com',
    contactPhone: '+91 98765 99887',
    upiId: 'starlightpg@okicici',
    totalBuildings: 1,
    totalRooms: 16,
    totalBeds: 32,
    occupiedBeds: 28,
    monthlyRevenue: 280000,
    rating: 4.9,
    facilities: ['24/7 Female Security Guard', 'Organic Meals', 'Gym & Yoga Area', 'AC Rooms', 'Study Lounge', 'Full Power Backup'],
    rules: ['In-time 10:00 PM', 'Night-out requires digital warden approval from parent'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'VERIFIED',
    subscriptionPlan: 'PRO'
  }
];

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'b-1',
    pgId: 'pg-1',
    name: 'Tower A - Executive Block',
    code: 'TWR-A',
    totalFloors: 3,
    wardenName: 'Ramesh Sundaram'
  },
  {
    id: 'b-2',
    pgId: 'pg-1',
    name: 'Tower B - Premium Block',
    code: 'TWR-B',
    totalFloors: 3,
    wardenName: 'Siddharth Rao'
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'rm-101',
    pgId: 'pg-1',
    buildingId: 'b-1',
    buildingName: 'Tower A - Executive Block',
    floorId: 'fl-1',
    floorNumber: 1,
    roomNumber: '101',
    roomType: 'DOUBLE_SHARING',
    sharingCapacity: 2,
    rentPerBed: 9000,
    securityDeposit: 15000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: true,
    totalBeds: 2,
    occupiedBeds: 2,
    status: 'OCCUPIED',
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'rm-102',
    pgId: 'pg-1',
    buildingId: 'b-1',
    buildingName: 'Tower A - Executive Block',
    floorId: 'fl-1',
    floorNumber: 1,
    roomNumber: '102',
    roomType: 'DOUBLE_SHARING',
    sharingCapacity: 2,
    rentPerBed: 8500,
    securityDeposit: 15000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: false,
    totalBeds: 2,
    occupiedBeds: 1,
    status: 'AVAILABLE',
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'rm-103',
    pgId: 'pg-1',
    buildingId: 'b-1',
    buildingName: 'Tower A - Executive Block',
    floorId: 'fl-1',
    floorNumber: 1,
    roomNumber: '103',
    roomType: 'SINGLE',
    sharingCapacity: 1,
    rentPerBed: 14000,
    securityDeposit: 25000,
    isAC: true,
    hasAttachedBathroom: true,
    hasBalcony: true,
    totalBeds: 1,
    occupiedBeds: 0,
    status: 'AVAILABLE',
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80']
  },
  {
    id: 'rm-201',
    pgId: 'pg-1',
    buildingId: 'b-1',
    buildingName: 'Tower A - Executive Block',
    floorId: 'fl-2',
    floorNumber: 2,
    roomNumber: '201',
    roomType: 'TRIPLE_SHARING',
    sharingCapacity: 3,
    rentPerBed: 7500,
    securityDeposit: 12000,
    isAC: false,
    hasAttachedBathroom: true,
    hasBalcony: true,
    totalBeds: 3,
    occupiedBeds: 3,
    status: 'OCCUPIED',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80']
  }
];

export const INITIAL_BEDS: Bed[] = [
  { id: 'bed-101A', roomId: 'rm-101', roomNumber: '101', bedCode: '101-A', residentId: 'u-resident-1', residentName: 'Aarav Mehta', residentPhone: '+91 99887 76655', status: 'OCCUPIED', rentAmount: 9000 },
  { id: 'bed-101B', roomId: 'rm-101', roomNumber: '101', bedCode: '101-B', residentId: 'u-resident-2', residentName: 'Rohan Sharma', residentPhone: '+91 99887 11223', status: 'OCCUPIED', rentAmount: 9000 },
  { id: 'bed-102A', roomId: 'rm-102', roomNumber: '102', bedCode: '102-A', residentId: 'u-resident-3', residentName: 'Vikram Singh', residentPhone: '+91 99112 23344', status: 'OCCUPIED', rentAmount: 8500 },
  { id: 'bed-102B', roomId: 'rm-102', roomNumber: '102', bedCode: '102-B', status: 'VACANT', rentAmount: 8500 },
  { id: 'bed-103A', roomId: 'rm-103', roomNumber: '103', bedCode: '103-A', status: 'VACANT', rentAmount: 14000 }
];

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res-1',
    userId: 'u-resident-1',
    name: 'Aarav Mehta',
    email: 'aarav.m@gmail.com',
    phone: '+91 99887 76655',
    pgId: 'pg-1',
    pgName: 'Royal Palms Executive PG',
    buildingName: 'Tower A - Executive Block',
    roomNumber: '101',
    bedCode: '101-A',
    checkInDate: '2025-05-01',
    aadhaarNumber: '4829 1029 8831',
    aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    collegeOrCompany: 'Infosys Ltd (Software Engineer)',
    collegeIdDocUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80',
    passportPhotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    parentName: 'Mahesh Mehta',
    parentPhone: '+91 98777 66554',
    parentEmail: 'mahesh.mehta@yahoo.com',
    emergencyContact: '+91 98777 66554',
    bloodGroup: 'O+ Positive',
    rentStatus: 'PAID',
    dueAmount: 0,
    monthlyRent: 9000,
    securityDepositPaid: 15000,
    status: 'ACTIVE'
  },
  {
    id: 'res-2',
    userId: 'u-resident-2',
    name: 'Rohan Sharma',
    email: 'rohan.s@gmail.com',
    phone: '+91 99887 11223',
    pgId: 'pg-1',
    pgName: 'Royal Palms Executive PG',
    buildingName: 'Tower A - Executive Block',
    roomNumber: '101',
    bedCode: '101-B',
    checkInDate: '2025-05-10',
    aadhaarNumber: '9921 4451 1002',
    collegeOrCompany: 'PES University (CSE Dept)',
    parentName: 'Sanjay Sharma',
    parentPhone: '+91 98111 55443',
    parentEmail: 'sanjay.sharma@gmail.com',
    emergencyContact: '+91 98111 55443',
    bloodGroup: 'B+ Positive',
    rentStatus: 'DUE',
    dueAmount: 9000,
    monthlyRent: 9000,
    securityDepositPaid: 15000,
    status: 'ACTIVE'
  }
];

export const INITIAL_RENT_PAYMENTS: RentPayment[] = [
  {
    id: 'pay-2026-07-01',
    pgId: 'pg-1',
    residentId: 'res-1',
    residentName: 'Aarav Mehta',
    roomNumber: '101',
    month: 'July 2026',
    amountDue: 9000,
    amountPaid: 9000,
    discount: 0,
    lateFee: 0,
    paymentMethod: 'UPI',
    transactionId: 'UPI/619283741029',
    upiScreenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
    paymentDate: '2026-07-03 10:15 AM',
    status: 'APPROVED',
    verifiedBy: 'Suresh Patel (Accountant)',
    receiptNumber: 'RP-RCP-2026-0701'
  },
  {
    id: 'pay-2026-07-02',
    pgId: 'pg-1',
    residentId: 'res-2',
    residentName: 'Rohan Sharma',
    roomNumber: '101',
    month: 'July 2026',
    amountDue: 9000,
    amountPaid: 0,
    discount: 0,
    lateFee: 200,
    paymentMethod: 'UPI',
    status: 'DUE',
    receiptNumber: 'RP-RCP-PENDING-02'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-101',
    pgId: 'pg-1',
    residentId: 'res-1',
    residentName: 'Aarav Mehta',
    roomNumber: '101',
    category: 'ELECTRICAL',
    title: 'AC cooling issue in Room 101',
    description: 'The AC unit is blowing normal air instead of cooling despite temperature set to 18C. Kindly inspect.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedStaffName: 'Ganesh Technician',
    createdAt: '2026-07-25 04:30 PM',
    updatedAt: '2026-07-26 09:00 AM',
    aiSuggestedReply: 'Hello Aarav, we have logged your AC cooling ticket and assigned Technician Ganesh. He will visit Room 101 today by 2:00 PM for gas check.'
  },
  {
    id: 'cmp-102',
    pgId: 'pg-1',
    residentId: 'res-2',
    residentName: 'Rohan Sharma',
    roomNumber: '101',
    category: 'WIFI',
    title: 'Slow WiFi speed on 2nd floor',
    description: 'Frequent latency spikes during work calls on 5GHz Wi-Fi band.',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: '2026-07-26 08:15 AM',
    updatedAt: '2026-07-26 08:15 AM'
  }
];

export const INITIAL_VISITORS: Visitor[] = [
  {
    id: 'vis-1',
    pgId: 'pg-1',
    residentId: 'res-1',
    residentName: 'Aarav Mehta',
    roomNumber: '101',
    visitorName: 'Karan Mehta (Brother)',
    visitorPhone: '+91 98888 12345',
    relation: 'BROTHER',
    purpose: 'Delivering home documents and food parcel',
    entryTime: '2026-07-26 05:00 PM',
    passCode: 'VIS-9921',
    status: 'CHECKED_IN',
    approvedByWarden: true
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: 'att-1',
    pgId: 'pg-1',
    residentId: 'res-1',
    residentName: 'Aarav Mehta',
    roomNumber: '101',
    date: '2026-07-26',
    status: 'PRESENT',
    checkInTime: '2026-07-26 09:12 PM'
  },
  {
    id: 'att-2',
    pgId: 'pg-1',
    residentId: 'res-2',
    residentName: 'Rohan Sharma',
    roomNumber: '101',
    date: '2026-07-26',
    status: 'NIGHT_OUT',
    gatePassReason: 'Weekend family visit to Mysore',
    checkOutTime: '2026-07-25 06:00 PM'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    pgId: 'pg-1',
    title: '⚡ Scheduled Power Maintenance & Generator Switchover',
    content: 'BESCOM power maintenance scheduled for Sunday (July 28th) between 10 AM to 2 PM. Main elevator and water pumps will run seamlessly on backup generator power.',
    category: 'MAINTENANCE',
    targetAudience: 'ALL',
    postedBy: 'Ramesh Sundaram (Warden)',
    date: '2026-07-25',
    isImportant: true
  },
  {
    id: 'not-2',
    pgId: 'pg-1',
    title: '🍲 Special Sunday Feast & Mess Menu Update',
    content: 'Special Paneer Butter Masala, Butter Naan, and Gulab Jamun will be served for Sunday Dinner in Mess Hall B.',
    category: 'GENERAL',
    targetAudience: 'RESIDENTS',
    postedBy: 'Chef Kumar',
    date: '2026-07-24',
    isImportant: false
  }
];

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'menu-mon',
    pgId: 'pg-1',
    dayOfWeek: 'MONDAY',
    breakfast: 'Idli, Medu Vada, Sambar & Coconut Chutney',
    lunch: 'North Indian Thali: Chole Masala, Roti, Rice, Dal Fry & Curd',
    snacks: 'Samosa & Masala Chai',
    dinner: 'Aloo Gobi, Phulka Roti, Jeera Rice, Rasam & Kheer',
    ratingAverage: 4.6
  },
  {
    id: 'menu-tue',
    pgId: 'pg-1',
    dayOfWeek: 'TUESDAY',
    breakfast: 'Puri Bhaji & Masala Dosa',
    lunch: 'Rajma Chawal, Chapati, Mixed Veg & Fruit Salad',
    snacks: 'Bread Pakora & Coffee',
    dinner: 'Kadai Paneer, Butter Roti, Veg Biryani & Cucumber Raita',
    ratingAverage: 4.8
  },
  {
    id: 'menu-wed',
    pgId: 'pg-1',
    dayOfWeek: 'WEDNESDAY',
    breakfast: 'Poha with Peanuts, Sev & Uttapam',
    lunch: 'South Indian Meals: Veg Kurma, Chapati, Sambar, Rasam & Payasam',
    snacks: 'Mirchi Bajji & Tea',
    dinner: 'Egg Curry / Paneer Bhurji, Roti, Ghee Rice & Custard',
    ratingAverage: 4.5
  },
  {
    id: 'menu-thu',
    pgId: 'pg-1',
    dayOfWeek: 'THURSDAY',
    breakfast: 'Aloo Paratha with White Butter & Curd',
    lunch: 'Dal Makhani, Jeera Rice, Missi Roti & Boondi Raita',
    snacks: 'Bhel Puri & Lemon Tea',
    dinner: 'Veg Kolhapuri, Chapati, Steamed Rice & Gulab Jamun',
    ratingAverage: 4.7
  },
  {
    id: 'menu-fri',
    pgId: 'pg-1',
    dayOfWeek: 'FRIDAY',
    breakfast: 'Set Dosa, Vegetable Upma & Filter Coffee',
    lunch: 'Hyderabadi Veg Biryani / Chicken Curry, Mirchi Ka Salan',
    snacks: 'Pav Bhaji',
    dinner: 'Dal Tadka, Roti, Curd Rice & Ice Cream',
    ratingAverage: 4.9
  },
  {
    id: 'menu-sat',
    pgId: 'pg-1',
    dayOfWeek: 'SATURDAY',
    breakfast: 'Rava Dosa, Potato Sagoo & Chutney',
    lunch: 'Gujarati Thali: Sev Tamatar, Bhakri, Khichdi & Kadhi',
    snacks: 'Dry Fruit Biscuits & Tea',
    dinner: 'Chana Masala, Bhature & Moong Dal Halwa',
    ratingAverage: 4.6
  },
  {
    id: 'menu-sun',
    pgId: 'pg-1',
    dayOfWeek: 'SUNDAY',
    breakfast: 'Chole Bhature & Sweet Lassi',
    lunch: 'Special Dum Biryani, Salan & Ice Cream',
    snacks: 'Veg Cutlet & Cold Coffee',
    dinner: 'Paneer Butter Masala, Butter Naan, Veg Pulao & Rasgulla',
    ratingAverage: 5.0
  }
];

export const INITIAL_LAUNDRY: LaundryRequest[] = [
  {
    id: 'ld-1',
    pgId: 'pg-1',
    residentId: 'res-1',
    residentName: 'Aarav Mehta',
    roomNumber: '101',
    itemCount: 8,
    clothTypes: '4 Shirts, 3 Jeans, 1 Bed Sheet',
    pickupDate: '2026-07-25',
    expectedDelivery: '2026-07-27',
    status: 'READY',
    weightKg: 3.5
  }
];

export const INITIAL_PARCELS: ParcelItem[] = [
  {
    id: 'pcl-1',
    pgId: 'pg-1',
    residentId: 'res-1',
    residentName: 'Aarav Mehta',
    roomNumber: '101',
    courierCompany: 'Amazon Logistics',
    trackingNumber: 'TBA91028374109',
    receivedDate: '2026-07-26 02:15 PM',
    otp: '4928',
    status: 'RECEIVED'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    pgId: 'pg-1',
    itemName: 'Godrej AC Units (1.5 Ton Split)',
    category: 'APPLIANCE',
    totalQuantity: 24,
    inUseQuantity: 22,
    inStockQuantity: 2,
    damagedQuantity: 0,
    unitCost: 32000,
    lastRestockedDate: '2025-01-15'
  },
  {
    id: 'inv-2',
    pgId: 'pg-1',
    itemName: 'Orthopedic Sleepwell Mattresses',
    category: 'BEDDING',
    totalQuantity: 60,
    inUseQuantity: 54,
    inStockQuantity: 5,
    damagedQuantity: 1,
    unitCost: 4500,
    lastRestockedDate: '2025-03-10'
  },
  {
    id: 'inv-3',
    pgId: 'pg-1',
    itemName: 'Ergonomic Wooden Study Desks',
    category: 'FURNITURE',
    totalQuantity: 54,
    inUseQuantity: 50,
    inStockQuantity: 4,
    damagedQuantity: 0,
    unitCost: 3800,
    lastRestockedDate: '2025-02-01'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'st-1',
    userId: 'u-warden-1',
    name: 'Ramesh Sundaram',
    email: 'warden.ramesh@royalpalms.com',
    phone: '+91 98111 22233',
    role: 'WARDEN',
    pgId: 'pg-1',
    shift: 'MORNING',
    salary: 28000,
    joiningDate: '2025-03-15',
    status: 'ACTIVE'
  },
  {
    id: 'st-2',
    userId: 'u-maint-1',
    name: 'Ganesh Technician',
    email: 'ganesh.service@royalpalms.com',
    phone: '+91 98444 55566',
    role: 'MAINTENANCE_STAFF',
    pgId: 'pg-1',
    shift: 'ROTATING',
    salary: 22000,
    joiningDate: '2025-03-20',
    status: 'ACTIVE'
  },
  {
    id: 'st-3',
    userId: 'u-accountant-1',
    name: 'Suresh Patel',
    email: 'accounts@royalpalms.com',
    phone: '+91 98333 44455',
    role: 'ACCOUNTANT',
    pgId: 'pg-1',
    shift: 'MORNING',
    salary: 30000,
    joiningDate: '2025-04-10',
    status: 'ACTIVE'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'RENT_PAYMENT_VERIFIED',
    performedBy: 'Suresh Patel (Accountant)',
    role: 'ACCOUNTANT',
    details: 'Verified UPI payment ₹9,000 for Aarav Mehta (Room 101 - July 2026)',
    timestamp: '2026-07-26 10:30 AM',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-2',
    action: 'COMPLAINT_ASSIGNED',
    performedBy: 'Ramesh Sundaram (Warden)',
    role: 'WARDEN',
    details: 'Assigned AC complaint cmp-101 to Ganesh Technician',
    timestamp: '2026-07-26 09:00 AM',
    ipAddress: '192.168.1.12'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'u-accountant-1',
    targetRoles: ['ACCOUNTANT', 'PG_OWNER', 'SUPER_ADMIN'],
    title: '💳 UPI Payment Pending Verification',
    message: 'Aarav Mehta (Room 101) uploaded payment screenshot for July 2026 rent (₹9,000).',
    type: 'RENT',
    priority: 'MEDIUM',
    read: false,
    createdAt: '10 mins ago'
  },
  {
    id: 'notif-2',
    userId: 'u-warden-1',
    targetRoles: ['WARDEN', 'PG_OWNER', 'SUPER_ADMIN', 'MAINTENANCE_STAFF'],
    title: '🚨 Urgent Maintenance Alert',
    message: 'Urgent: Room 101 filed an AC cooling & water leakage request.',
    type: 'COMPLAINT',
    priority: 'URGENT',
    read: false,
    createdAt: '25 mins ago'
  },
  {
    id: 'notif-3',
    userId: 'u-res-1',
    targetRoles: ['RESIDENT', 'PARENT', 'WARDEN'],
    title: '📢 Official Notice: Monthly Pest Control',
    message: 'Routine pest control scheduled for Block A rooms tomorrow between 10 AM - 1 PM.',
    type: 'NOTICE',
    priority: 'LOW',
    read: false,
    createdAt: '2 hours ago'
  }
];
