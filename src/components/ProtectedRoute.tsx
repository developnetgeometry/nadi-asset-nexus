
import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { currentUser, checkPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (requiredRoles && !checkPermission(requiredRoles)) {
      navigate("/");
    }
  }, [currentUser, navigate, requiredRoles, checkPermission]);

  return currentUser ? <>{children}</> : null;
};

export default ProtectedRoute;
