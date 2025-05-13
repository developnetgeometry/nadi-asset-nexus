
import { UserRole } from "../types";

// Define which roles can view the Performance page
export const PERFORMANCE_VIEW_ROLES: UserRole[] = [
  "TP_PIC",
  "TP_SITE",
  "MCMC_ADMIN",
  "MCMC_HR",
  "SUPER_ADMIN"  // Added SUPER_ADMIN
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
  "TP_OPERATION",
  "SUPER_ADMIN"  // Added SUPER_ADMIN
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
  "TP_OPERATION",
  "SUPER_ADMIN"  // Added SUPER_ADMIN
];

// Define roles that can access settings page
export const SETTINGS_ACCESS_ROLES: UserRole[] = [
  "SUPER_ADMIN"  // Only SUPER_ADMIN can access settings
];

// Define roles that can access asset settings
export const ASSET_SETTINGS_ACCESS_ROLES: UserRole[] = [
  "SUPER_ADMIN"  // Only SUPER_ADMIN can access asset settings
];

// Helper function to check if a role can perform CRUD operations on assets
export const canManageAssets = (role: UserRole): boolean => {
  return ASSET_MANAGE_ROLES.includes(role);
};

// Helper function to check if a role can perform CRUD operations on maintenance dockets
export const canManageMaintenance = (role: UserRole): boolean => {
  return MAINTENANCE_MANAGE_ROLES.includes(role);
};

// Helper function to check if a role can access settings
export const canAccessSettings = (role: UserRole): boolean => {
  return SETTINGS_ACCESS_ROLES.includes(role);
};

// Helper function to check if a role can access asset settings
export const canAccessAssetSettings = (role: UserRole): boolean => {
  return ASSET_SETTINGS_ACCESS_ROLES.includes(role);
};
