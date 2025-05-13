
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
export type DocketStatus = 'DRAFTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CLOSED' | 'RECOMMENDED';

// SLA Category
export type SLACategory = 'CRITICAL' | 'NORMAL' | 'LOW';

// Docket Category
export type DocketCategory = 'ICT' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'OTHER';

// Asset Interface - Updated to match the image fields
export interface Asset {
  id: string;
  name: string;
  item_name: string;
  brand_id: string;
  serial_number: string;
  qty_unit: number;
  date_expired?: string;
  date_install?: string;
  date_warranty_tp?: string;
  date_warranty_supplier?: string;
  location_id: string;
  asset_mobility: 'Moveable' | 'Immovable';
  photo?: string;
  remark?: string;
  status: AssetStatus;
  category: string;
  type: string;
  model?: string;
  description?: string;
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
  location: string; // Explicitly define location property
  assetId?: string;
  assignedTo?: string;
  requestedBy: string;
  submittedBy: string;
  submittedDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  lastActionBy: string;
  lastActionDate: string;
  remarks?: string;
  attachments?: {
    before: string[];
    after: string[];
  };
  isOverdue?: boolean;
  duspRecommendation?: boolean;
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
