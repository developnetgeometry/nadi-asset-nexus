import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Box, 
  Wrench, 
  BarChart4, 
  Settings, 
  Home, 
  ChevronRight, 
  ChevronLeft,
  Database
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isSubItem?: boolean;
}

const SidebarNavItem = ({ to, icon, label, isOpen, isSubItem = false }: SidebarNavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center py-2 px-4 rounded-lg transition-colors relative group",
        isActive 
          ? "bg-nadi-100 text-nadi-700" 
          : "text-gray-700 hover:bg-gray-100",
        isSubItem && "ml-4 text-sm"
      )}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        {isOpen && <span>{label}</span>}
      </div>
      {!isOpen && (
        <div className="absolute left-full ml-2 rounded-md bg-gray-900 text-white p-2 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          {label}
        </div>
      )}
    </NavLink>
  );
};

interface SidebarNavGroupProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
}

const SidebarNavGroup = ({ title, children, isOpen }: SidebarNavGroupProps) => {
  return (
    <div className="mb-4">
      {isOpen && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

// Define role-based permissions
const VIEW_DASHBOARD_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE", "MCMC_ADMIN", "MCMC_OPERATION", "DUSP_ADMIN", "DUSP_OPERATION"];
const VIEW_ASSETS_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE", "MCMC_ADMIN", "MCMC_OPERATION", "DUSP_ADMIN", "DUSP_OPERATION"];
const VIEW_MAINTENANCE_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE", "MCMC_ADMIN", "MCMC_OPERATION", "DUSP_ADMIN", "DUSP_OPERATION", "VENDOR_ADMIN", "VENDOR_STAFF"];
const VIEW_PERFORMANCE_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_PIC", "TP_SITE", "MCMC_ADMIN", "MCMC_OPERATION"];
const ASSET_SETTINGS_ROLES: UserRole[] = ["SUPER_ADMIN"];
const SYSTEM_SETTINGS_ROLES: UserRole[] = ["SUPER_ADMIN"];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { currentUser, checkPermission } = useAuth();
  
  const canViewDashboard = currentUser && checkPermission(VIEW_DASHBOARD_ROLES);
  const canViewAssets = currentUser && checkPermission(VIEW_ASSETS_ROLES);
  const canViewAssetSettings = currentUser && checkPermission(ASSET_SETTINGS_ROLES);
  const canViewMaintenance = currentUser && checkPermission(VIEW_MAINTENANCE_ROLES);
  const canViewPerformance = currentUser && checkPermission(VIEW_PERFORMANCE_ROLES);
  const canViewSystemSettings = currentUser && checkPermission(SYSTEM_SETTINGS_ROLES);
  
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-nadi-600 flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              {isOpen && (
                <span className="ml-3 font-semibold text-gray-800">NADI e-System</span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleSidebar} 
              className="hidden lg:block text-gray-500 hover:text-gray-700"
            >
              {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {canViewDashboard && (
              <SidebarNavGroup title="Main" isOpen={isOpen}>
                <SidebarNavItem
                  to="/"
                  icon={<LayoutDashboard className="h-5 w-5" />}
                  label="Dashboard"
                  isOpen={isOpen}
                />
              </SidebarNavGroup>
            )}

            {canViewAssets && (
              <SidebarNavGroup title="Asset Management" isOpen={isOpen}>
                <SidebarNavItem
                  to="/assets"
                  icon={<Box className="h-5 w-5" />}
                  label="Assets"
                  isOpen={isOpen}
                />
                
                {canViewAssetSettings && (
                  <SidebarNavItem
                    to="/asset-settings"
                    icon={<Database className="h-5 w-5" />}
                    label="Asset Settings"
                    isOpen={isOpen}
                  />
                )}
              </SidebarNavGroup>
            )}

            {canViewMaintenance && (
              <SidebarNavGroup title="Maintenance" isOpen={isOpen}>
                <SidebarNavItem
                  to="/maintenance"
                  icon={<Wrench className="h-5 w-5" />}
                  label="Maintenance Dockets"
                  isOpen={isOpen}
                />
              </SidebarNavGroup>
            )}

            {canViewPerformance && (
              <SidebarNavGroup title="Reports" isOpen={isOpen}>
                <SidebarNavItem
                  to="/performance"
                  icon={<BarChart4 className="h-5 w-5" />}
                  label="Performance"
                  isOpen={isOpen}
                />
              </SidebarNavGroup>
            )}

            {canViewSystemSettings && (
              <SidebarNavGroup title="Settings" isOpen={isOpen}>
                <SidebarNavItem
                  to="/settings"
                  icon={<Settings className="h-5 w-5" />}
                  label="System Settings"
                  isOpen={isOpen}
                />
              </SidebarNavGroup>
            )}
          </nav>

          <div className="p-4 border-t border-gray-200">
            {isOpen && (
              <div className="text-xs text-gray-500 text-center">
                <div>NADI e-System v1.0</div>
                <div>© {new Date().getFullYear()} MCMC</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
