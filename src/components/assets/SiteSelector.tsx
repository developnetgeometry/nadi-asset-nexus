
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { mockAssets } from "@/data/mockData";

interface SiteSelectorProps {
  onSiteSelect: (site: string) => void;
  showHeader?: boolean;
}

export const SiteSelector = ({ onSiteSelect, showHeader = true }: SiteSelectorProps) => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Get unique sites from assets
  const sites = Array.from(new Set(mockAssets.map(asset => asset.location_id)));

  const handleSiteSelect = (site: string) => {
    setSelectedSite(site);
    onSiteSelect(site);
  };

  return (
    <Card className="mb-6">
      {showHeader && (
        <CardHeader>
          <CardTitle>Select Nadi Site</CardTitle>
          <CardDescription>
            Please select a site to view its assets
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <RadioGroup 
          value={selectedSite || ""} 
          onValueChange={handleSiteSelect}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {sites.map((site) => (
            <div key={site} className="flex items-center space-x-2 border rounded-md p-3 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer">
              <RadioGroupItem value={site} id={site} />
              <Label htmlFor={site} className="cursor-pointer">{site}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
