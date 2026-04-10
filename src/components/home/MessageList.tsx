import React from "react";
import { MessageSquareOff, Pencil, RefreshCcw, Trash, Users, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Message } from "@/hooks/use-messages";
import { useTranslations } from "next-intl";

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
  onBulkDelete: (messageIds: string[], onSuccess?: () => void) => void;
  onBulkRestore: (messageIds: string[]) => void;
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
  onBulkDelete,
  onBulkRestore,
}) => {
  const t = useTranslations("HomePage");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [messageToDelete, setMessageToDelete] = React.useState<string | string[] | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const filteredMessages = messages.filter(
    (message) => message.status === activeStatus,
  );

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedCount === filteredMessages.length && filteredMessages.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMessages.map((m) => (m.id || m._id as string))));
    }
  };

  const handleDeleteClick = (id: string | string[]) => {
    setMessageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      if (Array.isArray(messageToDelete)) {
        onBulkDelete(messageToDelete, () => {
          setIsDeleteDialogOpen(false);
          setMessageToDelete(null);
          setSelectedIds(new Set());
        });
      } else {
        onDelete(messageToDelete, () => {
          setIsDeleteDialogOpen(false);
          setMessageToDelete(null);
          setSelectedIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(messageToDelete as string);
            return newSet;
          });
        });
      }
    }
  };

  const handleBulkRestore = () => {
    if (selectedIds.size > 0) {
      onBulkRestore(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t("MessageList.codeCopied"));
  };

  const selectedCount = React.useMemo(() => {
    const visibleIds = new Set(filteredMessages.map((m) => m.id || (m._id as string)));
    return Array.from(selectedIds).filter((id) => visibleIds.has(id)).length;
  }, [selectedIds, filteredMessages]);

  // Reset selection when tab changes
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [activeStatus]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between pb-2 border-b mb-2">
        <div className="flex items-center space-x-2">
          {filteredMessages.length > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <Checkbox
                id="select-all"
                checked={selectedCount === filteredMessages.length && filteredMessages.length > 0}
                onCheckedChange={handleToggleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="text-xs text-muted-foreground font-medium cursor-pointer"
              >
                {selectedCount > 0 ? `${selectedCount} ${t("MessageList.selected")}` : t("MessageList.selectAll")}
              </label>
            </div>
          )}
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left-2">
              {activeStatus === "delete" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-2 cursor-pointer border-green-500/20 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400"
                  onClick={handleBulkRestore}
                  disabled={isRestoring}
                >
                  <RefreshCcw size={12} className={`mr-1 ${isRestoring ? "animate-spin" : ""}`} />
                  {t("MessageList.restore")}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 px-2 cursor-pointer border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400"
                onClick={() => handleDeleteClick(Array.from(selectedIds))}
                disabled={isDeleting}
              >
                <Trash size={12} className="mr-1" />
                {t("MessageList.delete")}
              </Button>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={activeStatus === "new" ? "default" : "outline"}
            className="text-xs h-7 px-3 cursor-pointer"
            onClick={() => onStatusChange("new")}
          >
            {t("messages.new")}
          </Button>
          <Button
            size="sm"
            variant={activeStatus === "expiry" ? "default" : "outline"}
            className="text-xs h-7 px-3 cursor-pointer"
            onClick={() => onStatusChange("expiry")}
          >
            {t("messages.expiry")}
          </Button>
          <Button
            size="sm"
            variant={activeStatus === "delete" ? "default" : "outline"}
            className="text-xs h-7 px-3 cursor-pointer"
            onClick={() => onStatusChange("delete")}
          >
            {t("messages.delete")}
          </Button>
        </div>
      </div>
      <div className="relative overflow-auto h-80 space-y-2 mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-muted-foreground">{t("MessageList.loading")}</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-accent/50 rounded-full">
              <MessageSquareOff size={32} className="text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{t("MessageList.noMessages")}</p>
              <p className="text-xs text-muted-foreground">{t("MessageList.noMessagesSub")}</p>
            </div>
          </div>
        ) : (
          filteredMessages.map((message, index) => {
            const messageId = (message.id || message._id as string);
            const isSelected = selectedIds.has(messageId);
            return (
                <div
                  key={messageId}
                  className={`flex w-full gap-2 border rounded-md p-3 text-sm transition-all duration-200 ${isSelected ? "bg-primary/5 border-primary shadow-sm" : "hover:border-primary/30"}`}
                >
                  <div className="flex items-start pt-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleSelect(messageId)}
                    />
                  </div>
                  <div className="pt-0.5 text-muted-foreground font-medium">{index + 1}.</div>
                  <div className="w-full">
                    <div>
                      <span className="font-semibold text-foreground">{t("MessageList.message")}</span>
                      <div
                        className="mt-1 w-full line-clamp-2 text-muted-foreground leading-relaxed transition-colors duration-200"
                        dangerouslySetInnerHTML={{
                          __html: message.content,
                        }}
                      />
                    </div>
                    <div className="mt-4 flex items-end justify-between w-full">
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("MessageList.people")}</span>
                          <Badge variant="outline" className="h-7 px-2 font-medium bg-muted/50 transition-colors">
                            <Users size={12} className="mr-1 text-muted-foreground" />
                            {message.emailLists.length}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("MessageList.code")}</span>
                          <Badge
                            variant="outline"
                            className="h-7 px-2 font-mono cursor-pointer hover:bg-accent transition-colors bg-muted/50"
                            onClick={() => handleCopyCode(message.code)}
                          >
                            {message.code}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("MessageList.views")}</span>
                          <Badge variant="outline" className="h-7 px-2 font-medium bg-muted/50 transition-colors">
                            <ViewIcon size={12} className="mr-1 text-muted-foreground" />
                            {message.viewCount}
                          </Badge>
                        </div>
                      </div>
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="w-8 h-8 p-0 cursor-pointer"
                              variant="outline"
                              onClick={() => onEdit(message)}
                            >
                              <Pencil size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("MessageList.editMessage")}</p>
                          </TooltipContent>
                        </Tooltip>
                        {activeStatus === "delete" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="w-8 h-8 p-0 cursor-pointer border-green-500/20 hover:bg-green-500/10 hover:text-green-600"
                                variant="outline"
                                onClick={() =>
                                  onRestore(messageId)
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
                              <p>{t("MessageList.restoreMessage")}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className={`w-8 h-8 p-0 cursor-pointer border-red-500/20 hover:bg-red-500/10 hover:text-red-600 ${activeStatus === 'delete' ? 'text-red-600 bg-red-500/10 border-red-500/30' : ''}`}
                              variant="outline"
                              onClick={() =>
                                handleDeleteClick(messageId)
                              }
                            >
                              <Trash size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{activeStatus === 'delete' ? t("MessageList.permanentlyDelete") : t("MessageList.moveToTrash")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <DeleteConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title={
          Array.isArray(messageToDelete)
            ? (activeStatus === "delete" ? t("MessageList.modal.permDeleteSelected") : t("MessageList.modal.moveSelectedToTrash"))
            : (activeStatus === "delete" ? t("MessageList.modal.permDeleteMessage") : t("MessageList.modal.moveToTrash"))
        }
        description={
          Array.isArray(messageToDelete)
            ? (activeStatus === "delete"
              ? t("MessageList.modal.permDeleteConfirmSelected", { count: messageToDelete.length })
              : t("MessageList.modal.moveSelectedConfirm", { count: messageToDelete.length }))
            : (activeStatus === "delete"
              ? t("MessageList.modal.permDeleteConfirm")
              : t("MessageList.modal.moveToTrashConfirm"))
        }
      />
    </div>
  );
};

export default MessageList;
