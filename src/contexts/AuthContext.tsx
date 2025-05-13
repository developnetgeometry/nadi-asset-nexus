
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole, MaintenanceDocket } from "../types";
import { mockUsers } from "../data/mockData";
import { mockDockets } from "../data/mockData";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

// Type for notifications
export type Notification = {
  id: string;
  message: string;
  time: string;
  isRead: boolean;
  relatedDocketId?: string;
};

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
    } else {
      // If the docket doesn't exist, add it
      sharedDocketState.dockets.push(updatedDocket);
      
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

// Shared notifications state
const sharedNotificationsState = {
  notifications: [] as Notification[],
  addNotification: (notification: Notification) => {
    sharedNotificationsState.notifications.unshift(notification);
    sharedNotificationsState.subscribers.forEach(callback => 
      callback([...sharedNotificationsState.notifications])
    );
  },
  markAsRead: (notificationId: string) => {
    const index = sharedNotificationsState.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      sharedNotificationsState.notifications[index].isRead = true;
      sharedNotificationsState.subscribers.forEach(callback => 
        callback([...sharedNotificationsState.notifications])
      );
    }
  },
  subscribers: [] as ((notifications: Notification[]) => void)[],
  subscribe: (callback: (notifications: Notification[]) => void) => {
    sharedNotificationsState.subscribers.push(callback);
    return () => {
      const index = sharedNotificationsState.subscribers.indexOf(callback);
      if (index !== -1) {
        sharedNotificationsState.subscribers.splice(index, 1);
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
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  addNotification: (message: string, relatedDocketId?: string) => void;
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
  
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Subscribe to shared notifications
  useEffect(() => {
    const unsubscribe = sharedNotificationsState.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });
    
    return unsubscribe;
  }, []);

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
  
  // Add notification function
  const addNotification = (message: string, relatedDocketId?: string) => {
    const newNotification: Notification = {
      id: uuid(),
      message,
      time: new Date().toLocaleString(),
      isRead: false,
      relatedDocketId
    };
    
    sharedNotificationsState.addNotification(newNotification);
  };
  
  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    sharedNotificationsState.markAsRead(notificationId);
  };

  // Interface for the shared dockets state
  const sharedDockets = {
    getDockets: () => [...sharedDocketState.dockets],
    updateDocket: (docket: MaintenanceDocket) => {
      // Add notification when a docket status changes
      const existingDocket = sharedDocketState.dockets.find(d => d.id === docket.id);
      
      if (existingDocket && existingDocket.status !== docket.status) {
        // Status has changed, create notification
        const statusLabels: Record<string, string> = {
          "DRAFTED": "drafted",
          "SUBMITTED": "submitted",
          "APPROVED": "approved",
          "REJECTED": "rejected",
          "CLOSED": "closed",
          "RECOMMENDED": "recommended to DUSP"
        };
        
        addNotification(
          `Docket ${docket.docketNo} has been ${statusLabels[docket.status]}`,
          docket.id
        );
        
        // Additional notifications based on flow diagram
        switch(docket.status) {
          case "SUBMITTED":
            if (currentUser?.role === "TP_ADMIN") {
              addNotification(`TP has submitted docket ${docket.docketNo} for review`, docket.id);
            }
            break;
          case "APPROVED":
            if (existingDocket.status === "SUBMITTED") {
              addNotification(`NADI staff has approved docket ${docket.docketNo}`, docket.id);
            } else if (existingDocket.status === "RECOMMENDED") {
              addNotification(`DUSP has approved docket ${docket.docketNo}`, docket.id);
            }
            break;
          case "REJECTED":
            addNotification(`Docket ${docket.docketNo} has been rejected`, docket.id);
            break;
          case "RECOMMENDED":
            addNotification(`Docket ${docket.docketNo} has been recommended to DUSP`, docket.id);
            break;
          case "CLOSED":
            addNotification(`Docket ${docket.docketNo} has been closed`, docket.id);
            break;
        }
      } else if (!existingDocket) {
        // New docket created
        addNotification(`New docket ${docket.docketNo} has been created`, docket.id);
      }
      
      sharedDocketState.updateDocket(docket);
    },
    subscribeToDockets: (callback: (dockets: MaintenanceDocket[]) => void) => 
      sharedDocketState.subscribe(callback)
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      checkPermission,
      sharedDockets,
      notifications,
      markNotificationAsRead,
      addNotification
    }}>
      {children}
    </AuthContext.Provider>
  );
};
