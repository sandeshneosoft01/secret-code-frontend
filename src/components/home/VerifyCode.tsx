"use client";
import React from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface VerifyCodeProps {
  onVerify: () => void;
  onChangeCode: (value: string) => void;
  isVerifyCode: boolean;
}

const VerifyCode: React.FC<VerifyCodeProps> = ({
  onVerify,
  onChangeCode,
  isVerifyCode,
}) => {
  return (
    <div>
      <div className="space-y-2">
        <Label className="text-[16px]">Enter your code</Label>
        <InputOTP
          onChange={onChangeCode}
          className="flex items-center justify-center mx-auto"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="w-12 h-12 xl:w-14 xl:h-14 text-3xl"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <span className="text-sm text-gray-700 font-medium">
          Please enter your secret code to verify.
        </span>
      </div>

      <Button
        disabled={isVerifyCode}
        className="mt-6 cursor-pointer text-md"
        onClick={onVerify}
      >
        Verify
      </Button>
    </div>
  );
};

export default VerifyCode;
