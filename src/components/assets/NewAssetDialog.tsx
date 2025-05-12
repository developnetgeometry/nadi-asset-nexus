
import { useState } from "react";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import { mockAssets } from "../../data/mockData";
import { Asset } from "@/types";
import { toast } from "@/hooks/use-toast";

// Form validation schema
const assetFormSchema = z.object({
  item_name: z.string().min(1, "Asset name is required"),
  brand_id: z.string().optional(),
  serial_number: z.string().min(1, "Serial number is required"),
  qty_unit: z.coerce.number().min(1, "Quantity must be at least 1"),
  date_install: z.string().optional(),
  date_expired: z.string().optional(),
  date_warranty_tp: z.string().optional(),
  date_warranty_supplier: z.string().optional(),
  location_id: z.string().min(1, "Location is required"),
  asset_mobility: z.enum(["Moveable", "Immovable"]),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["ACTIVE", "UNDER_REPAIR", "RETIRED"]),
  remark: z.string().optional(),
  photo: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

interface NewAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssetAdded: (asset: Asset) => void;
}

export const NewAssetDialog = ({
  open,
  onOpenChange,
  onAssetAdded,
}: NewAssetDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      item_name: "",
      brand_id: "",
      serial_number: "",
      qty_unit: 1,
      location_id: "",
      asset_mobility: "Moveable",
      category: "ICT",
      status: "ACTIVE",
      remark: "",
    },
  });

  const onSubmit = (values: AssetFormValues) => {
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const newAsset: Asset = {
        id: uuidv4(),
        name: values.item_name,
        item_name: values.item_name,
        brand_id: values.brand_id || "default - None",
        serial_number: values.serial_number,
        qty_unit: values.qty_unit,
        date_expired: values.date_expired,
        date_install: values.date_install,
        date_warranty_tp: values.date_warranty_tp,
        date_warranty_supplier: values.date_warranty_supplier,
        location_id: values.location_id,
        asset_mobility: values.asset_mobility,
        photo: values.photo,
        remark: values.remark,
        status: values.status,
        category: values.category,
        type: values.category, // Using category as type for now
        model: values.brand_id || undefined,
        description: values.remark,
        location: values.location_id,
        purchaseDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAssetAdded(newAsset);
      toast({
        title: "Asset added successfully",
        description: `${values.item_name} has been added to assets.`,
      });
      
      form.reset();
      onOpenChange(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Fill in the details for the new asset. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="item_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter asset name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qty_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity in Units*</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_install"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_expired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_warranty_tp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty (TP) Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_warranty_supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty (Supplier) Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormDescription>E.g. Surfing Area</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ICT">ICT</SelectItem>
                        <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                        <SelectItem value="PLUMBING">Plumbing</SelectItem>
                        <SelectItem value="HVAC">HVAC</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset_mobility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Mobility*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Moveable">Moveable</SelectItem>
                        <SelectItem value="Immovable">Immovable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
                        <SelectItem value="RETIRED">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional notes about the asset" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo upload would be implemented here in a real app */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <p className="text-sm text-gray-500">
                        Drag and drop image here, or click to select file
                      </p>
                      {/* This is a placeholder - actual file upload would be implemented in a real app */}
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          // Simulating photo upload URL
                          if (e.target.files?.[0]) {
                            field.onChange("photo-placeholder-url.jpg");
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Asset"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
