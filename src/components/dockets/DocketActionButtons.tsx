
import { Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { canManageMaintenance } from "@/config/permissions";
import { MaintenanceDocket } from "@/types";

interface DocketActionButtonsProps {
  docket: MaintenanceDocket;
  onViewDetails: (docket: MaintenanceDocket) => void;
}

const DocketActionButtons = ({ docket, onViewDetails }: DocketActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        title="View Details"
        onClick={() => onViewDetails(docket)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" title="Comments">
        <MessageSquare className="h-4 w-4" />
        {Math.floor(Math.random() * 5) > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {Math.floor(Math.random() * 5) + 1}
          </span>
        )}
      </Button>
    </div>
  );
};

export default DocketActionButtons;
