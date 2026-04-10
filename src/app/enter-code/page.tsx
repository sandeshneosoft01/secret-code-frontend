"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import DialogLayout from "@/layouts/DialogLayout";
import VerifyCode from "@/components/home/VerifyCode";
import { useGetMessageByCode } from "@/hooks/use-messages";
import { useStore } from "@/store";
import { getFriendlyMessage } from "@/constant/messages";

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
            toast.success(getFriendlyMessage(response.message || "MESSAGE_RETRIEVED"));
            if (response.data.sender !== user?.user?.id) {
              toast.info("This message will be destroyed soon", {
                position: "top-center",
              });
            }
          }
        },
        onError: (error: any) => {
          toast.error(getFriendlyMessage(error.message || "INTERNAL_ERROR"));
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
        modal={false}
        contentClass={`z-50 ${!isVerified ? "sm:max-w-sm" : "sm:max-w-xl h-[80vh]"
          }`}
        dialogOverlayClass="backdrop-blur-xl bg-black/30"
      >
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full bg-muted rounded-sm" />
            <Skeleton className="h-3.5 w-[75%] rounded-sm bg-muted" />
            <Skeleton className="h-3.5 w-[50%] rounded-sm bg-muted" />
            <Skeleton className="h-3.5 w-[75%] rounded-sm bg-muted" />
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
