
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Search, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { mockAssets } from "@/data/mockData";
import { UserRole } from "@/types";

// Define admin roles that need to select a site
const ADMIN_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION"];

const MaintenanceSiteSelector = () => {
  const { currentUser, checkPermission } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const isAdmin = checkPermission(ADMIN_ROLES);
  const isTpSite = currentUser?.role === "TP_SITE";
  
  // Get unique sites from assets
  const sites = Array.from(new Set(mockAssets.map(asset => asset.location_id)));

  // Get site statistics
  const siteStatistics = sites.map(site => {
    const siteAssets = mockAssets.filter(asset => asset.location_id === site);
    const totalAssets = siteAssets.length;
    const activeAssets = siteAssets.filter(asset => asset.status === "ACTIVE").length;
    const underRepairAssets = siteAssets.filter(asset => asset.status === "UNDER_REPAIR").length;

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

  const handleViewSite = (siteId: string) => {
    navigate(`/maintenance/dockets/${siteId}`);
  };

  // Redirect TP_SITE users to their specific site
  if (isTpSite && currentUser && currentUser.site) {
    navigate(`/maintenance/dockets/${currentUser.site}`);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance Dockets</h1>
          <p className="text-muted-foreground">
            Select a site to view its maintenance dockets
          </p>
        </div>
      </div>

      {/* Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nadi Sites</CardTitle>
          <CardDescription>
            Select a site to view its maintenance dockets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-10" placeholder="Search sites..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-md border-indigo-200" onClick={() => handleViewSite(site.siteId)}>
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
    </div>
  );
};

export default MaintenanceSiteSelector;
