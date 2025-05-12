
import { DocketStatus, MaintenanceType } from "@/types";

// Helper function to format maintenance type
export const formatMaintenanceType = (type: MaintenanceType): string => {
  switch (type) {
    case "COMPREHENSIVE":
      return "Comprehensive";
    case "PREVENTIVE_SCHEDULED":
      return "Preventive (Scheduled)";
    case "PREVENTIVE_UNSCHEDULED":
      return "Preventive (Unscheduled)";
    default:
      return type;
  }
};

// Helper function to get status CSS class
export const getDocketStatusClass = (status: DocketStatus): string => {
  switch (status) {
    case "DRAFTED":
      return "bg-gray-100 text-gray-800";
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "CLOSED":
      return "bg-purple-100 text-purple-800";
    case "RECOMMENDED":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
