"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import DialogLayout from "@/layouts/DialogLayout";
import { useTranslations } from "next-intl";

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
  title,
  description,
}) => {
  const t = useTranslations("HomePage");
  
  return (
    <DialogLayout
      open={isOpen}
      handleOpenChange={onClose}
      title={title || t("MessageList.modal.permDeleteMessage")}
      description={description || t("MessageList.modal.permDeleteConfirm")}
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
          {t("cancel")}
        </Button>
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? t("deleting") : t("delete")}
        </Button>
      </div>
    </DialogLayout>
  );
};

export default DeleteConfirmModal;
