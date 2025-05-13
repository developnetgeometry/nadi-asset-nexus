
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaintenanceDocket, DocketStatus, UserRole } from "@/types";
import { CalendarDays, CheckCircle, Clock, FileText, Upload, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatMaintenanceType, getDocketStatusClass } from "@/utils/formatters";

interface DocketDetailsDialogProps {
  docket: MaintenanceDocket | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (
    docketId: string, 
    newStatus: DocketStatus, 
    remarks?: string, 
    estimatedDate?: string
  ) => void;
}

const DocketDetailsDialog = ({
  docket,
  isOpen,
  onClose,
  onStatusUpdate,
}: DocketDetailsDialogProps) => {
  const { currentUser, checkPermission } = useAuth();
  const [remarks, setRemarks] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  if (!docket || !currentUser) return null;

  // Helper function to determine which actions are available based on role and status
  const getAvailableActions = () => {
    const role = currentUser.role;
    const status = docket.status;
    
    // Updated to include TP_SITE as NADI Staff
    const isNADIStaff = ["TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE"].includes(role);
    const isTP = ["TP_ADMIN", "TP_OPERATION"].includes(role);
    const isDUSP = ["DUSP_ADMIN", "DUSP_MANAGEMENT", "DUSP_OPERATION"].includes(role);
    
    // Return object with boolean flags for each possible action
    return {
      canSubmit: isNADIStaff && status === "DRAFTED",
      canApprove: (isTP && status === "SUBMITTED") || (isDUSP && status === "RECOMMENDED"),
      canReject: (isTP && status === "SUBMITTED") || (isDUSP && status === "RECOMMENDED"),
      canAssign: isTP && status === "SUBMITTED",
      canClose: isNADIStaff && status === "APPROVED",
    };
  };

  const actions = getAvailableActions();

  // Handle status change
  const handleStatusChange = (newStatus: DocketStatus) => {
    if (newStatus === "APPROVED" && docket.status === "SUBMITTED") {
      // TP Approval requires estimated completion date
      if (!estimatedCompletionDate) {
        toast.error("Please specify an estimated completion date");
        return;
      }
      onStatusUpdate(docket.id, newStatus, remarks, estimatedCompletionDate);
    } else {
      onStatusUpdate(docket.id, newStatus, remarks);
    }
    setRemarks("");
    setEstimatedCompletionDate("");
    onClose();
  };

  // Helper function to get Status Icon
  const getStatusIcon = (status: DocketStatus) => {
    switch (status) {
      case "DRAFTED":
        return <FileText className="h-5 w-5 text-gray-500" />;
      case "SUBMITTED":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "CLOSED":
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case "RECOMMENDED":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {getStatusIcon(docket.status)}
            <span>{docket.docketNo}: {docket.title}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            View and update maintenance docket details
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <div className="mt-1">
                  <Badge className={getDocketStatusClass(docket.status)}>
                    {docket.status.charAt(0) + docket.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Type</Label>
                <div className="mt-1">{formatMaintenanceType(docket.type)}</div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Category</Label>
                <div className="mt-1">{docket.category}</div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">SLA Category</Label>
                <div className="mt-1">{docket.slaCategory}</div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Requested By</Label>
                <div className="mt-1">{docket.requestedBy}</div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  {docket.estimatedCompletionDate ? "Estimated Completion" : "No Estimated Date"}
                </Label>
                <div className="mt-1 flex items-center">
                  {docket.estimatedCompletionDate && (
                    <>
                      <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
                      {new Date(docket.estimatedCompletionDate).toLocaleDateString()}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Description</Label>
              <p className="mt-1 text-sm text-gray-700">{docket.description}</p>
            </div>

            {docket.remarks && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Remarks</Label>
                <p className="mt-1 text-sm text-gray-700">{docket.remarks}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Before Images</h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {docket.attachments?.before?.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                      <img src={image} alt={`Before ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">After Images</h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {docket.attachments?.after?.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                      <img src={image} alt={`After ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* File upload control for adding new photos */}
              {(actions.canClose || (docket.status === "DRAFTED")) && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-500">
                    {docket.status === "DRAFTED" ? "Upload Before Photos" : "Upload After Photos"}
                  </Label>
                  <div className="mt-1 flex items-center">
                    <Input 
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setSelectedFiles(e.target.files)}
                      className="flex-1"
                    />
                    <Button size="sm" className="ml-2">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {/* This would be populated with timeline components indicating docket history */}
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Docket Created</p>
                  <p className="text-xs text-gray-500">{new Date(docket.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-gray-500">
                    {new Date(docket.lastActionDate).toLocaleString()} by {docket.lastActionBy}
                  </p>
                </div>
              </div>
              {/* More history items would be added dynamically */}
            </div>
          </TabsContent>
        </Tabs>

        {/* Conditional rendering for action UI based on docket status and user role */}
        {(actions.canApprove || actions.canReject || actions.canAssign || actions.canSubmit || actions.canClose) && (
          <div className="mt-6">
            <Label className="text-sm font-medium">Actions</Label>
            {(actions.canApprove || actions.canReject) && (
              <div className="mt-2 space-y-4">
                {actions.canApprove && docket.status === "SUBMITTED" && (
                  <div>
                    <Label htmlFor="estimatedDate">Estimated Completion Date</Label>
                    <Input 
                      id="estimatedDate"
                      type="date" 
                      value={estimatedCompletionDate}
                      onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Textarea 
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any comments or notes here..."
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-2 mt-6">
          {actions.canSubmit && (
            <Button onClick={() => handleStatusChange("SUBMITTED")}>
              Submit Docket
            </Button>
          )}
          {actions.canApprove && (
            <Button variant="default" onClick={() => handleStatusChange("APPROVED")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          {actions.canReject && (
            <Button variant="destructive" onClick={() => handleStatusChange("REJECTED")}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          )}
          {actions.canAssign && (
            <Button variant="secondary" onClick={() => handleStatusChange("RECOMMENDED")}>
              Assign to DUSP
            </Button>
          )}
          {actions.canClose && (
            <Button variant="outline" onClick={() => handleStatusChange("CLOSED")}>
              Close Docket
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocketDetailsDialog;
