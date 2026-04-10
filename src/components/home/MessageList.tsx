"use client";
import React from "react";
import { Pencil, RefreshCcw, Trash, Users, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteConfirmModal from "./DeleteConfirmModal";

import { Message } from "@/hooks/use-messages";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  activeStatus: "new" | "expiry" | "delete";
  onStatusChange: (status: "new" | "expiry" | "delete") => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string, onSuccess?: () => void) => void;
  isDeleting?: boolean;
  onRestore: (messageId: string) => void;
  isRestoring?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  activeStatus,
  onStatusChange,
  onEdit,
  onDelete,
  isDeleting = false,
  onRestore,
  isRestoring = false,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [messageToDelete, setMessageToDelete] = React.useState<string | null>(
    null,
  );

  const handleDeleteClick = (id: string) => {
    setMessageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      onDelete(messageToDelete, () => {
        setIsDeleteDialogOpen(false);
        setMessageToDelete(null);
      });
    }
  };
  const filteredMessages = messages.filter(
    (message) => message.status === activeStatus,
  );

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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-gray-500">Loading messages...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-gray-500">No messages found.</span>
          </div>
        ) : (
          filteredMessages.map((message, index) => (
            <div
              key={message.id || message._id}
              className="flex w-full gap-2 border rounded-md p-2 text-sm"
            >
              <div className="">{index + 1}.</div>
              <div className="w-full">
                <div>
                  <span className="font-medium">Message</span>
                  <div
                    className="h-full w-full line-clamp-2 text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: message.content,
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
                        <span>{message.emailLists.length}</span>
                      </Button>
                    </div>
                    <div className="flex flex-col w-fit">
                      <span className="font-medium text-gray-600">Code</span>
                      <Button
                        className="px-2 text-sm"
                        variant="outline"
                        size="sm"
                      >
                        {message.code}
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
                            onClick={() => onEdit(message)}
                          >
                            <Pencil size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                      {activeStatus === "delete" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="cursor-pointer"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onRestore(message.id || (message._id as string))
                              }
                              disabled={isRestoring}
                            >
                              <RefreshCcw
                                size={14}
                                className={isRestoring ? "animate-spin" : ""}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Restore</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteClick(
                                message.id || (message._id as string),
                              )
                            }
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
          ))
        )}
      </div>
      <DeleteConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title={activeStatus === "delete" ? "Permanently Delete Message" : "Delete Message"}
        description={
          activeStatus === "delete"
            ? "Are you sure you want to permanently delete this message? This action is irreversible."
            : "Are you sure you want to move this message to the trash?"
        }
      />
    </div>
  );
};

export default MessageList;
