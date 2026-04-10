"use client";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import DialogLayout from "@/layouts/DialogLayout";

import { Button } from "@/components/ui/button";
import { generateSecretCode, isValidEmailFn } from "@/lib/utils";
import { editorContent } from "@/constant";
import { useStore } from "@/store";

import VerifyCode from "@/components/home/VerifyCode";
import MessageList from "@/components/home/MessageList";
import MessageForm from "@/components/home/MessageForm";
import AddUserModal from "@/components/home/AddUserModal";

import { useMessages, useCreateMessage, useUpdateMessage, useDeleteMessage, useRestoreMessage, useBulkDeleteMessages, useBulkRestoreMessages, Message } from "@/hooks/use-messages";

type StateTypes = {
  isLoading: boolean;
  userCode: string;
  isVerifyCode: boolean;
  isNewMessage: boolean;
  isOpenAddUser: boolean;
  addEmailVal: string;
  emailLists: string[];
  emailSearchVal: string;
  content: string;
  code: string;
  isAddCode: boolean;
  errors: {
    addPeople?: string;
    message?: string;
    addEmail?: string;
    expiry?: string;
  };
  activeStatus: "new" | "expiry" | "delete";
  expiryTime: string;
  customExpiryValue: string;
  customExpiryUnit: string;
  editingMessage: Message | null;
};

const initialState: StateTypes = {
  isLoading: true,
  userCode: "",
  isVerifyCode: false,
  isNewMessage: false,
  isOpenAddUser: false,
  addEmailVal: "",
  emailLists: [],
  emailSearchVal: "",
  content: "",
  code: generateSecretCode(),
  isAddCode: false,
  errors: {},
  activeStatus: "new",
  expiryTime: "10m",
  customExpiryValue: "10",
  customExpiryUnit: "m",
  editingMessage: null,
};

const Home = () => {
  const { data: messages = [], isLoading: isMessagesLoading } = useMessages();
  const createMessage = useCreateMessage();
  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();
  const restoreMessage = useRestoreMessage();
  const bulkDeleteMessages = useBulkDeleteMessages();
  const bulkRestoreMessages = useBulkRestoreMessages();
  const user = useStore((state) => state.user);
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");
  const [state, setState] = useState<StateTypes>(initialState);

  const handleChangeCode = (value: string) => {
    if (!state.isVerifyCode) {
      setState((prevState) => ({
        ...prevState,
        userCode: value,
      }));
    }
  };

  const handleVerifyUserCode = async () => {
    if (!state.isVerifyCode && state.userCode.length === 6) {
      toast.info("Verify process...");
      setTimeout(() => {
        toast.info("This message destroyed after 10 minutes", {
          position: "top-center",
        });
      }, 2000);
      setState((prevState) => ({
        ...prevState,
        isVerifyCode: true,
      }));
    }
  };

  const handleToggleNewMessage = () => {
    setState((prevState) => ({
      ...prevState,
      isNewMessage: !prevState.isNewMessage,
      editingMessage: null,
      content: "",
      emailLists: [],
      code: generateSecretCode(),
    }));
  };

  const handleEditMessage = (message: Message) => {
    setState((prevState) => ({
      ...prevState,
      isNewMessage: true,
      editingMessage: message,
      content: message.content,
      emailLists: message.emailLists,
      code: message.code,
      isAddCode: !!message.code,
    }));
  };

  const handleToggleAddNewUserModal = () => {
    setState((prevState) => ({
      ...prevState,
      isOpenAddUser: !prevState.isOpenAddUser,
    }));
  };

  const handleChangeSearchVal = (event: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      emailSearchVal: event.target.value,
    }));
  };

  const handleChangeAddEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      addEmailVal: event.target.value,
      errors: { ...prevState.errors, addEmail: "" },
    }));
  };

  const handleAddEmail = () => {
    if (state.addEmailVal.length > 0) {
      const isInValidEmail = isValidEmailFn(state.addEmailVal);
      if (!isInValidEmail) {
        setState((prevState) => ({
          ...prevState,
          errors: { ...prevState.errors, addEmail: "Please enter a valid email" },
        }));
        return;
      }

      if (state.addEmailVal === user?.user?.email) {
        setState((prevState) => ({
          ...prevState,
          errors: { ...prevState.errors, addEmail: "You cannot add your own email" },
        }));
        return;
      }

      const isAlready = state.emailLists.includes(state.addEmailVal);
      if (isAlready) {
        setState((prevState) => ({
          ...prevState,
          errors: { ...prevState.errors, addEmail: "Email already exists" },
        }));
        return;
      }
      setState((prevState) => ({
        ...prevState,
        emailLists: [...prevState.emailLists, state.addEmailVal],
        addEmailVal: "",
        errors: { ...prevState.errors, addPeople: "", addEmail: "" },
      }));
    }
  };

  const handleRemoveEmail = (email: string) => {
    setState((prevState) => ({
      ...prevState,
      emailLists: prevState.emailLists.filter((item) => item !== email),
    }));
  };

  const handleKeyDownAddEmail = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && state.addEmailVal.length > 0) {
      handleAddEmail();
    }
  };

  const handleContentChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      content: value,
      errors: { ...prevState.errors, message: "" },
    }));
  };

  const handleValidateMessage = () => {
    const errors: StateTypes["errors"] = {};

    if (!state.content.length) {
      errors.message = "Please enter a message";
    }

    if (state.expiryTime === "custom") {
      if (!state.customExpiryValue || parseInt(state.customExpiryValue) <= 0) {
        errors.expiry = "Please enter a valid amount";
      }
    }

    return errors;
  };

  const handleSaveMessage = () => {
    const errors = handleValidateMessage();
    if (Object.keys(errors).length) {
      setState((prevState) => ({
        ...prevState,
        errors,
      }));
      return;
    }

    if (state.editingMessage) {
      updateMessage.mutate(
        {
          id: state.editingMessage.id || state.editingMessage._id as string,
          content: state.content,
          emailLists: state.emailLists,
          code: state.code,
          expiryTime: state.expiryTime,
          customExpiryValue: state.customExpiryValue,
          customExpiryUnit: state.customExpiryUnit,
        },
        {
          onSuccess: () => {
            setState((prevState) => ({
              ...prevState,
              isNewMessage: false,
              editingMessage: null,
              content: "",
              emailLists: [],
              code: generateSecretCode(),
            }));
          },
        },
      );
    } else {
      createMessage.mutate(
        {
          content: state.content,
          emailLists: state.emailLists,
          code: state.code,
          expiryTime: state.expiryTime,
          customExpiryValue: state.customExpiryValue,
          customExpiryUnit: state.customExpiryUnit,
        },
        {
          onSuccess: () => {
            setState((prevState) => ({
              ...prevState,
              isNewMessage: false,
              content: "",
              emailLists: [],
              code: generateSecretCode(),
            }));
          },
        },
      );
    }
  };

  const handleToggleAddCode = () => {
    setState((prevState) => ({
      ...prevState,
      isAddCode: !prevState.isAddCode,
    }));
  };

  const handleGenerateCode = () => {
    setState((prevState) => ({
      ...prevState,
      code: generateSecretCode(),
    }));
  };

  const handleDeleteMessage = (id: string, onSuccess?: () => void) => {
    deleteMessage.mutate(id, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const handleRestoreMessage = (id: string) => {
    restoreMessage.mutate(id);
  };

  const handleBulkDeleteMessages = (ids: string[], onSuccess?: () => void) => {
    bulkDeleteMessages.mutate(ids, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  const handleBulkRestoreMessages = (ids: string[]) => {
    bulkRestoreMessages.mutate(ids);
  };

  const handleChangeActiveStatus = (status: StateTypes["activeStatus"]) => {
    setState((prevState) => ({
      ...prevState,
      activeStatus: status,
    }));
  };

  const handleExpiryTimeChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      expiryTime: value,
      errors: { ...prevState.errors, expiry: "" },
    }));
  };

  const handleCustomExpiryValueChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      customExpiryValue: value,
      errors: { ...prevState.errors, expiry: "" },
    }));
  };

  const handleCustomExpiryUnitChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      customExpiryUnit: value,
    }));
  };

  const filteredEmails = useMemo(() => {
    const searchVal = state.emailSearchVal.toLowerCase();
    const emailLists = [...state.emailLists];
    return emailLists.filter((email) =>
      email.toLowerCase().includes(searchVal),
    );
  }, [state.emailSearchVal, state.emailLists]);

  useEffect(() => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 2000);
  }, []);

  useEffect(() => {
    if (state.userCode.length === 6) {
      handleVerifyUserCode();
    }
  }, [state.userCode]);

  return (
    <div>
      <DialogLayout
        contentClass={`z-50 ${state.isNewMessage
          ? "sm:max-w-2xl"
          : codeParam && !state.isVerifyCode
            ? "sm:max-w-sm"
            : "sm:max-w-xl h-[80vh]"
          }`}
        dialogOverlayClass="backdrop-blur-xl bg-black/30"
      >
        {state.isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full bg-gray-300 rounded-sm" />
            <Skeleton className="h-3.5 w-[75%] rounded-sm bg-gray-300" />
            <Skeleton className="h-3.5 w-[50%] rounded-sm bg-gray-300" />
            <Skeleton className="h-3.5 w-[75%] rounded-sm bg-gray-300" />
          </div>
        )}

        {codeParam && !state.isVerifyCode ? (
          <VerifyCode
            onVerify={handleVerifyUserCode}
            onChangeCode={handleChangeCode}
            isVerifyCode={state.isVerifyCode}
          />
        ) : (
          state.isVerifyCode && (
            <div
              className="h-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          )
        )}

        {!codeParam && !state.isLoading && (
          <div className="flex flex-col w-full">
            {state.isNewMessage ? (
              <MessageForm
                content={state.content}
                emailCount={state.emailLists.length}
                secretCode={state.code}
                isAddCode={state.isAddCode}
                isSaving={createMessage.isPending || updateMessage.isPending}
                errors={state.errors}
                onContentChange={handleContentChange}
                onToggleAddUser={handleToggleAddNewUserModal}
                onToggleAddCode={handleToggleAddCode}
                onGenerateCode={handleGenerateCode}
                onSave={handleSaveMessage}
                onCancel={handleToggleNewMessage}
                expiryTime={state.expiryTime}
                onExpiryTimeChange={handleExpiryTimeChange}
                customExpiryValue={state.customExpiryValue}
                onCustomExpiryValueChange={handleCustomExpiryValueChange}
                customExpiryUnit={state.customExpiryUnit}
                onCustomExpiryUnitChange={handleCustomExpiryUnitChange}
                isEditing={!!state.editingMessage}
              />
            ) : (
              <>
                <div className="flex justify-end gap-3">
                  <Link href="/enter-code">
                    <Button
                      className="cursor-pointer"
                      size="sm"
                      variant="outline"
                    >
                      Enter Code
                    </Button>
                  </Link>
                  <Button
                    className="cursor-pointer"
                    size="sm"
                    onClick={handleToggleNewMessage}
                  >
                    Add Message
                  </Button>
                </div>
                <MessageList
                  messages={messages}
                  isLoading={isMessagesLoading}
                  activeStatus={state.activeStatus}
                  onStatusChange={handleChangeActiveStatus}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  isDeleting={deleteMessage.isPending || bulkDeleteMessages.isPending}
                  onRestore={handleRestoreMessage}
                  isRestoring={restoreMessage.isPending || bulkRestoreMessages.isPending}
                  onBulkDelete={handleBulkDeleteMessages}
                  onBulkRestore={handleBulkRestoreMessages}
                />
              </>
            )}
          </div>
        )}

        {state.isOpenAddUser && (
          <AddUserModal
            isOpen={state.isOpenAddUser}
            onClose={handleToggleAddNewUserModal}
            addEmailVal={state.addEmailVal}
            onEmailChange={handleChangeAddEmail}
            onAddEmail={handleAddEmail}
            onKeyDown={handleKeyDownAddEmail}
            filteredEmails={filteredEmails}
            emailLists={state.emailLists}
            onRemoveEmail={handleRemoveEmail}
            searchVal={state.emailSearchVal}
            onSearchChange={handleChangeSearchVal}
            errors={state.errors}
          />
        )}
      </DialogLayout>
    </div>
  );
};

export default Home;

