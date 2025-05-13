
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewDocketForm from "./NewDocketForm";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface NewDocketDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define roles that can create maintenance dockets
const CRUD_MAINTENANCE_ROLES: UserRole[] = ["SUPER_ADMIN", "TP_ADMIN", "TP_OPERATION", "TP_PIC", "TP_SITE"];

const NewDocketDialog = ({ isOpen, onClose }: NewDocketDialogProps) => {
  const { checkPermission } = useAuth();
  const canCreateDockets = checkPermission(CRUD_MAINTENANCE_ROLES);

  // If user doesn't have permission to create dockets, don't render the dialog
  if (!canCreateDockets) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Maintenance Request</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new maintenance docket.
          </DialogDescription>
        </DialogHeader>
        <NewDocketForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default NewDocketDialog;
