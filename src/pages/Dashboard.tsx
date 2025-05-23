
import { BarChart4, Box, CheckCircle, Clock, AlertCircle, Wrench, Search, Filter, Download, Eye, Settings, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { mockKPIStats, mockAssets } from "../data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { AssetStatus, UserRole, Asset } from "../types";
import { AssetDetailsDialog } from "@/components/assets/AssetDetailsDialog";
import { SiteSelector } from "@/components/assets/SiteSelector";
import { useNavigate } from "react-router-dom";

// Define roles that can create/edit assets
const CRUD_ASSETS_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE"];

// Define admin roles that need to select a site
const ADMIN_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION"];
const Dashboard = () => {
  const {
    currentUser,
    checkPermission
  } = useAuth();
  const canManageAssets = checkPermission(CRUD_ASSETS_ROLES);
  const isAdmin = checkPermission(ADMIN_ROLES);
  const isTpSite = currentUser?.role === "TP_SITE";
  const navigate = useNavigate();

  // Site selection state
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showSiteSelector, setShowSiteSelector] = useState(true);

  // Asset details dialog state
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetDetailsOpen, setAssetDetailsOpen] = useState(false);

  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique sites from assets
  const sites = Array.from(new Set(mockAssets.map(asset => asset.location_id)));

  // Get site statistics by location
  const siteStatistics = sites.map(site => {
    const siteAssets = mockAssets.filter(asset => asset.location_id === site);
    const totalAssets = siteAssets.length;
    const activeAssets = siteAssets.filter(asset => asset.status === "ACTIVE").length;
    const underRepairAssets = siteAssets.filter(asset => asset.status === "UNDER_REPAIR").length;

    // Get location information
    return {
      siteId: site,
      name: site, // Using siteId as name since we don't have a separate name field
      state: "Unknown", // Default state since it's not in the Asset type
      totalAssets,
      activeAssets,
      underRepairAssets
    };
  });

  // Filter sites based on search term
  const filteredSites = siteStatistics.filter(site => 
    site.siteId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter assets based on selected site
  const siteAssets = selectedSite ? mockAssets.filter(asset => asset.location_id === selectedSite) : mockAssets;

  // Count assets by status (for all assets)
  const totalAssets = mockAssets.length;
  const activeAssets = mockAssets.filter(asset => asset.status === "ACTIVE").length;
  const underRepairAssets = mockAssets.filter(asset => asset.status === "UNDER_REPAIR").length;

  // Count assets by status (for selected site)
  const siteTotalAssets = siteAssets.length;
  const siteActiveAssets = siteAssets.filter(asset => asset.status === "ACTIVE").length;
  const siteUnderRepairAssets = siteAssets.filter(asset => asset.status === "UNDER_REPAIR").length;
  
  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setAssetDetailsOpen(true);
  };
  
  const handleSiteSelect = (site: string) => {
    setSelectedSite(site);
    setShowSiteSelector(false);
  };
  
  const handleBackToSites = () => {
    setShowSiteSelector(true);
    setSelectedSite(null);
  };

  // Set default site for TP_SITE users
  useEffect(() => {
    if (currentUser && currentUser.role === "TP_SITE" && currentUser.siteId) {
      setSelectedSite(currentUser.siteId);
      setShowSiteSelector(false);
    } else if (currentUser && isAdmin) {
      setShowSiteSelector(true);
      setSelectedSite(null);
    }
  }, [currentUser, isAdmin]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all registered assets in the system
          </p>
        </div>
        {canManageAssets && !showSiteSelector && (
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add New Asset
          </Button>
        )}
      </div>

      {/* Site Selector for Admin Roles */}
      {isAdmin && showSiteSelector ? (
        <>
          {/* Summary Cards - Show totals for all assets */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Total Assets</p>
                  <div className="flex items-baseline">
                    <h3 className="text-3xl font-bold">{totalAssets}</h3>
                    <p className="ml-2 text-sm text-gray-500">Assets registered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Active Assets</p>
                  <div className="flex items-baseline">
                    <h3 className="text-3xl font-bold text-green-600">{activeAssets}</h3>
                    <p className="ml-2 text-sm text-gray-500">Currently in use</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Under Maintenance</p>
                  <div className="flex items-baseline">
                    <h3 className="text-3xl font-bold text-red-600">{underRepairAssets}</h3>
                    <p className="ml-2 text-sm text-gray-500">Being serviced</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sites Table */}
          <Card>
            <CardHeader>
              <CardTitle>Nadi Sites</CardTitle>
              <CardDescription>
                Select a site to view its assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-10" placeholder="Search sites..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">No.</TableHead>
                      <TableHead>Site ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Total Assets</TableHead>
                      <TableHead>Active Assets</TableHead>
                      <TableHead>Under Maintenance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                          No sites found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSites.map((site, index) => (
                        <TableRow key={site.siteId}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{site.siteId}</TableCell>
                          <TableCell>{site.name}</TableCell>
                          <TableCell>{site.state}</TableCell>
                          <TableCell>{site.totalAssets}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">{site.activeAssets}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">{site.underRepairAssets}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end items-center space-x-1">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-md border-indigo-200" onClick={() => handleSiteSelect(site.siteId)}>
                                <Eye className="h-4 w-4 text-indigo-600" />
                              </Button>
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
        </>
      ) : (
        <>
          {/* Back button - Only show for admins who can change sites */}
          {isAdmin && (
            <Button 
              variant="outline" 
              onClick={handleBackToSites} 
              className="mb-4 flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sites
            </Button>
          )}

          {/* If a site is selected, show site-specific stats */}
          {selectedSite && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Site: {selectedSite}</CardTitle>
                    <CardDescription>Asset statistics for this site</CardDescription>
                  </div>
                  {/* Only show Change Site button for admin users */}
                  {isAdmin && (
                    <Button variant="outline" onClick={() => setShowSiteSelector(true)}>
                      Change Site
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Site Assets</p>
                    <div className="flex items-baseline mt-1">
                      <h3 className="text-2xl font-bold">{siteTotalAssets}</h3>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Site Assets</p>
                    <div className="flex items-baseline mt-1">
                      <h3 className="text-2xl font-bold text-green-600">{siteActiveAssets}</h3>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Under Maintenance</p>
                    <div className="flex items-baseline mt-1">
                      <h3 className="text-2xl font-bold text-red-600">{siteUnderRepairAssets}</h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Asset List */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-10" placeholder="Search assets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">No.</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-32 text-gray-500">
                          No assets found for this site
                        </TableCell>
                      </TableRow>
                    ) : (
                      siteAssets.map((asset, index) => (
                        <TableRow key={asset.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{asset.item_name}</TableCell>
                          <TableCell>{asset.category}</TableCell>
                          <TableCell>{asset.qty_unit}</TableCell>
                          <TableCell>{asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell>
                            <Badge className={asset.status === "ACTIVE" ? "bg-green-100 text-green-800" : asset.status === "UNDER_REPAIR" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}>
                              {asset.status === "ACTIVE" ? "Active" : asset.status === "UNDER_REPAIR" ? "Under Repair" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end items-center space-x-1">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-md border-indigo-200" onClick={() => handleViewAsset(asset)}>
                                <Eye className="h-4 w-4 text-indigo-600" />
                              </Button>
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
          
          {/* Asset Details Dialog */}
          {selectedAsset && <AssetDetailsDialog open={assetDetailsOpen} onOpenChange={setAssetDetailsOpen} asset={selectedAsset} />}
        </>
      )}
    </div>
  );
};

export default Dashboard;
