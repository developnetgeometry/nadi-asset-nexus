
import { Edit, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Asset } from "@/types";
import { canManageAssets } from "@/config/permissions";

interface AssetActionButtonsProps {
  asset: Asset;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
}

const AssetActionButtons = ({ asset, onEdit, onDelete }: AssetActionButtonsProps) => {
  const { currentUser } = useAuth();
  
  // Check if the user can manage assets
  const canManage = currentUser ? canManageAssets(currentUser.role) : false;
  
  if (!canManage) {
    return (
      <div className="text-right text-gray-400 text-sm">
        View only
      </div>
    );
  }

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit && onEdit(asset)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete && onDelete(asset)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AssetActionButtons;
