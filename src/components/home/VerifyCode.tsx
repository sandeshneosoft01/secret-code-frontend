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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("HomePage.VerifyCode");
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const handleVerify = () => {
    if (code.length === 0) {
      setError(t("enterSecret"));
      return;
    }
    if (code.length < 6) {
      setError(t("enterComplete"));
      return;
    }
    setError("");
    onVerify();
  };

  const handleChange = (value: string) => {
    setCode(value);
    onChangeCode(value);
    if (value.length === 6) {
      setError("");
    }
  };

  return (
    <div>
      <div className="space-y-2">
        <Label className="text-[16px]">{t("enterCode")}</Label>
        <InputOTP
          onChange={handleChange}
          className="flex items-center justify-center mx-auto"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className={`w-12 h-12 xl:w-14 xl:h-14 text-3xl ${error ? "border-red-500" : ""
                  }`}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <div className="h-5">
          {error ? (
            <span className="text-sm text-red-500 font-medium">{error}</span>
          ) : (
            <span className="text-sm text-muted-foreground font-medium">
              {t("enterToVerify")}
            </span>
          )}
        </div>
      </div>

      <Button
        disabled={isVerifyCode}
        className="mt-6 cursor-pointer text-md w-full sm:w-auto"
        onClick={handleVerify}
      >
        {t("verify")}
      </Button>
    </div>
  );
};

export default VerifyCode;
