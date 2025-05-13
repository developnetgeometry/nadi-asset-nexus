
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Asset } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Image } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssetDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset;
}

export const AssetDetailsDialog = ({ open, onOpenChange, asset }: AssetDetailsDialogProps) => {
  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Asset Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="h-24 w-24 rounded-md bg-gray-100 flex items-center justify-center mr-4">
                {asset.photo ? (
                  <img 
                    src={asset.photo} 
                    alt={asset.item_name} 
                    className="h-full w-full object-cover rounded-md" 
                  />
                ) : (
                  <Image className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{asset.item_name}</h2>
                <div className="flex items-center mt-2">
                  {getStatusIcon(asset.status)}
                  <Badge className={`ml-2 ${getStatusColor(asset.status)}`}>
                    {asset.status === "ACTIVE" ? "Active" : 
                     asset.status === "UNDER_REPAIR" ? "Under Repair" : "Retired"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium">{asset.brand_id || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{asset.category || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium">{asset.serial_number || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium">{asset.qty_unit || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{asset.location_id || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Mobility</p>
                <p className="font-medium">{asset.asset_mobility || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{asset.model || "N/A"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Acquisition Date</p>
                <p className="font-medium">{asset.acquisition_date || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Description/Remarks</p>
              <p className="font-medium">{asset.remark || "No description provided"}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
