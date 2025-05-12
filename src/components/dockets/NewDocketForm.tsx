
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { MaintenanceType, SLACategory, MaintenanceDocket, DocketCategory } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

interface NewDocketFormProps {
  onClose: () => void;
}

const NewDocketForm = ({ onClose }: NewDocketFormProps) => {
  const { currentUser, sharedDockets } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MaintenanceType>("COMPREHENSIVE");
  const [slaCategory, setSlaCategory] = useState<SLACategory>("NORMAL");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 1 week from now

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !date) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    // Generate a unique ID and docket number
    const id = uuid();
    const currentYear = new Date().getFullYear();
    const docketNumber = `MD-${currentYear}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    console.log("Creating new docket:", { title, description, location });
    
    // Create new docket
    const newDocket: MaintenanceDocket = {
      id,
      docketNo: docketNumber,
      title,
      description,
      type,
      category: "ICT" as DocketCategory, // Default category
      slaCategory,
      submittedBy: currentUser?.name || "Unknown User",
      requestedBy: currentUser?.name || "Unknown User",
      submittedDate: new Date().toISOString(),
      estimatedCompletionDate: date.toISOString(),
      status: "DRAFTED",
      lastActionDate: new Date().toISOString(),
      lastActionBy: currentUser?.name || "Unknown User",
      remarks: "",
      isOverdue: false,
      attachments: { before: [], after: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Add the location field properly
      location: location
    };
    
    // Log the docket for debugging
    console.log("New docket created:", newDocket);
    
    // Add to shared dockets
    sharedDockets.updateDocket(newDocket);
    
    // Log to verify the update function is called
    console.log("Updating shared dockets");
    
    toast.success("Maintenance docket created successfully");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter docket title" 
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Describe the maintenance issue" 
          className="min-h-[100px]" 
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Maintenance Type *</Label>
          <Select value={type} onValueChange={(value) => setType(value as MaintenanceType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COMPREHENSIVE">Comprehensive</SelectItem>
              <SelectItem value="PREVENTIVE_SCHEDULED">Preventive (Scheduled)</SelectItem>
              <SelectItem value="PREVENTIVE_UNSCHEDULED">Preventive (Unscheduled)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="slaCategory">SLA Category *</Label>
          <Select value={slaCategory} onValueChange={(value) => setSlaCategory(value as SLACategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Select SLA category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input 
          id="location" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          placeholder="Enter maintenance location" 
          required
        />
      </div>
      
      <div>
        <Label htmlFor="date">Estimated Completion Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Create Docket</Button>
      </div>
    </form>
  );
};

export default NewDocketForm;
