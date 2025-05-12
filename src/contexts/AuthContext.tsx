
import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "../types";
import { mockUsers } from "../data/mockData";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (allowedRoles: UserRole[]) => boolean;
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

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
