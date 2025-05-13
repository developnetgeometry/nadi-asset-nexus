
import { UserRole } from "../types";

// Define which roles can view the Performance page
export const PERFORMANCE_VIEW_ROLES: UserRole[] = [
  "TP_PIC",
  "TP_SITE",
  "MCMC_ADMIN",
  "MCMC_HR"
];

// Define roles that can only view the Asset Dashboard
export const ASSET_VIEW_ONLY_ROLES: UserRole[] = [
  "DUSP_ADMIN",
  "DUSP_OPERATION",
  "MCMC_ADMIN",
  "MCMC_OPERATION"
];

// Define roles that can manage Assets (CRUD operations)
export const ASSET_MANAGE_ROLES: UserRole[] = [
  "TP_SITE",
  "TP_ADMIN",
  "TP_OPERATION"
];

// Define roles that can view Maintenance Dockets
export const MAINTENANCE_VIEW_ROLES: UserRole[] = [
  "DUSP_ADMIN",
  "DUSP_OPERATION",
  "MCMC_ADMIN",
  "MCMC_OPERATION",
  "VENDOR_STAFF",
  "VENDOR_ADMIN"
];

// Define roles that can manage Maintenance Dockets (CRUD operations)
export const MAINTENANCE_MANAGE_ROLES: UserRole[] = [
  "TP_SITE",
  "TP_ADMIN",
  "TP_OPERATION"
];

// Helper function to check if a role can perform CRUD operations on assets
export const canManageAssets = (role: UserRole): boolean => {
  return ASSET_MANAGE_ROLES.includes(role);
};

// Helper function to check if a role can perform CRUD operations on maintenance dockets
export const canManageMaintenance = (role: UserRole): boolean => {
  return MAINTENANCE_MANAGE_ROLES.includes(role);
};
