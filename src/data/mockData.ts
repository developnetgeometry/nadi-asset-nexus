
import { Asset, MaintenanceDocket, User, MaintenanceType, DocketStatus, SLACategory, DocketCategory, AssetStatus, UserRole } from "../types";

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Ahmad Razali",
    email: "ahmad@tp.example.com",
    role: "TP_ADMIN",
    organization: "TechPro Solutions",
    department: "Administration",
    phoneNumber: "+6012-345-6789",
    isActive: true,
    createdAt: "2023-06-15T09:00:00Z",
    updatedAt: "2023-06-15T09:00:00Z"
  },
  {
    id: "u2",
    name: "Farah Lim",
    email: "farah@tp.example.com",
    role: "TP_OPERATION",
    organization: "TechPro Solutions",
    department: "Operations",
    phoneNumber: "+6012-987-6543",
    isActive: true,
    createdAt: "2023-06-16T10:30:00Z",
    updatedAt: "2023-06-16T10:30:00Z"
  },
  {
    id: "u3",
    name: "Rajesh Kumar",
    email: "rajesh@dusp.example.com",
    role: "DUSP_ADMIN",
    organization: "Digital Universal Services",
    department: "Management",
    phoneNumber: "+6013-222-3333",
    isActive: true,
    createdAt: "2023-06-17T08:15:00Z",
    updatedAt: "2023-06-17T08:15:00Z"
  },
  {
    id: "u4",
    name: "Nurul Huda",
    email: "nurul@mcmc.example.com",
    role: "MCMC_ADMIN",
    organization: "MCMC",
    department: "Administration",
    phoneNumber: "+6019-888-7777",
    isActive: true,
    createdAt: "2023-06-18T14:20:00Z",
    updatedAt: "2023-06-18T14:20:00Z"
  },
  {
    id: "u5",
    name: "Tan Wei Ming",
    email: "tan@vendor.example.com",
    role: "VENDOR_ADMIN",
    organization: "TechFix Solutions",
    department: "Administration",
    phoneNumber: "+6016-555-4444",
    isActive: true,
    createdAt: "2023-06-19T11:45:00Z",
    updatedAt: "2023-06-19T11:45:00Z"
  },
  {
    id: "u6",
    name: "Site Operator",
    email: "site@tp.example.com",
    role: "TP_SITE",
    organization: "TechPro Solutions",
    department: "Site Operations",
    phoneNumber: "+6018-123-4567",
    isActive: true,
    createdAt: "2023-06-20T10:00:00Z",
    updatedAt: "2023-06-20T10:00:00Z"
  }
];

// Mock Assets Data
export const mockAssets: Asset[] = [
  {
    id: "a1",
    name: "Server Rack A",
    description: "Main server rack for data center",
    category: "IT Infrastructure",
    type: "Server Equipment",
    model: "Dell PowerEdge R740",
    serial_number: "SRV-DELL-001", // Changed from serialNumber to serial_number
    status: "ACTIVE",
    location: "Kuala Lumpur Data Center, Room 101",
    assignedTo: "u2",
    purchaseDate: "2022-01-15",
    warrantyExpiry: "2025-01-15",
    lastMaintenance: "2023-05-20",
    nextMaintenance: "2023-08-20",
    createdAt: "2022-01-20T09:00:00Z",
    updatedAt: "2023-05-21T14:30:00Z"
  },
  {
    id: "a2",
    name: "Network Switch",
    description: "Core network switch for main office",
    category: "IT Infrastructure",
    type: "Network Equipment",
    model: "Cisco Catalyst 9300",
    serial_number: "NSW-CISCO-002", // Changed from serialNumber to serial_number
    status: "ACTIVE",
    location: "Penang Office, Server Room",
    assignedTo: "u2",
    purchaseDate: "2022-02-10",
    warrantyExpiry: "2025-02-10",
    lastMaintenance: "2023-04-15",
    nextMaintenance: "2023-07-15",
    createdAt: "2022-02-15T10:15:00Z",
    updatedAt: "2023-04-16T11:20:00Z"
  },
  {
    id: "a3",
    name: "Air Conditioning Unit",
    description: "HVAC system for server room",
    category: "Facilities",
    type: "HVAC Equipment",
    model: "Daikin VRV IV",
    serial_number: "HVAC-DAI-003", // Changed from serialNumber to serial_number
    status: "UNDER_REPAIR",
    location: "Kuala Lumpur Data Center, Room 101",
    assignedTo: "u5",
    purchaseDate: "2021-11-05",
    warrantyExpiry: "2024-11-05",
    lastMaintenance: "2023-06-01",
    nextMaintenance: "2023-09-01",
    createdAt: "2021-11-10T08:30:00Z",
    updatedAt: "2023-06-05T16:45:00Z"
  },
  {
    id: "a4",
    name: "UPS System",
    description: "Uninterruptible Power Supply for critical systems",
    category: "Power",
    type: "Electrical Equipment",
    model: "APC Smart-UPS SRT 10kVA",
    serial_number: "UPS-APC-004", // Changed from serialNumber to serial_number
    status: "ACTIVE",
    location: "Johor Bahru Site, Main Building",
    assignedTo: "u2",
    purchaseDate: "2022-03-20",
    warrantyExpiry: "2025-03-20",
    lastMaintenance: "2023-05-25",
    nextMaintenance: "2023-08-25",
    createdAt: "2022-03-25T13:45:00Z",
    updatedAt: "2023-05-26T09:10:00Z"
  },
  {
    id: "a5",
    name: "Security Camera System",
    description: "CCTV system for site security",
    category: "Security",
    type: "Surveillance Equipment",
    model: "Hikvision DS-2CD2T85FWD-I5",
    serial_number: "CAM-HIK-005", // Changed from serialNumber to serial_number
    status: "ACTIVE",
    location: "Kuching Site, Perimeter",
    assignedTo: "u5",
    purchaseDate: "2022-04-10",
    warrantyExpiry: "2025-04-10",
    lastMaintenance: "2023-06-10",
    nextMaintenance: "2023-09-10",
    createdAt: "2022-04-15T11:30:00Z",
    updatedAt: "2023-06-11T14:20:00Z"
  },
  {
    id: "a6",
    name: "Generator",
    description: "Backup power generator",
    category: "Power",
    type: "Electrical Equipment",
    model: "Cummins C150D5",
    serial_number: "GEN-CUM-006", // Changed from serialNumber to serial_number
    status: "ACTIVE",
    location: "Kuala Lumpur Data Center, External",
    assignedTo: "u2",
    purchaseDate: "2021-10-15",
    warrantyExpiry: "2024-10-15",
    lastMaintenance: "2023-06-05",
    nextMaintenance: "2023-09-05",
    createdAt: "2021-10-20T09:45:00Z",
    updatedAt: "2023-06-06T10:30:00Z"
  },
  {
    id: "a7",
    name: "Router",
    description: "Core router for network infrastructure",
    category: "IT Infrastructure",
    type: "Network Equipment",
    model: "Juniper MX240",
    serial_number: "RTR-JUN-007", // Changed from serialNumber to serial_number
    status: "RETIRED",
    location: "Storage, Kuala Lumpur",
    purchaseDate: "2018-05-20",
    warrantyExpiry: "2021-05-20",
    lastMaintenance: "2021-04-15",
    createdAt: "2018-05-25T15:20:00Z",
    updatedAt: "2021-12-10T11:15:00Z"
  }
];

// Mock Maintenance Dockets
export const mockDockets: MaintenanceDocket[] = [
  {
    id: "d1",
    docketNo: "MD-2023-001",
    title: "Server Rack Quarterly Maintenance",
    description: "Regular quarterly maintenance for Server Rack A including cleaning, firmware updates, and hardware checks.",
    type: "PREVENTIVE_SCHEDULED",
    category: "ICT",
    slaCategory: "NORMAL",
    status: "CLOSED",
    location: "Kuala Lumpur Data Center, Room 101", // Added location
    assetId: "a1",
    assignedTo: "u2",
    requestedBy: "u1",
    submittedBy: "u1", // Added submittedBy
    submittedDate: "2023-05-01T09:00:00Z", // Added submittedDate
    estimatedCompletionDate: "2023-05-25",
    actualCompletionDate: "2023-05-20",
    lastActionBy: "u2",
    lastActionDate: "2023-05-20",
    createdAt: "2023-05-01T09:00:00Z",
    updatedAt: "2023-05-20T16:30:00Z",
    remarks: "",
    isOverdue: false,
    attachments: { before: [], after: [] }
  },
  {
    id: "d2",
    docketNo: "MD-2023-002",
    title: "HVAC System Repair",
    description: "AC unit showing temperature fluctuations. Requires immediate attention as it's affecting server room temperature.",
    type: "COMPREHENSIVE",
    category: "HVAC",
    slaCategory: "CRITICAL",
    status: "APPROVED",
    location: "Kuala Lumpur Data Center, Room 101", // Added location
    assetId: "a3",
    assignedTo: "u5",
    requestedBy: "u2",
    submittedBy: "u2", // Added submittedBy
    submittedDate: "2023-06-01T10:15:00Z", // Added submittedDate
    estimatedCompletionDate: "2023-06-15",
    lastActionBy: "u3",
    lastActionDate: "2023-06-05",
    createdAt: "2023-06-01T10:15:00Z",
    updatedAt: "2023-06-05T14:20:00Z",
    remarks: "",
    isOverdue: false,
    attachments: { before: [], after: [] }
  },
  {
    id: "d3",
    docketNo: "MD-2023-003",
    title: "UPS Battery Replacement",
    description: "Scheduled replacement of UPS batteries as per maintenance schedule.",
    type: "PREVENTIVE_SCHEDULED",
    category: "ELECTRICAL",
    slaCategory: "NORMAL",
    status: "SUBMITTED",
    location: "Johor Bahru Site, Main Building", // Added location
    assetId: "a4",
    assignedTo: "u5",
    requestedBy: "u2",
    submittedBy: "u2", // Added submittedBy
    submittedDate: "2023-06-15T08:45:00Z", // Added submittedDate
    estimatedCompletionDate: "2023-07-10",
    lastActionBy: "u2",
    lastActionDate: "2023-06-15",
    createdAt: "2023-06-15T08:45:00Z",
    updatedAt: "2023-06-15T08:45:00Z",
    remarks: "",
    isOverdue: false,
    attachments: { before: [], after: [] }
  },
  {
    id: "d4",
    docketNo: "MD-2023-004",
    title: "Network Switch Configuration",
    description: "Reconfiguration of network switch to accommodate new services.",
    type: "COMPREHENSIVE",
    category: "ICT",
    slaCategory: "LOW",
    status: "DRAFTED",
    location: "Penang Office, Server Room", // Added location
    assetId: "a2",
    requestedBy: "u2",
    submittedBy: "u2", // Added submittedBy
    submittedDate: "2023-06-20T11:30:00Z", // Added submittedDate
    estimatedCompletionDate: "2023-07-20",
    lastActionBy: "u2",
    lastActionDate: "2023-06-20",
    createdAt: "2023-06-20T11:30:00Z",
    updatedAt: "2023-06-20T11:30:00Z",
    remarks: "",
    isOverdue: false,
    attachments: { before: [], after: [] }
  },
  {
    id: "d5",
    docketNo: "MD-2023-005",
    title: "Security Camera Alignment",
    description: "Adjustment of security cameras due to poor angle coverage.",
    type: "PREVENTIVE_UNSCHEDULED",
    category: "ICT",
    slaCategory: "LOW",
    status: "REJECTED",
    location: "Kuching Site, Perimeter", // Added location
    assetId: "a5",
    assignedTo: "u5",
    requestedBy: "u2",
    submittedBy: "u2", // Added submittedBy
    submittedDate: "2023-06-20T14:00:00Z", // Added submittedDate
    estimatedCompletionDate: "2023-06-30",
    lastActionBy: "u3",
    lastActionDate: "2023-06-22",
    createdAt: "2023-06-20T14:00:00Z",
    updatedAt: "2023-06-22T09:15:00Z",
    remarks: "",
    isOverdue: false,
    attachments: { before: [], after: [] }
  },
  {
    id: "d6",
    docketNo: "MD-2023-006",
    title: "Generator Fuel System Check",
    description: "Inspection and cleaning of generator fuel system.",
    type: "PREVENTIVE_SCHEDULED",
    category: "ELECTRICAL",
    slaCategory: "NORMAL",
    status: "APPROVED",
    location: "Kuala Lumpur Data Center, External", // Added location
    assetId: "a6",
    assignedTo: "u5",
    requestedBy: "u1",
    submittedBy: "u1", // Added submittedBy
    submittedDate: "2023-06-20T15:30:00Z", // Added submittedDate
    estimatedCompletionDate: "2023-07-05",
    lastActionBy: "u3",
    lastActionDate: "2023-06-25",
    createdAt: "2023-06-20T15:30:00Z",
    updatedAt: "2023-06-25T10:45:00Z",
    remarks: "",
    isOverdue: false,
    attachments: { before: [], after: [] }
  }
];

// KPI Stats for Dashboard
export interface KPIStats {
  totalAssets: number;
  activeAssets: number;
  underRepairAssets: number;
  retiredAssets: number;
  totalDockets: number;
  openDockets: number;
  completedDockets: number;
  criticalDockets: number;
  mttr: string; // Mean Time To Repair (in hours)
  slaBreach: string; // percentage
}

export const mockKPIStats: KPIStats = {
  totalAssets: mockAssets.length,
  activeAssets: mockAssets.filter(a => a.status === "ACTIVE").length,
  underRepairAssets: mockAssets.filter(a => a.status === "UNDER_REPAIR").length,
  retiredAssets: mockAssets.filter(a => a.status === "RETIRED").length,
  totalDockets: mockDockets.length,
  openDockets: mockDockets.filter(d => d.status !== "CLOSED").length,
  completedDockets: mockDockets.filter(d => d.status === "CLOSED").length,
  criticalDockets: mockDockets.filter(d => d.slaCategory === "CRITICAL").length,
  mttr: "24.5", // Mean Time To Repair (in hours)
  slaBreach: "12.5%", // SLA breach percentage
};

// Gets the status style class for docket status
export const getDocketStatusClass = (status: DocketStatus) => {
  switch (status) {
    case "DRAFTED": return "status-drafted";
    case "SUBMITTED": return "status-submitted";
    case "APPROVED": return "status-approved";
    case "REJECTED": return "status-rejected";
    case "CLOSED": return "status-closed";
    default: return "";
  }
};
