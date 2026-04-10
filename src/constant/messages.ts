export const MESSAGES: Record<string, string> = {
  // Auth Success
  SIGNUP_SUCCESSFUL: "Account created successfully!",
  SIGNIN_SUCCESSFUL: "Signed in successfully!",

  // Auth Errors
  EMAIL_ALREADY_REGISTERED: "This email is already registered.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCOUNT_SUSPENDED: "Your account is suspended. Please contact support.",
  INCORRECT_PASSWORD: "Correct password is required.",
  USER_NOT_FOUND: "User not found.",
  INVALID_TOKEN: "Your session has expired. Please sign in again.",

  // Message Success
  MESSAGE_CREATED: "Secret message created successfully!",
  MESSAGE_UPDATED: "Secret message updated successfully!",
  MESSAGE_DELETED: "Secret message deleted successfully!",
  MESSAGE_PERMANENTLY_DELETED: "Secret message permanently deleted.",
  MESSAGE_RESTORED: "Secret message restored successfully!",
  MESSAGES_PROCESSED: "Messages processed successfully.",
  MESSAGES_RESTORED: "Messages restored successfully.",

  // Message Errors
  CODE_REQUIRED: "Secret code is required to access this message.",
  MESSAGE_NOT_FOUND: "Secret message not found. Please check your code.",
  MESSAGE_EXPIRED: "This secret message has expired.",
  ACCESS_DENIED: "You do not have permission to view this message.",
  MESSAGE_NOT_FOUND_OR_UNAUTHORIZED: "Message not found or you're not authorized.",
  MESSAGES_NOT_FOUND_OR_UNAUTHORIZED: "Messages not found or you're not authorized.",
  
  // Generic
  INTERNAL_ERROR: "An unexpected error occurred. Please try again later.",
};

export const getFriendlyMessage = (code: string): string => {
  return MESSAGES[code] || code || "Something went wrong.";
};
