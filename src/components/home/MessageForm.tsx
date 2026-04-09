"use client";
import React from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  };
  onContentChange: (value: string) => void;
  onToggleAddUser: () => void;
  onToggleAddCode: () => void;
  onGenerateCode: () => void;
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
