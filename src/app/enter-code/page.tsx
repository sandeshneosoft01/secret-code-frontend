"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import DialogLayout from "@/layouts/DialogLayout";
import VerifyCode from "@/components/home/VerifyCode";
import { editorContent } from "@/constant";

const EnterCodePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userCode, setUserCode] = useState("");
  const [isVerifyCode, setIsVerifyCode] = useState(false);

  const handleChangeCode = (value: string) => {
    if (!isVerifyCode) {
      setUserCode(value);
    }
  };

  const handleVerifyUserCode = async () => {
    if (!isVerifyCode && userCode.length === 6) {
      toast.info("Verify process...");
      setTimeout(() => {
        toast.info("This message destroyed after 10 minutes", {
          position: "top-center",
        });
      }, 2000);
      setIsVerifyCode(true);
    }
  };

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userCode.length === 6) {
      handleVerifyUserCode();
    }
  }, [userCode]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <DialogLayout
        contentClass={`z-50 ${
          !isVerifyCode ? "sm:max-w-sm" : "sm:max-w-xl h-[80vh]"
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

        {!isLoading && !isVerifyCode && (
          <VerifyCode
            onVerify={handleVerifyUserCode}
            onChangeCode={handleChangeCode}
            isVerifyCode={isVerifyCode}
          />
        )}

        {isVerifyCode && (
          <div
            className="h-full overflow-auto pt-4"
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        )}
      </DialogLayout>
    </div>
  );
};

export default EnterCodePage;
