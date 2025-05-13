import { useState, useEffect } from "react";
import { Image } from "lucide-react";
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
import { Asset } from "@/types";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  model: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

interface NewAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssetAdded: (asset: Asset) => void;
  assetToEdit?: Asset;
  isEditing?: boolean;
}

export const NewAssetDialog = ({
  open,
  onOpenChange,
  onAssetAdded,
  assetToEdit,
  isEditing = false,
}: NewAssetDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      item_name: "",
      brand_id: "default - None",
      serial_number: "",
      qty_unit: 1,
      location_id: "",
      asset_mobility: "Moveable",
      category: "ICT",
      status: "ACTIVE",
      remark: "",
      model: "",
    },
  });

  // If editing, populate the form with asset data
  useEffect(() => {
    if (isEditing && assetToEdit) {
      form.reset({
        item_name: assetToEdit.item_name,
        brand_id: assetToEdit.brand_id || "default - None",
        serial_number: assetToEdit.serial_number || "",
        qty_unit: assetToEdit.qty_unit || 1,
        date_install: assetToEdit.date_install || "",
        date_expired: assetToEdit.date_expired || "",
        date_warranty_tp: assetToEdit.date_warranty_tp || "",
        date_warranty_supplier: assetToEdit.date_warranty_supplier || "",
        location_id: assetToEdit.location_id || "",
        asset_mobility: assetToEdit.asset_mobility as "Moveable" | "Immovable",
        category: assetToEdit.category || "ICT",
        status: assetToEdit.status,
        remark: assetToEdit.remark || "",
        model: assetToEdit.model || "",
      });
      
      if (assetToEdit.photo) {
        setPhotoPreview(assetToEdit.photo);
      }
    }
  }, [assetToEdit, isEditing, form]);

  const onSubmit = (values: AssetFormValues) => {
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const newAsset: Asset = isEditing && assetToEdit 
        ? {
            ...assetToEdit,
            item_name: values.item_name,
            name: values.item_name,
            brand_id: values.brand_id || "default - None",
            serial_number: values.serial_number,
            qty_unit: values.qty_unit,
            date_expired: values.date_expired,
            date_install: values.date_install,
            date_warranty_tp: values.date_warranty_tp,
            date_warranty_supplier: values.date_warranty_supplier,
            location_id: values.location_id,
            asset_mobility: values.asset_mobility,
            photo: photoPreview || values.photo,
            remark: values.remark,
            status: values.status,
            category: values.category,
            type: values.category, // Using category as type for now
            model: values.model || "",
            updatedAt: new Date().toISOString(),
          }
        : {
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
            photo: photoPreview || values.photo,
            remark: values.remark,
            status: values.status,
            category: values.category,
            type: values.category, // Using category as type for now
            model: values.model || "",
            description: values.remark,
            location: values.location_id,
            purchaseDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

      onAssetAdded(newAsset);
      toast({
        title: isEditing ? "Asset updated successfully" : "Asset added successfully",
        description: `${values.item_name} has been ${isEditing ? 'updated' : 'added'} to assets.`,
      });
      
      form.reset();
      setPhotoPreview(null);
      onOpenChange(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoPreview(event.target.result as string);
          form.setValue('photo', 'photo-uploaded.jpg');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Asset" : "Add New Asset"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details for this asset. Click save when you're done."
              : "Fill in the details for the new asset. Click save when you're done."
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <Input placeholder="default - None" {...field} />
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
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model" {...field} />
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
                        value={field.value}
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
                        value={field.value}
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
                        value={field.value}
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
                        placeholder="Description of the asset (Optional)" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo upload */}
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo to upload</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        {photoPreview ? (
                          <div className="space-y-2">
                            <img 
                              src={photoPreview} 
                              alt="Asset preview" 
                              className="mx-auto h-40 w-auto object-cover rounded-md"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setPhotoPreview(null);
                                field.onChange("");
                              }}
                            >
                              Remove photo
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-center">
                              <Image className="h-12 w-12 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">
                              Drag and drop image here, or click to select file
                            </p>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => document.getElementById('photo-upload')?.click()}
                            >
                              Choose photo
                            </Button>
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Asset" : "Save Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
