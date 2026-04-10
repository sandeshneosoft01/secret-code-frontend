"use client";
import React from "react";
import { Plus, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/TextEditor";
import { useTranslations } from "next-intl";

interface MessageFormProps {
  content: string;
  emailCount: number;
  secretCode: string;
  isAddCode: boolean;
  isSaving?: boolean;
  errors: {
    addPeople?: string;
    message?: string;
    expiry?: string;
  };
  onContentChange: (value: string) => void;
  onToggleAddUser: () => void;
  onToggleAddCode: () => void;
  onGenerateCode: () => void;
  expiryTime: string;
  onExpiryTimeChange: (value: string) => void;
  customExpiryValue: string;
  onCustomExpiryValueChange: (value: string) => void;
  customExpiryUnit: string;
  onCustomExpiryUnitChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({
  content,
  emailCount,
  secretCode,
  isAddCode,
  isSaving,
  errors,
  onContentChange,
  onToggleAddUser,
  onToggleAddCode,
  onGenerateCode,
  onSave,
  onCancel,
  expiryTime,
  onExpiryTimeChange,
  customExpiryValue,
  onCustomExpiryValueChange,
  customExpiryUnit,
  onCustomExpiryUnitChange,
  isEditing,
}) => {
  const t = useTranslations("HomePage");

  return (
    <div className="mt-0">
      <div className="flex items-center justify-between border-t border-b py-2">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <Button
              size="sm"
              variant="outline"
              className={`cursor-pointer ${errors.addPeople ? "border border-red-500" : ""
                }`}
              onClick={onToggleAddUser}
            >
              <Plus size={16} />
              <span className="text-sm font-medium">{t("addPeople")}</span>
            </Button>
            {errors.addPeople && (
              <p className="text-red-500 text-[10px] font-medium leading-none">
                {errors.addPeople}
              </p>
            )}
          </div>

          {emailCount > 0 && (
            <Button
              className="flex items-center text-sm cursor-pointer"
              size="sm"
              variant="outline"
              onClick={onToggleAddUser}
            >
              <Users size={18} />
              <span>{emailCount}</span>
            </Button>
          )}

          <div className="flex items-center space-x-2 pl-2 border-l ml-1">
            <Select value={expiryTime} onValueChange={onExpiryTimeChange}>
              <SelectTrigger size="sm" className="h-8 border-none bg-transparent hover:bg-accent/50 shadow-none gap-1 px-1 transition-colors duration-200">
                <Clock size={14} className="text-muted-foreground" />
                <SelectValue placeholder={t("expire")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10m">{t("expiryOptions.10m")}</SelectItem>
                <SelectItem value="1h">{t("expiryOptions.1h")}</SelectItem>
                <SelectItem value="1d">{t("expiryOptions.1d")}</SelectItem>
                <SelectItem value="never">{t("expiryOptions.never")}</SelectItem>
                <SelectItem value="custom">{t("expiryOptions.custom")}</SelectItem>
              </SelectContent>
            </Select>

            {expiryTime === "custom" && (
              <div className="flex items-center space-x-1 relative animate-in fade-in slide-in-from-left-2 duration-300">
                <Input
                  type="number"
                  value={customExpiryValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || parseInt(val) >= 0) {
                      onCustomExpiryValueChange(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className={`h-8 w-14 px-2 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.expiry ? "border-red-500" : ""}`}
                  min="0"
                />
                <Select value={customExpiryUnit} onValueChange={onCustomExpiryUnitChange}>
                  <SelectTrigger size="sm" className="h-8 border-none bg-transparent hover:bg-accent/50 shadow-none px-1 transition-colors duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">{t("expiryOptions.m")}</SelectItem>
                    <SelectItem value="h">{t("expiryOptions.h")}</SelectItem>
                    <SelectItem value="d">{t("expiryOptions.d")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.expiry && (
                  <span className="text-[10px] text-red-500 font-medium animate-in fade-in duration-300 absolute -bottom-4 left-0 whitespace-nowrap">
                    {errors.expiry}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {isAddCode ? (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="h-8 w-20 text-sm justify-center">
              {secretCode}
            </Badge>
            <Button size="sm" className="cursor-pointer" onClick={onGenerateCode}>
              {t("generate")}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onToggleAddCode}
          >
            {t("addCode")}
            {secretCode ? ` : ${secretCode}` : ""}
          </Button>
        )}
      </div>
      <div className="mt-4 w-full h-96 relative">
        <TextEditor value={content} onChange={onContentChange} t={t} />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
      </div>

      <div className="border-t py-2 mt-4">
        <div className="flex items-center space-x-3 float-end">
          <Button variant="outline" className="cursor-pointer" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button
            className="cursor-pointer"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? t("saving") : isEditing ? t("update") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
