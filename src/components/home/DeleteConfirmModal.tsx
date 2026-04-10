"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import DialogLayout from "@/layouts/DialogLayout";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Delete Message",
  description = "Are you sure you want to delete this message? This action cannot be undone.",
}) => {
  return (
    <DialogLayout
      open={isOpen}
      handleOpenChange={onClose}
      title={title}
      description={description}
      contentClass="max-w-md w-full"
      dialogOverlayClass="backdrop-blur-[2px] bg-black/30"
    >
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </DialogLayout>
  );
};

export default DeleteConfirmModal;
