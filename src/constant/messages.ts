import en from '../../messages/en.json';


export type MessageCode = keyof typeof en.Messages;

export const getFriendlyMessage = (code: string): string => {
  const messages = en.Messages as Record<string, string>;
  return messages[code] || code || messages.SOMETHING_WENT_WRONG;
};
