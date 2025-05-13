
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewDocketForm from "./NewDocketForm";

interface NewDocketDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewDocketDialog = ({ isOpen, onClose }: NewDocketDialogProps) => {
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
