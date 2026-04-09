"use client";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";
import { Pencil, Plus, Trash, Users, ViewIcon, X } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import DialogLayout from "@/layouts/DialogLayout";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateSecretCode, isValidEmailFn } from "@/lib/utils";
import TextEditor from "@/components/TextEditor";
import { editorContent } from "@/constant";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const code = searchParams.get("code");
  const [state, setState] = useState<StateTypes>(initialState);

  console.log("params", code);

  const handleChangeCode = (value: string) => {
    if (!state.isVerifyCode) {
      setState((prevState: StateTypes) => ({
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
      setState((prevState: StateTypes) => ({
        ...prevState,
        isVerifyCode: true,
      }));

      // setTimeout(() => {
      //   setState((prevState: StateTypes) => ({
      //     ...prevState,
      //     isVerifyCode: false
      //   }))
      // }, 2000)
    }
  };

  const handleToggleNewMessage = () => {
    setState((prevState: StateTypes) => ({
      ...prevState,
      isNewMessage: !prevState.isNewMessage,
    }));
  };

  const handleToggleAddNewUserModal = () => {
    setState((prevState: StateTypes) => ({
      ...prevState,
      isOpenAddUser: !prevState.isOpenAddUser,
    }));
  };

  const handleChangeSearchVal = (event: ChangeEvent<HTMLInputElement>) => {
    setState((prevState: StateTypes) => ({
      ...prevState,
      emailSearchVal: event.target.value,
    }));
  };

  const handleChangeAddEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setState((prevState: StateTypes) => ({
      ...prevState,
      addEmailVal: event.target.value,
    }));
  };

  const handleAddEmail = () => {
    if (state.addEmailVal.length > 0) {
      const isInValidEmail = isValidEmailFn(state.addEmailVal);
      console.log("xoxo", { isInValidEmail });
      if (!isInValidEmail) {
        toast.error("Please enter a valid email");
        return;
      }
      const isAlready = state.emailLists.includes(state.addEmailVal);
      if (isAlready) {
        toast.error("Email already exists");
        return;
      }
      setState((prevState: StateTypes) => ({
        ...prevState,
        emailLists: [...prevState.emailLists, state.addEmailVal],
        addEmailVal: "",
      }));
    }
  };

  const handleRemoveEmail = (email: string) => {
    setState((prevState: StateTypes) => ({
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
    setState((prevState: StateTypes) => ({
      ...prevState,
      content: value,
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
      setState((prevState: StateTypes) => ({
        ...prevState,
        errors,
      }));
      return;
    }
    toast.success("Message saved");
    setState((prevState: StateTypes) => ({
      ...prevState,
      isNewMessage: false,
    }));
  };

  const handleToggleAddCode = () => {
    setState((prevState: StateTypes) => ({
      ...prevState,
      isAddCode: !prevState.isAddCode,
    }));
  };

  const handleGenerateCode = () => {
    setState((prevState: StateTypes) => ({
      ...prevState,
      code: generateSecretCode(),
    }));
  };

  const handleChangeActiveStatus = (status: StateTypes["activeStatus"]) => {
    setState((prevState: StateTypes) => ({
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
      setState((prevState: StateTypes) => ({
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
    <div className="">
      <DialogLayout
        contentClass={`z-50 ${
          state.isNewMessage
            ? "sm:max-w-2xl"
            : code && !state.isVerifyCode
              ? "sm:max-w-sm"
              : "sm:max-w-xl h-[80vh]"
        }`}
        dialogOverlayClass="backdrop-blur-xl bg-black/30"
      >
        {state.isLoading && (
          <>
            <Skeleton className="h-20 w-full bg-gray-300 rounded-sm" />
            <Skeleton className="h-3.5 w-75 rounded-sm bg-gray-300" />
            <Skeleton className="h-3.5 w-50 rounded-sm bg-gray-300" />
            <Skeleton className="h-3.5 w-75 rounded-sm bg-gray-300" />
          </>
        )}

        {code && !state.isVerifyCode ? (
          <div>
            <div className="space-y-2">
              <Label className="text-[16px]">Enter your code</Label>
              <InputOTP
                onChange={handleChangeCode}
                className="flex items-center justify-center mx-auto"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 xl:w-14 xl:h-14 text-3xl"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 xl:w-14 xl:h-14 text-3xl"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 xl:w-14 xl:h-14 text-3xl"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 xl:w-14 xl:h-14 text-3xl"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-12 h-12 xl:w-14 xl:h-14 text-3xl"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-12 h-12 xl:w-14 xl:h-14 text-3xl"
                  />
                </InputOTPGroup>
              </InputOTP>
              <span className="text-sm text-gray-700 font-medium">
                Please enter your secret code to verify.
              </span>
            </div>

            <Button
              disabled={state.isVerifyCode}
              className="mt-6 cursor-pointer text-md"
              onClick={handleVerifyUserCode}
            >
              Verify
            </Button>
          </div>
        ) : (
          state.isVerifyCode && (
            <div
              className="h-full overflow-auto"
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          )
        )}

        {!code && (
          <div className="flex flex-col w-full">
            {!state.isNewMessage && (
              <div className="flex justify-end">
                <Button
                  className="cursor-pointer"
                  size="sm"
                  onClick={handleToggleNewMessage}
                >
                  Add Message
                </Button>
              </div>
            )}
            {lists.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant={
                      state.activeStatus === "new" ? "default" : "outline"
                    }
                    className="text-xs p-0 h-6 px-2 cursor-pointer"
                    onClick={() => handleChangeActiveStatus("new")}
                  >
                    New
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      state.activeStatus === "expiry" ? "default" : "outline"
                    }
                    className="text-xs p-0 h-6 px-2 cursor-pointer"
                    onClick={() => handleChangeActiveStatus("expiry")}
                  >
                    Expiry
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      state.activeStatus === "delete" ? "default" : "outline"
                    }
                    className="text-xs p-0 h-6 px-2 cursor-pointer"
                    onClick={() => handleChangeActiveStatus("delete")}
                  >
                    Delete
                  </Button>
                </div>
                <div className="relative overflow-auto h-80 space-y-2 mt-4">
                  {lists.map((listItem, index) => (
                    <div
                      key={`message-${index}`}
                      className="flex w-full gap-2 border rounded-md p-2 text-sm"
                    >
                      <div className="">1.</div>
                      <div className="w-full">
                        <div>
                          <span className="font-medium">Message</span>
                          <div
                            className="h-full w-full line-clamp-2 text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: state.content,
                            }}
                          />
                        </div>
                        <div className="mt-2 flex items-end justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col w-fit">
                              <span className="font-medium text-gray-600">
                                People
                              </span>
                              <Button
                                className="flex itemc text-sm h-8 px-1 cursor-pointer"
                                variant="outline"
                                size="sm"
                              >
                                <Users size={14} />
                                <span>{state.emailLists.length}</span>
                              </Button>
                            </div>
                            <div className="flex flex-col w-fit">
                              <span className="font-medium text-gray-600">
                                Code
                              </span>
                              <Button
                                className="px-2 text-sm"
                                variant="outline"
                                size="sm"
                              >
                                {state.code}
                              </Button>
                            </div>
                            <div className="flex flex-col w-fit">
                              <span className="font-medium text-gray-600">
                                View
                              </span>
                              <Button
                                className="px-2 text-sm cursor-pointer"
                                variant="outline"
                                size="sm"
                              >
                                <ViewIcon />
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
                                    onClick={handleToggleNewMessage}
                                  >
                                    <Pencil />
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
                                    onClick={handleToggleNewMessage}
                                  >
                                    <Trash />
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
            )}
            {state.isNewMessage && (
              <div className="mt-0">
                <div className="flex items-center justify-between border-t border-b py-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`cursor-pointer ${
                        state.errors.addPeople ? "border border-red-500" : ""
                      }`}
                      onClick={handleToggleAddNewUserModal}
                    >
                      <Plus />
                      <span className="text-sm font-medium">Add People</span>
                    </Button>

                    {state.emailLists.length > 0 && (
                      <Button
                        className="flex itemc text-sm cursor-pointer"
                        size="sm"
                        variant="outline"
                        onClick={handleToggleAddNewUserModal}
                      >
                        <Users size={18} />
                        <span>{state.emailLists.length}</span>
                      </Button>
                    )}
                  </div>

                  {state.isAddCode ? (
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="h-8 w-20 text-sm"
                        // placeholder="Enter code"
                        // size={10}
                        // className="h-[32px]"
                        // value={state.code}
                        // maxLength={6}
                        // disabled
                        // onChange={handleChangeSecretCode}
                      >
                        {state.code}
                      </Badge>
                      <Button
                        size="sm"
                        className="cursor-pointer"
                        onClick={handleGenerateCode}
                      >
                        Generte
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={handleToggleAddCode}
                    >
                      {!state.code ? "Add" : ""}&nbsp;Code
                      {state.code ? ` : ${state.code}` : ""}
                    </Button>
                  )}
                </div>
                <div className="mt-4 w-full h-96  relative">
                  <TextEditor
                    value={state.content}
                    onChange={handleContentChange}
                  />
                </div>

                <div className="border-t py-2 mt-4">
                  <div className="flex items-center space-x-3 float-end">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={handleToggleNewMessage}
                    >
                      Cancel
                    </Button>
                    <Button
                      value="ghost"
                      className="cursor-pointer"
                      onClick={handleSaveMessage}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {state.isOpenAddUser && (
          <DialogLayout
            open={state.isOpenAddUser}
            contentClass="max-w-md w-full"
            dialogOverlayClass="backdrop-blur-[2px] bg-black/30"
            handleOpenChange={handleToggleAddNewUserModal}
            title="Add User"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="w-full">
                <Input
                  placeholder="Enter user email"
                  type="email"
                  className=""
                  value={state.addEmailVal}
                  onChange={handleChangeAddEmail}
                  onKeyDown={handleKeyDownAddEmail}
                />
              </div>
              <Button
                className="cursor-pointer"
                onClick={handleAddEmail}
                disabled={!state.addEmailVal.length}
              >
                Add
              </Button>
            </div>

            {(filteredEmails.length > 0 || state.emailLists.length > 0) && (
              <>
                <Input
                  className="h-6 w-2/4"
                  placeholder="Search"
                  value={state.emailSearchVal}
                  onChange={handleChangeSearchVal}
                />
                <div className="flex items-center gap-2 flex-wrap">
                  {filteredEmails.map((item, index) => (
                    <Badge
                      key={index}
                      className="font-medium text-sm h-5 cursor-pointer"
                      onClick={() => handleRemoveEmail(item)}
                    >
                      <span>{item}</span>
                      <X size={20} />
                    </Badge>
                  ))}
                </div>
              </>
            )}

            <div className="mt-10">
              <Button
                variant="outline"
                className="cursor-pointer w-fit ml-auto float-end"
                onClick={handleToggleAddNewUserModal}
              >
                Close
              </Button>
            </div>
          </DialogLayout>
        )}
      </DialogLayout>
    </div>
  );
};

export default Home;
