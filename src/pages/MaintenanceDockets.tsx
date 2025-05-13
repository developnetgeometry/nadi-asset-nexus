
import { useState, useEffect } from "react";
import { 
  Wrench, Plus, Search, Download, FileText, Clock, CheckCircle, XCircle, AlertTriangle, CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceDocket, DocketStatus, SLACategory } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatMaintenanceType, getDocketStatusClass } from "../utils/formatters";
import DocketDetailsDialog from "../components/dockets/DocketDetailsDialog";
import NewDocketDialog from "../components/dockets/NewDocketDialog";
import DocketActionButtons from "../components/dockets/DocketActionButtons";
import { canManageMaintenance } from "../config/permissions";

const MaintenanceDockets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedDocket, setSelectedDocket] = useState<MaintenanceDocket | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isNewDocketDialogOpen, setIsNewDocketDialogOpen] = useState(false);
  const { currentUser, sharedDockets } = useAuth();
  
  // Define userCanManageDockets variable here
  const userCanManageDockets = currentUser ? canManageMaintenance(currentUser.role) : false;
  
  // Use the shared dockets state
  const [dockets, setDockets] = useState<MaintenanceDocket[]>(sharedDockets.getDockets());

  // Subscribe to docket updates
  useEffect(() => {
    // This will be called whenever the shared dockets state changes
    const unsubscribe = sharedDockets.subscribeToDockets((updatedDockets) => {
      setDockets(updatedDockets);
      
      // Log the update for debugging
      console.log("Dockets updated:", updatedDockets.length);
    });
    
    // Cleanup on unmount
    return unsubscribe;
  }, [sharedDockets]);

  // Function to handle docket status update - Now uses the shared state
  const handleDocketStatusUpdate = (
    docketId: string, 
    newStatus: DocketStatus, 
    remarks?: string,
    estimatedDate?: string
  ) => {
    // If user can't manage dockets, don't allow status updates
    if (!userCanManageDockets) {
      toast.error("You don't have permission to update docket status");
      return;
    }
    
    // Get the status label for toast messages
    const statusLabels: Record<DocketStatus, string> = {
      "DRAFTED": "drafted",
      "SUBMITTED": "submitted",
      "APPROVED": "approved",
      "REJECTED": "rejected",
      "CLOSED": "closed",
      "RECOMMENDED": "recommended to DUSP"
    };
    
    // Find the docket to update
    const docketToUpdate = dockets.find(d => d.id === docketId);
    
    if (docketToUpdate) {
      // Create updated docket
      const updatedDocket = {
        ...docketToUpdate,
        status: newStatus,
        lastActionDate: new Date().toISOString(),
        lastActionBy: currentUser?.name || "Current User",
        remarks: remarks || docketToUpdate.remarks,
        estimatedCompletionDate: estimatedDate || docketToUpdate.estimatedCompletionDate
      };
      
      // Update the selected docket if it's the same one
      if (selectedDocket && selectedDocket.id === docketId) {
        setSelectedDocket(updatedDocket);
      }
      
      // Update the shared state - this will propagate to all subscribers
      sharedDockets.updateDocket(updatedDocket);
      
      // Show appropriate notifications
      toast.success(`Docket has been ${statusLabels[newStatus]}`);
      
      // Additional notifications based on the flow diagram
      switch(newStatus) {
        case "SUBMITTED":
          toast.info("TP has been notified about this docket");
          break;
        case "APPROVED":
          if (docketToUpdate.status === "SUBMITTED") {
            toast.info("NADI staff has been notified about approval");
          } else if (docketToUpdate.status === "RECOMMENDED") {
            toast.info("TP and NADI staff have been notified about DUSP approval");
          }
          break;
        case "REJECTED":
          toast.info("NADI staff has been notified about rejection");
          break;
        case "RECOMMENDED":
          toast.info("DUSP has been notified about the recommended docket");
          break;
        case "CLOSED":
          toast.info("TP and NADI staff have been notified about closure");
          break;
      }
    }
  };

  // Function to open docket details dialog
  const viewDocketDetails = (docket: MaintenanceDocket) => {
    setSelectedDocket(docket);
    setIsDetailsDialogOpen(true);
  };

  // Function to create a new docket
  const createNewDocket = () => {
    // Only allow if user can manage dockets
    if (!userCanManageDockets) {
      toast.error("You don't have permission to create new dockets");
      return;
    }
    
    setIsNewDocketDialogOpen(true);
  };

  // Helper function to get status icon
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

  // Helper function to get SLA category badge
  const getSLACategoryBadge = (category: SLACategory) => {
    switch (category) {
      case "CRITICAL":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case "NORMAL":
        return <Badge className="bg-yellow-100 text-yellow-800">Normal</Badge>;
      case "LOW":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return null;
    }
  };

  // Filter dockets based on search, filters, and tab
  const filteredDockets = dockets.filter(docket => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      docket.docketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docket.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type if selected
    const matchesType = typeFilter === null || docket.type === typeFilter;
    
    // Filter by status if selected
    const matchesStatus = statusFilter === null || docket.status === statusFilter;

    // Filter by tab
    const matchesTab = currentTab === "all" || 
      (currentTab === "open" && !["CLOSED", "REJECTED"].includes(docket.status)) ||
      (currentTab === "critical" && docket.slaCategory === "CRITICAL") ||
      (currentTab === "closed" && docket.status === "CLOSED");
    
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance Dockets</h1>
          <p className="text-muted-foreground">
            Manage all maintenance activities and track their progress
          </p>
        </div>
        {userCanManageDockets && (
          <Button onClick={createNewDocket}>
            <Plus className="mr-2 h-4 w-4" /> New Maintenance Request
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Maintenance Dockets</CardTitle>
          <CardDescription>
            View and manage all maintenance dockets in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="critical">
                  Critical
                  <span className="ml-1.5 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {dockets.filter(d => d.slaCategory === "CRITICAL").length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    className="pl-10 md:w-[250px]" 
                    placeholder="Search dockets..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select onValueChange={(value) => setTypeFilter(value === "ALL" ? null : value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="COMPREHENSIVE">Comprehensive</SelectItem>
                      <SelectItem value="PREVENTIVE_SCHEDULED">Preventive (Scheduled)</SelectItem>
                      <SelectItem value="PREVENTIVE_UNSCHEDULED">Preventive (Unscheduled)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setStatusFilter(value === "ALL" ? null : value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value="DRAFTED">Drafted</SelectItem>
                      <SelectItem value="SUBMITTED">Submitted</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="RECOMMENDED">Recommended</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Docket No</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>SLA Category</TableHead>
                      <TableHead>Est. Completion</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Action</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDockets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                          No maintenance dockets found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDockets.map((docket) => (
                        <TableRow key={docket.id}>
                          <TableCell>{docket.docketNo}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{docket.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[250px]" title={docket.description}>
                                {docket.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatMaintenanceType(docket.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getSLACategoryBadge(docket.slaCategory)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{new Date(docket.estimatedCompletionDate).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(docket.status)}
                              <span className={`ml-2 ${getDocketStatusClass(docket.status)}`}>
                                {docket.status.charAt(0) + docket.status.slice(1).toLowerCase()}
                              </span>
                              {docket.isOverdue && (
                                <Badge variant="destructive" className="ml-2">Overdue</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-500">
                              {new Date(docket.lastActionDate).toLocaleDateString()} by {docket.lastActionBy}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DocketActionButtons 
                              docket={docket} 
                              onViewDetails={viewDocketDetails} 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="open" className="m-0">
              {/* Same table structure as "all" tab but with pre-filtered data */}
              <div className="rounded-md border">
                <Table>
                  {/* Keep table structure the same as "all" tab */}
                  <TableHeader>
                    <TableRow>
                      <TableHead>Docket No</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>SLA Category</TableHead>
                      <TableHead>Est. Completion</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Action</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDockets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                          No maintenance dockets found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDockets.map((docket) => (
                        <TableRow key={docket.id}>
                          <TableCell>{docket.docketNo}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{docket.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[250px]" title={docket.description}>
                                {docket.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatMaintenanceType(docket.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getSLACategoryBadge(docket.slaCategory)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{new Date(docket.estimatedCompletionDate).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(docket.status)}
                              <span className={`ml-2 ${getDocketStatusClass(docket.status)}`}>
                                {docket.status.charAt(0) + docket.status.slice(1).toLowerCase()}
                              </span>
                              {docket.isOverdue && (
                                <Badge variant="destructive" className="ml-2">Overdue</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-500">
                              {new Date(docket.lastActionDate).toLocaleDateString()} by {docket.lastActionBy}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DocketActionButtons 
                              docket={docket} 
                              onViewDetails={viewDocketDetails} 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="critical" className="m-0">
              {/* Same table structure as "all" tab but with pre-filtered data */}
              <div className="rounded-md border">
                <Table>
                  {/* Keep table structure the same as "all" tab */}
                  <TableHeader>
                    <TableRow>
                      <TableHead>Docket No</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>SLA Category</TableHead>
                      <TableHead>Est. Completion</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Action</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDockets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                          No maintenance dockets found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDockets.map((docket) => (
                        <TableRow key={docket.id}>
                          <TableCell>{docket.docketNo}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{docket.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[250px]" title={docket.description}>
                                {docket.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatMaintenanceType(docket.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getSLACategoryBadge(docket.slaCategory)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{new Date(docket.estimatedCompletionDate).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(docket.status)}
                              <span className={`ml-2 ${getDocketStatusClass(docket.status)}`}>
                                {docket.status.charAt(0) + docket.status.slice(1).toLowerCase()}
                              </span>
                              {docket.isOverdue && (
                                <Badge variant="destructive" className="ml-2">Overdue</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-500">
                              {new Date(docket.lastActionDate).toLocaleDateString()} by {docket.lastActionBy}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DocketActionButtons 
                              docket={docket} 
                              onViewDetails={viewDocketDetails} 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="closed" className="m-0">
              {/* Same table structure as "all" tab but with pre-filtered data */}
              <div className="rounded-md border">
                <Table>
                  {/* Keep table structure the same as "all" tab */}
                  <TableHeader>
                    <TableRow>
                      <TableHead>Docket No</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>SLA Category</TableHead>
                      <TableHead>Est. Completion</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Action</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDockets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                          No maintenance dockets found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDockets.map((docket) => (
                        <TableRow key={docket.id}>
                          <TableCell>{docket.docketNo}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{docket.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[250px]" title={docket.description}>
                                {docket.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatMaintenanceType(docket.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getSLACategoryBadge(docket.slaCategory)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{new Date(docket.estimatedCompletionDate).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(docket.status)}
                              <span className={`ml-2 ${getDocketStatusClass(docket.status)}`}>
                                {docket.status.charAt(0) + docket.status.slice(1).toLowerCase()}
                              </span>
                              {docket.isOverdue && (
                                <Badge variant="destructive" className="ml-2">Overdue</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-500">
                              {new Date(docket.lastActionDate).toLocaleDateString()} by {docket.lastActionBy}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DocketActionButtons 
                              docket={docket} 
                              onViewDetails={viewDocketDetails} 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Docket Details Dialog with readOnly prop based on permissions */}
      <DocketDetailsDialog
        docket={selectedDocket}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        onStatusUpdate={handleDocketStatusUpdate}
        readOnly={!userCanManageDockets}
      />

      {/* New Docket Dialog */}
      {userCanManageDockets && (
        <NewDocketDialog 
          isOpen={isNewDocketDialogOpen}
          onClose={() => setIsNewDocketDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default MaintenanceDockets;
