
import { User } from "../types";
import { v4 as uuid } from "uuid";

export const superAdminUser: User = {
  id: uuid(),
  name: "Super Admin",
  email: "super@admin.example.com",
  role: "SUPER_ADMIN",
  organization: "MCMC",
  department: "Administration",
  phoneNumber: "+60123456789",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
