
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole, MaintenanceDocket } from "../types";
import { mockUsers } from "../data/mockData";
import { mockDockets } from "../data/mockData";
import { toast } from "sonner";

// Create a "shared" state that simulates a backend
const sharedDocketState = {
  dockets: [...mockDockets], // Initialize with mock data
  updateDocket: (updatedDocket: MaintenanceDocket) => {
    // Find and update the docket in the shared state
    const index = sharedDocketState.dockets.findIndex(d => d.id === updatedDocket.id);
    if (index !== -1) {
      sharedDocketState.dockets[index] = updatedDocket;
      
      // Notify all subscribers
      sharedDocketState.subscribers.forEach(callback => callback([...sharedDocketState.dockets]));
    }
  },
  subscribers: [] as ((dockets: MaintenanceDocket[]) => void)[],
  subscribe: (callback: (dockets: MaintenanceDocket[]) => void) => {
    sharedDocketState.subscribers.push(callback);
    return () => {
      const index = sharedDocketState.subscribers.indexOf(callback);
      if (index !== -1) {
        sharedDocketState.subscribers.splice(index, 1);
      }
    };
  }
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (allowedRoles: UserRole[]) => boolean;
  sharedDockets: {
    getDockets: () => MaintenanceDocket[];
    updateDocket: (docket: MaintenanceDocket) => void;
    subscribeToDockets: (callback: (dockets: MaintenanceDocket[]) => void) => () => void;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // In a real app, this would come from an API after login
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, just look up the user by email
        const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        
        // Add debugging
        console.log("Login attempt:", { email, foundUser: !!user, availableUsers: mockUsers.map(u => u.email) });
        
        if (user) {
          setCurrentUser(user);
          toast.success(`Welcome, ${user.name}`);
          resolve(true);
        } else {
          toast.error("Invalid credentials");
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info("You have been logged out");
  };

  const checkPermission = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  };

  // Interface for the shared dockets state
  const sharedDockets = {
    getDockets: () => [...sharedDocketState.dockets],
    updateDocket: (docket: MaintenanceDocket) => sharedDocketState.updateDocket(docket),
    subscribeToDockets: (callback: (dockets: MaintenanceDocket[]) => void) => 
      sharedDocketState.subscribe(callback)
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      checkPermission,
      sharedDockets 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
