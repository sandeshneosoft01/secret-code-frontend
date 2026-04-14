import { MessageCode } from "@/constant/messages";

export const getErrorMessage = (error: any, fallback: MessageCode = "INTERNAL_ERROR"): string => {
  const errorData = error?.response?.data || error;

  return (
    errorData?.code ||
    errorData?.error ||
    errorData?.message ||
    fallback
  );
};
