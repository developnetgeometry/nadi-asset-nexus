
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import MaintenanceDockets from "./pages/MaintenanceDockets";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionWrapper from "./components/PermissionWrapper";
import { 
  PERFORMANCE_VIEW_ROLES, 
  ASSET_VIEW_ONLY_ROLES, 
  ASSET_MANAGE_ROLES,
  MAINTENANCE_VIEW_ROLES, 
  MAINTENANCE_MANAGE_ROLES 
} from "./config/permissions";

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
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assets"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PermissionWrapper allowedRoles={[...ASSET_VIEW_ONLY_ROLES, ...ASSET_MANAGE_ROLES]}>
                        <Assets />
                      </PermissionWrapper>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/dockets"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PermissionWrapper allowedRoles={[...MAINTENANCE_VIEW_ROLES, ...MAINTENANCE_MANAGE_ROLES]}>
                        <MaintenanceDockets />
                      </PermissionWrapper>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PermissionWrapper allowedRoles={PERFORMANCE_VIEW_ROLES}>
                        <Performance />
                      </PermissionWrapper>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
