
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AssetSetting } from "@/types";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for asset settings
const initialAssetSettings: Record<string, AssetSetting[]> = {
  categories: [
    {
      id: "cat1",
      category: "Hardware",
      subcategories: ["Laptops", "Desktops", "Servers", "Networking"],
      brands: ["HP", "Dell", "Lenovo", "Cisco"],
      locations: ["Office A", "Office B", "Data Center"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cat2",
      category: "Software",
      subcategories: ["Operating Systems", "Office Tools", "Security Software"],
      brands: ["Microsoft", "Adobe", "Oracle", "Symantec"],
      locations: ["Cloud Services", "Local Servers"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  locations: [
    {
      id: "loc1",
      category: "Headquarters",
      subcategories: ["Floor 1", "Floor 2", "Floor 3"],
      brands: [],
      locations: ["Kuala Lumpur"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "loc2",
      category: "Branch Office",
      subcategories: ["Reception", "Office Space", "Meeting Rooms"],
      brands: [],
      locations: ["Penang", "Johor", "Sabah"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  brands: [
    {
      id: "brand1",
      category: "IT Equipment",
      subcategories: [],
      brands: ["HP", "Dell", "Lenovo", "Apple", "Cisco", "Juniper"],
      locations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "brand2",
      category: "Office Equipment",
      subcategories: [],
      brands: ["Canon", "Epson", "Brother", "Sharp", "Fuji Xerox"],
      locations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

type AssetSettingsType = "categories" | "locations" | "brands";

const AssetSettings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<AssetSettingsType>("categories");
  const [assetSettings, setAssetSettings] = useState<Record<string, AssetSetting[]>>(
    initialAssetSettings
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<AssetSetting | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategories, setNewSubcategories] = useState("");
  const [newBrands, setNewBrands] = useState("");
  const [newLocations, setNewLocations] = useState("");

  // Function to add new setting
  const handleAdd = () => {
    setCurrentItem(null);
    setNewCategory("");
    setNewSubcategories("");
    setNewBrands("");
    setNewLocations("");
    setIsDialogOpen(true);
  };

  // Function to edit setting
  const handleEdit = (item: AssetSetting) => {
    setCurrentItem(item);
    setNewCategory(item.category);
    setNewSubcategories(item.subcategories.join(", "));
    setNewBrands(item.brands.join(", "));
    setNewLocations(item.locations.join(", "));
    setIsDialogOpen(true);
  };

  // Function to delete setting
  const handleDelete = (id: string) => {
    const updatedSettings = { ...assetSettings };
    updatedSettings[activeTab] = assetSettings[activeTab].filter((item) => item.id !== id);
    setAssetSettings(updatedSettings);
    toast.success("Item deleted successfully");
  };

  // Function to save setting
  const handleSave = () => {
    if (!newCategory) {
      toast.error("Category name is required");
      return;
    }

    const subcategories = newSubcategories
      ? newSubcategories.split(",").map((item) => item.trim())
      : [];
    const brands = newBrands ? newBrands.split(",").map((item) => item.trim()) : [];
    const locations = newLocations ? newLocations.split(",").map((item) => item.trim()) : [];

    const updatedSettings = { ...assetSettings };

    if (currentItem) {
      // Edit existing item
      updatedSettings[activeTab] = assetSettings[activeTab].map((item) =>
        item.id === currentItem.id
          ? {
              ...item,
              category: newCategory,
              subcategories,
              brands,
              locations,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      toast.success("Settings updated successfully");
    } else {
      // Add new item
      const newItem: AssetSetting = {
        id: uuid(),
        category: newCategory,
        subcategories,
        brands,
        locations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedSettings[activeTab] = [...assetSettings[activeTab], newItem];
      toast.success("New setting added successfully");
    }

    setAssetSettings(updatedSettings);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asset Settings</h1>
        <p className="text-muted-foreground">
          Manage asset categories, locations, brands and other settings
        </p>
      </div>

      <Tabs defaultValue="categories" value={activeTab} onValueChange={(v) => setActiveTab(v as AssetSettingsType)} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
          </TabsList>
          <Button onClick={handleAdd} className="flex items-center gap-1">
            <Plus size={16} /> Add New
          </Button>
        </div>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetSettings.categories.map((setting) => (
              <SettingCard
                key={setting.id}
                setting={setting}
                onEdit={() => handleEdit(setting)}
                onDelete={() => handleDelete(setting.id)}
                type="category"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetSettings.locations.map((setting) => (
              <SettingCard
                key={setting.id}
                setting={setting}
                onEdit={() => handleEdit(setting)}
                onDelete={() => handleDelete(setting.id)}
                type="location"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="brands" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetSettings.brands.map((setting) => (
              <SettingCard
                key={setting.id}
                setting={setting}
                onEdit={() => handleEdit(setting)}
                onDelete={() => handleDelete(setting.id)}
                type="brand"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentItem ? "Edit Setting" : "Add New Setting"}</DialogTitle>
            <DialogDescription>
              {currentItem
                ? "Update the details for this asset setting."
                : "Create a new asset setting with the details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Name
              </Label>
              <Input
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="col-span-3"
                placeholder={`Enter ${activeTab.slice(0, -1)} name`}
              />
            </div>

            {activeTab === "categories" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subcategories" className="text-right">
                  Subcategories
                </Label>
                <Input
                  id="subcategories"
                  value={newSubcategories}
                  onChange={(e) => setNewSubcategories(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter subcategories (comma separated)"
                />
              </div>
            )}

            {activeTab !== "brands" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brands" className="text-right">
                  Brands
                </Label>
                <Input
                  id="brands"
                  value={newBrands}
                  onChange={(e) => setNewBrands(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter brands (comma separated)"
                />
              </div>
            )}

            {activeTab !== "locations" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="locations" className="text-right">
                  Locations
                </Label>
                <Input
                  id="locations"
                  value={newLocations}
                  onChange={(e) => setNewLocations(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter locations (comma separated)"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface SettingCardProps {
  setting: AssetSetting;
  onEdit: () => void;
  onDelete: () => void;
  type: "category" | "location" | "brand";
}

const SettingCard = ({ setting, onEdit, onDelete, type }: SettingCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{setting.category}</CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {type === "category" && setting.subcategories.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Subcategories:</h4>
            <div className="flex flex-wrap gap-1">
              {setting.subcategories.map((sub, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        {type !== "brand" && setting.brands.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Brands:</h4>
            <div className="flex flex-wrap gap-1">
              {setting.brands.map((brand, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}

        {type !== "location" && setting.locations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Locations:</h4>
            <div className="flex flex-wrap gap-1">
              {setting.locations.map((location, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetSettings;
