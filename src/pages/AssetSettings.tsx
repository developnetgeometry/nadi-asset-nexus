
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define types for asset settings
interface AssetSetting {
  id: string;
  name: string;
  description: string;
  type: "CATEGORY" | "TYPE" | "LOCATION" | "BRAND";
}

const AssetSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("categories");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<AssetSetting | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });

  // Mock data for each setting type
  const [categories, setCategories] = useState<AssetSetting[]>([
    { id: "c1", name: "ICT Equipment", description: "Computers, servers, network devices", type: "CATEGORY" },
    { id: "c2", name: "Furniture", description: "Office furniture and fittings", type: "CATEGORY" },
    { id: "c3", name: "Building", description: "Building structural components", type: "CATEGORY" }
  ]);
  
  const [types, setTypes] = useState<AssetSetting[]>([
    { id: "t1", name: "Desktop Computer", description: "Standard office desktop computer", type: "TYPE" },
    { id: "t2", name: "Laptop", description: "Portable computer", type: "TYPE" },
    { id: "t3", name: "Server", description: "Network server equipment", type: "TYPE" }
  ]);
  
  const [locations, setLocations] = useState<AssetSetting[]>([
    { id: "l1", name: "Headquarters", description: "Main office building", type: "LOCATION" },
    { id: "l2", name: "Branch Office", description: "Satellite office location", type: "LOCATION" },
    { id: "l3", name: "Data Center", description: "Primary data center", type: "LOCATION" }
  ]);
  
  const [brands, setBrands] = useState<AssetSetting[]>([
    { id: "b1", name: "Dell", description: "Dell Technologies", type: "BRAND" },
    { id: "b2", name: "HP", description: "Hewlett Packard", type: "BRAND" },
    { id: "b3", name: "Cisco", description: "Cisco Systems", type: "BRAND" }
  ]);

  // Helper to get the current settings based on active tab
  const getCurrentSettings = () => {
    switch (activeTab) {
      case "categories": return categories;
      case "types": return types;
      case "locations": return locations;
      case "brands": return brands;
      default: return categories;
    }
  };

  // Helper to update the current settings based on active tab
  const updateSettings = (newSettings: AssetSetting[]) => {
    switch (activeTab) {
      case "categories": setCategories(newSettings); break;
      case "types": setTypes(newSettings); break;
      case "locations": setLocations(newSettings); break;
      case "brands": setBrands(newSettings); break;
    }
  };

  // Get the setting type based on active tab
  const getSettingType = () => {
    switch (activeTab) {
      case "categories": return "CATEGORY";
      case "types": return "TYPE";
      case "locations": return "LOCATION";
      case "brands": return "BRAND";
      default: return "CATEGORY";
    }
  };

  // Handle opening the add/edit dialog
  const handleOpenDialog = (setting?: AssetSetting) => {
    if (setting) {
      setCurrentSetting(setting);
      setFormData({ name: setting.name, description: setting.description });
    } else {
      setCurrentSetting(null);
      setFormData({ name: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle saving the setting
  const handleSaveSetting = () => {
    const settings = getCurrentSettings();
    
    if (currentSetting) {
      // Edit mode
      const updatedSettings = settings.map(s => 
        s.id === currentSetting.id ? { ...currentSetting, ...formData } : s
      );
      updateSettings(updatedSettings);
      toast({
        title: "Setting Updated",
        description: `${formData.name} has been updated successfully.`
      });
    } else {
      // Add mode
      const newSetting: AssetSetting = {
        id: `new-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        type: getSettingType()
      };
      updateSettings([...settings, newSetting]);
      toast({
        title: "Setting Added",
        description: `${formData.name} has been added successfully.`
      });
    }
    
    setIsDialogOpen(false);
  };

  // Handle deleting a setting
  const handleDeleteSetting = (settingId: string) => {
    if (confirm("Are you sure you want to delete this setting? This action cannot be undone.")) {
      const settings = getCurrentSettings();
      const updatedSettings = settings.filter(s => s.id !== settingId);
      updateSettings(updatedSettings);
      
      const settingName = settings.find(s => s.id === settingId)?.name;
      toast({
        title: "Setting Deleted",
        description: `${settingName} has been deleted successfully.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asset Settings</h1>
        <p className="text-muted-foreground">
          Manage asset categories, types, locations, and brands for the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Configuration</CardTitle>
          <CardDescription>
            Configure settings for assets in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="brands">Brands</TabsTrigger>
            </TabsList>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Asset Categories</h3>
                <Button onClick={() => handleOpenDialog()} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </div>
              <SettingsTable 
                settings={categories} 
                onEdit={handleOpenDialog}
                onDelete={handleDeleteSetting}
              />
            </TabsContent>

            {/* Types Tab */}
            <TabsContent value="types" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Asset Types</h3>
                <Button onClick={() => handleOpenDialog()} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Type
                </Button>
              </div>
              <SettingsTable 
                settings={types} 
                onEdit={handleOpenDialog}
                onDelete={handleDeleteSetting}
              />
            </TabsContent>

            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Asset Locations</h3>
                <Button onClick={() => handleOpenDialog()} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Location
                </Button>
              </div>
              <SettingsTable 
                settings={locations} 
                onEdit={handleOpenDialog}
                onDelete={handleDeleteSetting}
              />
            </TabsContent>

            {/* Brands Tab */}
            <TabsContent value="brands" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Asset Brands</h3>
                <Button onClick={() => handleOpenDialog()} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Brand
                </Button>
              </div>
              <SettingsTable 
                settings={brands} 
                onEdit={handleOpenDialog}
                onDelete={handleDeleteSetting}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentSetting ? `Edit ${currentSetting.name}` : `Add New ${getSingularName(activeTab)}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder={`Enter ${getSingularName(activeTab)} name`}
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description" 
                placeholder={`Enter a description`}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSetting}>
              {currentSetting ? 'Update' : 'Add'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for the settings table
interface SettingsTableProps {
  settings: AssetSetting[];
  onEdit: (setting: AssetSetting) => void;
  onDelete: (id: string) => void;
}

const SettingsTable = ({ settings, onEdit, onDelete }: SettingsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
              No settings found. Add one to get started.
            </TableCell>
          </TableRow>
        ) : (
          settings.map(setting => (
            <TableRow key={setting.id}>
              <TableCell className="font-medium">{setting.name}</TableCell>
              <TableCell>{setting.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(setting)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(setting.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

// Helper function to get singular name for tab
const getSingularName = (tab: string): string => {
  switch (tab) {
    case "categories": return "Category";
    case "types": return "Type";
    case "locations": return "Location";
    case "brands": return "Brand";
    default: return "";
  }
};

export default AssetSettings;
