"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import DialogLayout from "@/layouts/DialogLayout";
import VerifyCode from "@/components/home/VerifyCode";
import { useGetMessageByCode } from "@/hooks/use-messages";
import { useStore } from "@/store";

const EnterCodePage = () => {
  const [userCode, setUserCode] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const user = useStore((state) => state.user);

  const {
    mutate: verifyCode,
    isPending: isVerifying,
    isSuccess: isVerified,
  } = useGetMessageByCode();

  const handleChangeCode = (value: string) => {
    if (!isVerified) {
      setUserCode(value);
    }
  };

  const handleVerifyUserCode = () => {
    if (!isVerified && userCode.length === 6) {
      verifyCode(userCode, {
        onSuccess: (response) => {
          if (response.success) {
            setMessageContent(response.data.content);
            toast.success("Message retrieved successfully!");
            if (response.data.sender !== user?.user?.id) {
              toast.info("This message will be destroyed soon", {
                position: "top-center",
              });
            }
          }
        },
        onError: (error: any) => {
          const message = error.message;
          if (message === "MESSAGE_NOT_FOUND") {
            toast.error("Invalid code. Please check and try again.");
          } else if (message === "MESSAGE_EXPIRED") {
            toast.error("This message has expired and is no longer available.");
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
          setUserCode("");
        },
      });
    }
  };

  useEffect(() => {
    if (userCode.length === 6) {
      handleVerifyUserCode();
    }
  }, [userCode]);

  const isLoading = isVerifying;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <DialogLayout
        contentClass={`z-50 ${!isVerified ? "sm:max-w-sm" : "sm:max-w-xl h-[80vh]"
          }`}
        dialogOverlayClass="backdrop-blur-xl bg-black/30"
      >
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full bg-gray-300 rounded-sm" />
            <Skeleton className="h-3.5 w-[75%] rounded-sm bg-gray-300" />
            <Skeleton className="h-3.5 w-[50%] rounded-sm bg-gray-300" />
            <Skeleton className="h-3.5 w-[75%] rounded-sm bg-gray-300" />
          </div>
        )}

        {!isLoading && !isVerified && (
          <VerifyCode
            onVerify={handleVerifyUserCode}
            onChangeCode={handleChangeCode}
            isVerifyCode={isVerifying}
          />
        )}

        {isVerified && (
          <div
            className="h-full overflow-auto pt-4 prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: messageContent }}
          />
        )}
      </DialogLayout>
    </div>
  );
};

export default EnterCodePage;
