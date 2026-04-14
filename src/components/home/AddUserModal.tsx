"use client";
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DialogLayout from "@/layouts/DialogLayout";
import { useTranslations } from "next-intl";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  addEmailVal: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddEmail: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  filteredEmails: string[];
  emailLists: string[];
  onRemoveEmail: (email: string) => void;
  searchVal: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    addPeople?: string;
    message?: string;
    addEmail?: string;
  };
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  addEmailVal,
  onEmailChange,
  onAddEmail,
  onKeyDown,
  filteredEmails,
  emailLists,
  onRemoveEmail,
  searchVal,
  onSearchChange,
  errors,
}) => {
  const t = useTranslations("HomePage.AddUserModal");

  return (
    <DialogLayout
      open={isOpen}
      contentClass="max-w-md w-full"
      dialogOverlayClass="backdrop-blur-[2px] bg-black/30"
      handleOpenChange={onClose}
      title={t("title")}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-3 w-full">
          <div className="w-full">
            <Input
              placeholder={t("enterEmail")}
              type="email"
              value={addEmailVal}
              onChange={onEmailChange}
              onKeyDown={onKeyDown}
              className={errors.addEmail ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>
          <Button
            className="cursor-pointer"
            onClick={onAddEmail}
            disabled={!addEmailVal.length}
          >
            {t("add")}
          </Button>
        </div>
        {errors.addEmail && (
          <p className="text-red-500 text-xs font-medium">{errors.addEmail}</p>
        )}
      </div>

      {(filteredEmails.length > 0 || emailLists.length > 0) && (
        <div className="space-y-4 mt-4">
          <Input
            className="h-8 w-2/4"
            placeholder={t("search")}
            value={searchVal}
            onChange={onSearchChange}
          />
          <div className="flex items-center gap-2 flex-wrap">
            {filteredEmails.map((item, index) => (
              <Badge
                key={`user-email-${index}`}
                className="font-medium text-sm h-7 cursor-pointer gap-1 px-2"
                onClick={() => onRemoveEmail(item)}
              >
                <span>{item}</span>
                <X size={14} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Button
          variant="outline"
          className="cursor-pointer w-fit ml-auto float-end"
          onClick={onClose}
        >
          {t("close")}
        </Button>
      </div>
    </DialogLayout>
  );
};

export default AddUserModal;
