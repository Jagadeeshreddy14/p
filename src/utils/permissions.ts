import React from 'react';
import { UserRole } from '../types';

export type PermissionAction =
  | 'ADMIT_RESIDENT'
  | 'DELETE_RESIDENT'
  | 'EDIT_RESIDENT'
  | 'VIEW_RESIDENT_ROSTER'
  | 'APPROVE_PAYMENT'
  | 'REJECT_PAYMENT'
  | 'VIEW_FINANCIALS'
  | 'EDIT_UPI_SETTINGS'
  | 'ADD_ROOM'
  | 'DELETE_ROOM'
  | 'UPDATE_ROOM_BEDS'
  | 'FILE_COMPLAINT'
  | 'UPDATE_COMPLAINT_STATUS'
  | 'DELETE_COMPLAINT'
  | 'LOG_VISITOR'
  | 'MARK_ATTENDANCE'
  | 'APPROVE_GATE_PASS'
  | 'CREATE_NOTICE'
  | 'DELETE_NOTICE'
  | 'MANAGE_STAFF'
  | 'SUPER_ADMIN_SETTINGS';

// Permission Matrix mapping UserRole -> PermissionAction[]
export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  SUPER_ADMIN: [
    'ADMIT_RESIDENT',
    'DELETE_RESIDENT',
    'EDIT_RESIDENT',
    'VIEW_RESIDENT_ROSTER',
    'APPROVE_PAYMENT',
    'REJECT_PAYMENT',
    'VIEW_FINANCIALS',
    'EDIT_UPI_SETTINGS',
    'ADD_ROOM',
    'DELETE_ROOM',
    'UPDATE_ROOM_BEDS',
    'FILE_COMPLAINT',
    'UPDATE_COMPLAINT_STATUS',
    'DELETE_COMPLAINT',
    'LOG_VISITOR',
    'MARK_ATTENDANCE',
    'APPROVE_GATE_PASS',
    'CREATE_NOTICE',
    'DELETE_NOTICE',
    'MANAGE_STAFF',
    'SUPER_ADMIN_SETTINGS'
  ],
  PG_OWNER: [
    'ADMIT_RESIDENT',
    'DELETE_RESIDENT',
    'EDIT_RESIDENT',
    'VIEW_RESIDENT_ROSTER',
    'APPROVE_PAYMENT',
    'REJECT_PAYMENT',
    'VIEW_FINANCIALS',
    'EDIT_UPI_SETTINGS',
    'ADD_ROOM',
    'DELETE_ROOM',
    'UPDATE_ROOM_BEDS',
    'FILE_COMPLAINT',
    'UPDATE_COMPLAINT_STATUS',
    'DELETE_COMPLAINT',
    'LOG_VISITOR',
    'MARK_ATTENDANCE',
    'APPROVE_GATE_PASS',
    'CREATE_NOTICE',
    'DELETE_NOTICE',
    'MANAGE_STAFF'
  ],
  WARDEN: [
    'ADMIT_RESIDENT',
    'EDIT_RESIDENT',
    'VIEW_RESIDENT_ROSTER',
    'VIEW_FINANCIALS',
    'UPDATE_ROOM_BEDS',
    'FILE_COMPLAINT',
    'UPDATE_COMPLAINT_STATUS',
    'LOG_VISITOR',
    'MARK_ATTENDANCE',
    'APPROVE_GATE_PASS',
    'CREATE_NOTICE',
    'DELETE_NOTICE',
    'MANAGE_STAFF'
  ],
  ACCOUNTANT: [
    'VIEW_RESIDENT_ROSTER',
    'APPROVE_PAYMENT',
    'REJECT_PAYMENT',
    'VIEW_FINANCIALS',
    'EDIT_UPI_SETTINGS',
    'FILE_COMPLAINT'
  ],
  RESIDENT: [
    'FILE_COMPLAINT',
    'VIEW_FINANCIALS',
    'MARK_ATTENDANCE',
    'LOG_VISITOR'
  ],
  PARENT: [
    'VIEW_FINANCIALS',
    'VIEW_RESIDENT_ROSTER'
  ],
  MAINTENANCE_STAFF: [
    'FILE_COMPLAINT',
    'UPDATE_COMPLAINT_STATUS'
  ],
  RECEPTIONIST: [
    'VIEW_RESIDENT_ROSTER',
    'LOG_VISITOR',
    'MARK_ATTENDANCE'
  ]
};

// Endpoint Permission Matrix
export interface EndpointRule {
  method: string; // GET, POST, PUT, DELETE
  pattern: RegExp;
  allowedRoles: UserRole[];
  actionName: PermissionAction;
}

export const API_ENDPOINT_PERMISSIONS: EndpointRule[] = [
  {
    method: 'DELETE',
    pattern: /^\/api\/residents\/[^/]+$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER'],
    actionName: 'DELETE_RESIDENT'
  },
  {
    method: 'POST',
    pattern: /^\/api\/residents\/admit$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN'],
    actionName: 'ADMIT_RESIDENT'
  },
  {
    method: 'POST',
    pattern: /^\/api\/payments\/[^/]+\/verify$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'ACCOUNTANT'],
    actionName: 'APPROVE_PAYMENT'
  },
  {
    method: 'POST',
    pattern: /^\/api\/upi-settings$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'ACCOUNTANT'],
    actionName: 'EDIT_UPI_SETTINGS'
  },
  {
    method: 'POST',
    pattern: /^\/api\/rooms$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER'],
    actionName: 'ADD_ROOM'
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/rooms\/[^/]+$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER'],
    actionName: 'DELETE_ROOM'
  },
  {
    method: 'POST',
    pattern: /^\/api\/notices$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN'],
    actionName: 'CREATE_NOTICE'
  },
  {
    method: 'PUT',
    pattern: /^\/api\/complaints\/[^/]+$/,
    allowedRoles: ['SUPER_ADMIN', 'PG_OWNER', 'WARDEN', 'MAINTENANCE_STAFF'],
    actionName: 'UPDATE_COMPLAINT_STATUS'
  }
];

/**
 * Checks whether a given role is granted authorization for an action
 */
export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  if (!role) return false;
  const allowedActions = ROLE_PERMISSIONS[role] || [];
  return allowedActions.includes(action);
}

/**
 * Server-side endpoint authorization checker
 */
export function canAccessEndpoint(role: UserRole, method: string, path: string): { authorized: boolean; requiredAction?: PermissionAction; allowedRoles?: UserRole[] } {
  const upperMethod = method.toUpperCase();
  const rule = API_ENDPOINT_PERMISSIONS.find(
    (r) => r.method === upperMethod && r.pattern.test(path)
  );

  if (!rule) {
    // Default open if endpoint is not strictly restricted
    return { authorized: true };
  }

  const authorized = rule.allowedRoles.includes(role);
  return {
    authorized,
    requiredAction: rule.actionName,
    allowedRoles: rule.allowedRoles
  };
}

/**
 * Returns descriptive access badge metadata for UI display
 */
export function getRoleAccessLevel(role: UserRole): {
  label: string;
  badgeBg: string;
  badgeText: string;
  scope: string;
} {
  switch (role) {
    case 'SUPER_ADMIN':
      return {
        label: 'Super Admin (Unrestricted)',
        badgeBg: 'bg-purple-100 dark:bg-purple-950',
        badgeText: 'text-purple-800 dark:text-purple-300',
        scope: 'Full System Control & Audit Logs'
      };
    case 'PG_OWNER':
      return {
        label: 'PG Owner / Executive',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-950',
        badgeText: 'text-indigo-800 dark:text-indigo-300',
        scope: 'Full Operational & Financial Management'
      };
    case 'ACCOUNTANT':
      return {
        label: 'Accountant',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
        badgeText: 'text-emerald-800 dark:text-emerald-300',
        scope: 'Financial Receipts, UPI Settings & Audits'
      };
    case 'WARDEN':
      return {
        label: 'Hostel Warden',
        badgeBg: 'bg-amber-100 dark:bg-amber-950',
        badgeText: 'text-amber-800 dark:text-amber-300',
        scope: 'Resident Roster, Complaints & Gate Passes'
      };
    case 'RESIDENT':
      return {
        label: 'PG Resident',
        badgeBg: 'bg-sky-100 dark:bg-sky-950',
        badgeText: 'text-sky-800 dark:text-sky-300',
        scope: 'Personal Dashboard & Service Tickets'
      };
    case 'PARENT':
      return {
        label: 'Parent / Guardian',
        badgeBg: 'bg-pink-100 dark:bg-pink-950',
        badgeText: 'text-pink-800 dark:text-pink-300',
        scope: 'Read-Only Attendance & Fee Portal'
      };
    case 'MAINTENANCE_STAFF':
      return {
        label: 'Maintenance Tech',
        badgeBg: 'bg-slate-100 dark:bg-slate-800',
        badgeText: 'text-slate-800 dark:text-slate-200',
        scope: 'Complaint Resolution & Status Workbench'
      };
    case 'RECEPTIONIST':
      return {
        label: 'Front Desk Reception',
        badgeBg: 'bg-cyan-100 dark:bg-cyan-950',
        badgeText: 'text-cyan-800 dark:text-cyan-300',
        scope: 'Visitor Desk & Gate Operations'
      };
    default:
      return {
        label: 'Guest Access',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-600',
        scope: 'Restricted Preview'
      };
  }
}

/**
 * Declarative React Component Guard to conditionally render sensitive UI controls
 */
export interface PermissionGuardProps {
  role: UserRole;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  role,
  action,
  children,
  fallback = null
}) => {
  if (hasPermission(role, action)) {
    return React.createElement(React.Fragment, null, children);
  }
  return React.createElement(React.Fragment, null, fallback);
};
