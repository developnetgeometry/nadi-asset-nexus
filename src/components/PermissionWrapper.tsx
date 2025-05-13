
import React, { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";
import NotAuthorized from "../pages/NotAuthorized";

interface PermissionWrapperProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  allowView?: boolean; // If true, allows viewing but not editing
}

const PermissionWrapper = ({ allowedRoles, children, allowView = false }: PermissionWrapperProps) => {
  const { currentUser, checkPermission } = useAuth();

  if (!currentUser) {
    return null; // Will be handled by ProtectedRoute
  }

  const hasPermission = checkPermission(allowedRoles);

  if (!hasPermission) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
};

export default PermissionWrapper;
