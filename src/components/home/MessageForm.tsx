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
}) => {
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
              <span className="text-sm font-medium">Add People</span>
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
              <SelectTrigger size="sm" className="h-8 border-none bg-transparent hover:bg-gray-100/50 shadow-none gap-1 px-1">
                <Clock size={14} className="text-gray-400" />
                <SelectValue placeholder="Expire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10m">10 Mins</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
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
                  <SelectTrigger size="sm" className="h-8 border-none bg-transparent hover:bg-gray-100/50 shadow-none px-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Mins</SelectItem>
                    <SelectItem value="h">Hours</SelectItem>
                    <SelectItem value="d">Days</SelectItem>
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
              Generate
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onToggleAddCode}
          >
            {!secretCode ? "Add" : ""}&nbsp;Code
            {secretCode ? ` : ${secretCode}` : ""}
          </Button>
        )}
      </div>
      <div className="mt-4 w-full h-96 relative">
        <TextEditor value={content} onChange={onContentChange} />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
      </div>

      <div className="border-t py-2 mt-4">
        <div className="flex items-center space-x-3 float-end">
          <Button variant="outline" className="cursor-pointer" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
