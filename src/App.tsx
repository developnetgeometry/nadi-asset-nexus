
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssetSettings from "./pages/AssetSettings";
import MaintenanceDockets from "./pages/MaintenanceDockets";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { UserRole } from "./types";

// Define role-based permissions
const VIEW_DASHBOARD_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE", "MCMC_ADMIN", "MCMC_OPERATION", "DUSP_ADMIN", "DUSP_OPERATION"];
const CRUD_ASSETS_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE"];
const VIEW_MAINTENANCE_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE", "MCMC_ADMIN", "MCMC_OPERATION", "DUSP_ADMIN", "DUSP_OPERATION", "VENDOR_ADMIN", "VENDOR_STAFF"];
const CRUD_MAINTENANCE_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE"];
const VIEW_PERFORMANCE_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_PIC", "TP_SITE", "MCMC_ADMIN", "MCMC_OPERATION"];
const ASSET_SETTINGS_ROLES: UserRole[] = ["SUPER_ADMIN"];
const SYSTEM_SETTINGS_ROLES: UserRole[] = ["SUPER_ADMIN"];

// Role-based route component
interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { currentUser, checkPermission } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!checkPermission(allowedRoles)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RoleBasedRoute allowedRoles={VIEW_DASHBOARD_ROLES}>
                        <Dashboard />
                      </RoleBasedRoute>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/asset-settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RoleBasedRoute allowedRoles={ASSET_SETTINGS_ROLES}>
                        <AssetSettings />
                      </RoleBasedRoute>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/dockets"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RoleBasedRoute allowedRoles={VIEW_MAINTENANCE_ROLES}>
                        <MaintenanceDockets />
                      </RoleBasedRoute>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RoleBasedRoute allowedRoles={VIEW_PERFORMANCE_ROLES}>
                        <Performance />
                      </RoleBasedRoute>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RoleBasedRoute allowedRoles={SYSTEM_SETTINGS_ROLES}>
                        <Settings />
                      </RoleBasedRoute>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
