"use client";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import DialogLayout from "@/layouts/DialogLayout";

import { Button } from "@/components/ui/button";
import { generateSecretCode, isValidEmailFn } from "@/lib/utils";
import { editorContent } from "@/constant";

import VerifyCode from "@/components/home/VerifyCode";
import MessageList from "@/components/home/MessageList";
import MessageForm from "@/components/home/MessageForm";
import AddUserModal from "@/components/home/AddUserModal";

type MessageType = {
  emailLists: string[];
  content: string;
  accessTime: string;
  code: string;
};

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
  messageLists: MessageType[];
  code: string;
  isAddCode: boolean;
  errors: {
    addPeople?: string;
    message?: string;
    addEmail?: string;
  };
  activeStatus: "new" | "expiry" | "delete";
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
  messageLists: [],
  code: generateSecretCode(),
  isAddCode: false,
  errors: {},
  activeStatus: "new",
};

const lists = Array.from({ length: 2 }, (_, i) => i + 1);

const Home = () => {
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
    if (!state.emailLists.length) {
      errors.addPeople = "Please add at least one email";
    }

    if (!state.content.length) {
      errors.message = "Please enter a message";
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
    toast.success("Message saved");
    setState((prevState) => ({
      ...prevState,
      isNewMessage: false,
    }));
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

  const handleChangeActiveStatus = (status: StateTypes["activeStatus"]) => {
    setState((prevState) => ({
      ...prevState,
      activeStatus: status,
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
                errors={state.errors}
                onContentChange={handleContentChange}
                onToggleAddUser={handleToggleAddNewUserModal}
                onToggleAddCode={handleToggleAddCode}
                onGenerateCode={handleGenerateCode}
                onSave={handleSaveMessage}
                onCancel={handleToggleNewMessage}
              />
            ) : (
              <>
                <div className="flex justify-end">
                  <Button
                    className="cursor-pointer"
                    size="sm"
                    onClick={handleToggleNewMessage}
                  >
                    Add Message
                  </Button>
                </div>
                {lists.length > 0 && (
                  <MessageList
                    lists={lists}
                    activeStatus={state.activeStatus}
                    onStatusChange={handleChangeActiveStatus}
                    onEdit={handleToggleNewMessage}
                    onDelete={handleToggleNewMessage}
                    content={state.content}
                    emailCount={state.emailLists.length}
                    secretCode={state.code}
                  />
                )}
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

