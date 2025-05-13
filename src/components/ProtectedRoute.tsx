
import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  createPermission?: boolean; // This prop indicates if create permission is needed
}

const ProtectedRoute = ({ children, requiredRoles, createPermission = false }: ProtectedRouteProps) => {
  const { currentUser, checkPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (requiredRoles && !checkPermission(requiredRoles)) {
      navigate("/");
    }
  }, [currentUser, navigate, requiredRoles, checkPermission]);

  if (!currentUser) return null;
  
  // If create permission is required but user doesn't have it, return null
  if (createPermission && requiredRoles && !checkPermission(requiredRoles)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
