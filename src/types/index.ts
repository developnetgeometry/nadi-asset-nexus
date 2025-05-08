
// User Roles
export type UserRole = 
  | 'TP_ADMIN'
  | 'TP_OPERATION'
  | 'TP_PIC'
  | 'TP_SITE'
  | 'DUSP_ADMIN'
  | 'DUSP_MANAGEMENT'
  | 'DUSP_OPERATION'
  | 'MCMC_ADMIN'
  | 'MCMC_OPERATION'
  | 'VENDOR_ADMIN'
  | 'VENDOR_STAFF';

export const userRoleLabels: Record<UserRole, string> = {
  TP_ADMIN: 'TP Admin',
  TP_OPERATION: 'TP Operation',
  TP_PIC: 'TP PIC',
  TP_SITE: 'TP Site',
  DUSP_ADMIN: 'DUSP Admin',
  DUSP_MANAGEMENT: 'DUSP Management',
  DUSP_OPERATION: 'DUSP Operation',
  MCMC_ADMIN: 'MCMC Admin',
  MCMC_OPERATION: 'MCMC Operation',
  VENDOR_ADMIN: 'Vendor Admin',
  VENDOR_STAFF: 'Vendor Staff',
};

// Asset Status
export type AssetStatus = 'ACTIVE' | 'UNDER_REPAIR' | 'RETIRED';

// Maintenance Types
export type MaintenanceType = 'COMPREHENSIVE' | 'PREVENTIVE_SCHEDULED' | 'PREVENTIVE_UNSCHEDULED';

// Docket Status
export type DocketStatus = 'DRAFTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CLOSED';

// SLA Category
export type SLACategory = 'CRITICAL' | 'NORMAL' | 'LOW';

// Docket Category
export type DocketCategory = 'ICT' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'OTHER';

// Asset Interface
export interface Asset {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: string;
  model?: string;
  serialNumber: string;
  status: AssetStatus;
  location: string;
  assignedTo?: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: string;
  updatedAt: string;
}

// Maintenance Docket Interface
export interface MaintenanceDocket {
  id: string;
  docketNo: string;
  title: string;
  description: string;
  type: MaintenanceType;
  category: DocketCategory;
  slaCategory: SLACategory;
  status: DocketStatus;
  assetId?: string;
  assignedTo?: string;
  requestedBy: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  lastActionBy: string;
  lastActionDate: string;
  createdAt: string;
  updatedAt: string;
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  department?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
