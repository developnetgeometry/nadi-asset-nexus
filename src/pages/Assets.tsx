import { useState } from "react";
import { 
  Box, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Image,
  Eye
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAssets } from "../data/mockData";
import { Asset, AssetStatus, UserRole } from "../types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewAssetDialog } from "@/components/assets/NewAssetDialog";
import { toast } from "@/hooks/use-toast";
import { AssetDetailsDialog } from "@/components/assets/AssetDetailsDialog";
import { useAuth } from "../contexts/AuthContext";

// Define roles that can create/edit assets
const CRUD_ASSETS_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE"];

const Assets = () => {
  const { checkPermission } = useAuth();
  const canManageAssets = checkPermission(CRUD_ASSETS_ROLES);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [newAssetDialogOpen, setNewAssetDialogOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [assetDetailsOpen, setAssetDetailsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(assets.map(asset => asset.category)));

  const getStatusIcon = (status: AssetStatus) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "UNDER_REPAIR":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "RETIRED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "UNDER_REPAIR":
        return "bg-orange-100 text-orange-800";
      case "RETIRED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAssets = assets.filter(asset => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      asset.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location_id.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by status if selected
    const matchesStatus = statusFilter === null || asset.status === statusFilter;
    
    // Filter by category if selected
    const matchesCategory = categoryFilter === null || asset.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API
    if (assetToDelete) {
      setAssets(assets.filter(asset => asset.id !== assetToDelete.id));
      toast({
        title: "Asset deleted",
        description: `${assetToDelete.item_name} has been removed from assets.`,
      });
    }
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
  };

  const handleAssetAdded = (newAsset: Asset) => {
    setAssets(prevAssets => [newAsset, ...prevAssets]);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetDetailsOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setAssetToEdit(asset);
    setEditAssetDialogOpen(true);
  };

  const handleAssetUpdated = (updatedAsset: Asset) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
    
    toast({
      title: "Asset updated",
      description: `${updatedAsset.item_name} has been successfully updated.`,
    });
    
    setEditAssetDialogOpen(false);
    setAssetToEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all registered assets in the system
          </p>
        </div>
        {canManageAssets && (
          <Button onClick={() => setNewAssetDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Asset
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>A comprehensive list of all registered assets in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10" 
                placeholder="Search assets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={(value) => setStatusFilter(value === "ALL" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setCategoryFilter(value === "ALL" ? null : value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mobility</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center h-32 text-gray-500">
                      No assets found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                            <Box className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{asset.item_name}</div>
                            <div className="text-sm text-gray-500">
                              {asset.remark?.substring(0, 20) || "No description"}
                              {asset.remark && asset.remark.length > 20 ? "..." : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{asset.brand_id}</TableCell>
                      <TableCell>{asset.serial_number}</TableCell>
                      <TableCell>{asset.qty_unit}</TableCell>
                      <TableCell className="max-w-xs truncate" title={asset.location_id}>
                        {asset.location_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(asset.status)}
                          <Badge className={`ml-2 ${getStatusColor(asset.status)}`}>
                            {asset.status === "ACTIVE" ? "Active" : 
                             asset.status === "UNDER_REPAIR" ? "Under Repair" : "Retired"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{asset.asset_mobility}</TableCell>
                      <TableCell>
                        {asset.photo ? (
                          <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                            <Image className="h-4 w-4 text-gray-600" />
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewAsset(asset)}
                          >
                            <span className="sr-only">View details</span>
                            <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </Button>
                          {canManageAssets && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditClick(asset)}
                              >
                                <span className="sr-only">Edit asset</span>
                                <Edit className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteClick(asset)}
                              >
                                <span className="sr-only">Delete asset</span>
                                <Trash2 className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the asset "{assetToDelete?.item_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Asset Dialog */}
      <NewAssetDialog 
        open={newAssetDialogOpen}
        onOpenChange={setNewAssetDialogOpen}
        onAssetAdded={handleAssetAdded}
      />

      {/* Edit Asset Dialog */}
      {assetToEdit && (
        <NewAssetDialog 
          open={editAssetDialogOpen}
          onOpenChange={setEditAssetDialogOpen}
          onAssetAdded={handleAssetUpdated}
          assetToEdit={assetToEdit}
          isEditing={true}
        />
      )}

      {/* Asset Details Dialog */}
      {selectedAsset && (
        <AssetDetailsDialog
          open={assetDetailsOpen}
          onOpenChange={setAssetDetailsOpen}
          asset={selectedAsset}
        />
      )}
    </div>
  );
};

export default Assets;
