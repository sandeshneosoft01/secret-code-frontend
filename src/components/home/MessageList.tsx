"use client";
import React from "react";
import { Pencil, Trash, Users, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageListProps {
  lists: number[];
  activeStatus: "new" | "expiry" | "delete";
  onStatusChange: (status: "new" | "expiry" | "delete") => void;
  onEdit: () => void;
  onDelete: () => void;
  content: string;
  emailCount: number;
  secretCode: string;
}

const MessageList: React.FC<MessageListProps> = ({
  lists,
  activeStatus,
  onStatusChange,
  onEdit,
  onDelete,
  content,
  emailCount,
  secretCode,
}) => {
  return (
    <div className="mt-4">
      <div className="flex justify-end space-x-2">
        <Button
          size="sm"
          variant={activeStatus === "new" ? "default" : "outline"}
          className="text-xs p-0 h-6 px-2 cursor-pointer"
          onClick={() => onStatusChange("new")}
        >
          New
        </Button>
        <Button
          size="sm"
          variant={activeStatus === "expiry" ? "default" : "outline"}
          className="text-xs p-0 h-6 px-2 cursor-pointer"
          onClick={() => onStatusChange("expiry")}
        >
          Expiry
        </Button>
        <Button
          size="sm"
          variant={activeStatus === "delete" ? "default" : "outline"}
          className="text-xs p-0 h-6 px-2 cursor-pointer"
          onClick={() => onStatusChange("delete")}
        >
          Delete
        </Button>
      </div>
      <div className="relative overflow-auto h-80 space-y-2 mt-4">
        {lists.map((_, index) => (
          <div
            key={`message-${index}`}
            className="flex w-full gap-2 border rounded-md p-2 text-sm"
          >
            <div className="">{index + 1}.</div>
            <div className="w-full">
              <div>
                <span className="font-medium">Message</span>
                <div
                  className="h-full w-full line-clamp-2 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              </div>
              <div className="mt-2 flex items-end justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col w-fit">
                    <span className="font-medium text-gray-600">People</span>
                    <Button
                      className="flex items-center text-sm h-8 px-1 cursor-pointer"
                      variant="outline"
                      size="sm"
                    >
                      <Users size={14} />
                      <span>{emailCount}</span>
                    </Button>
                  </div>
                  <div className="flex flex-col w-fit">
                    <span className="font-medium text-gray-600">Code</span>
                    <Button
                      className="px-2 text-sm"
                      variant="outline"
                      size="sm"
                    >
                      {secretCode}
                    </Button>
                  </div>
                  <div className="flex flex-col w-fit">
                    <span className="font-medium text-gray-600">View</span>
                    <Button
                      className="px-2 text-sm cursor-pointer"
                      variant="outline"
                      size="sm"
                    >
                      <ViewIcon size={14} />
                      <span>0</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={onEdit}
                        >
                          <Pencil size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={onDelete}
                        >
                          <Trash size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
