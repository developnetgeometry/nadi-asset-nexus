
import { MaintenanceDocket, DocketStatus, UserRole, SLACategory } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Calendar, 
  User, 
  FileText,
  Building,
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Clock
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatMaintenanceType, getDocketStatusClass } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface DocketDetailsDialogProps {
  docket: MaintenanceDocket | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (docketId: string, newStatus: DocketStatus, remarks?: string, estimatedDate?: string) => void;
  readOnly?: boolean;
}

const DocketDetailsDialog = ({ 
  docket, 
  isOpen, 
  onClose, 
  onStatusUpdate,
  readOnly = false 
}: DocketDetailsDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string>("");

  const { currentUser } = useAuth();

  // Get a more readable version of the status
  const getStatusLabel = (status: DocketStatus) => {
    const statusMap: Record<DocketStatus, string> = {
      "DRAFTED": "Drafted",
      "SUBMITTED": "Submitted",
      "APPROVED": "Approved",
      "REJECTED": "Rejected",
      "CLOSED": "Closed",
      "RECOMMENDED": "Recommended to DUSP"
    };
    return statusMap[status] || status;
  };
  
  // Function to determine available status options based on current status and user role
  const getAvailableStatusOptions = (currentStatus: DocketStatus, userRole: UserRole): DocketStatus[] => {
    switch (currentStatus) {
      case "DRAFTED":
        return ["SUBMITTED"];
      case "SUBMITTED":
        if (userRole === "MCMC_ADMIN" || userRole === "MCMC_OPERATION") {
          return ["APPROVED", "REJECTED"];
        }
        return [];
      case "APPROVED":
        if (userRole === "DUSP_ADMIN" || userRole === "DUSP_OPERATION") {
          return ["RECOMMENDED"];
        } else if (userRole === "MCMC_ADMIN" || userRole === "MCMC_OPERATION") {
          return ["CLOSED"];
        }
        return [];
      case "REJECTED":
        return [];
      case "RECOMMENDED":
        if (userRole === "DUSP_ADMIN" || userRole === "DUSP_OPERATION") {
          return ["APPROVED", "REJECTED"];
        }
        return [];
      case "CLOSED":
        return [];
      default:
        return [];
    }
  };

  // Function to handle status update
  const handleStatusUpdate = () => {
    if (!docket || !selectedStatus || readOnly) return;
    onStatusUpdate(docket.id, selectedStatus as DocketStatus, remarks);
    onClose();
  };
  
  // Function to get status icon
  const getStatusIcon = (status: DocketStatus) => {
    switch (status) {
      case "DRAFTED":
        return <FileText className="h-4 w-4 text-gray-500" />;
      case "SUBMITTED":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "CLOSED":
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case "RECOMMENDED":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Docket Details</DialogTitle>
        </DialogHeader>
        
        {docket && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Docket No</h4>
                <p className="text-gray-900">{docket.docketNo}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="text-gray-900">{docket.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Type</h4>
                <p className="text-gray-900">{formatMaintenanceType(docket.type)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">SLA Category</h4>
                <p className="text-gray-900">{docket.slaCategory}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Estimated Completion Date</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{new Date(docket.estimatedCompletionDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Requestor</h4>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{docket.requestedBy}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{docket.location}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Current Status</h4>
                <div className="flex items-center">
                  {getStatusIcon(docket.status)}
                  <Badge className={`ml-2 ${getDocketStatusClass(docket.status)}`}>
                    {getStatusLabel(docket.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="text-gray-900">{docket.description}</p>
            </div>
            
            {/* Status update section - only show if not readOnly */}
            {!readOnly && currentUser && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                <div className="flex items-center gap-4">
                  <div className="w-1/2">
                    <Select onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Only show status options that are valid for this transition */}
                        {getAvailableStatusOptions(docket.status, currentUser.role).map(status => (
                          <SelectItem key={status} value={status}>
                            {getStatusLabel(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Current:</span>
                    <span className={getDocketStatusClass(docket.status)}>
                      {getStatusLabel(docket.status)}
                    </span>
                    {selectedStatus && (
                      <>
                        <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                        <span className={getDocketStatusClass(selectedStatus as DocketStatus)}>
                          {getStatusLabel(selectedStatus as DocketStatus)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Textarea 
                    placeholder="Add remarks about this status change..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="h-24"
                  />
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus}
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            )}
            
            {/* Read-only message if applicable */}
            {readOnly && (
              <div className="border-t pt-4 mt-4 text-center text-gray-500 italic">
                You are in view-only mode and cannot update this docket.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocketDetailsDialog;
