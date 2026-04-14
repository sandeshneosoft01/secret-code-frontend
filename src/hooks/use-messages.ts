import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useStore } from "@/store";
import { getMessageByCode } from "@/services/message-service";
import { useTranslations } from "next-intl";
import { api } from "@/services/api";
import { MessageCode } from "@/constant/messages";
import { getErrorMessage } from "@/lib/error-handler";

export interface Message {
  _id?: string;
  emailLists: string[];
  content: string;
  accessTime: string;
  code: string;
  status: "new" | "expiry" | "delete";
  viewCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}


export const useMessages = () => {
  const user = useStore((state) => state.user);

  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!user?.token) return [];

      const response = await api.get("/api/v1/messages");
      return response.data.data;
    },
    enabled: !!user?.token,
  });
};

export interface CreateMessagePayload {
  content: string;
  emailLists: string[];
  code: string;
  expiryTime?: string;
  customExpiryValue?: string;
  customExpiryUnit?: string;
}

export const useCreateMessage = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (newMessage: CreateMessagePayload) => {
      try {
        const response = await api.post("/api/v1/messages", newMessage);
        return response.data;
      } catch (error: any) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t((data.code || "MESSAGE_CREATED") as MessageCode));
    },
    onError: (error: Error) => {
      toast.error(t((error.message || "INTERNAL_ERROR") as MessageCode));
    },
  });
};

export interface UpdateMessagePayload extends Partial<CreateMessagePayload> {
  _id: string;
}

export const useUpdateMessage = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (updatedMessage: UpdateMessagePayload) => {
      const { _id, ...payload } = updatedMessage;
      try {
        const response = await api.patch(`/api/v1/messages/${_id}`, payload);
        return response.data;
      } catch (error: any) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t((data.code || "MESSAGE_UPDATED") as MessageCode));
    },
    onError: (error: Error) => {
      toast.error(t((error.message || "INTERNAL_ERROR") as MessageCode));
    },
  });
};

export const useGetMessageByCode = () => {
  return useMutation({
    mutationFn: (code: string) => getMessageByCode(code),
  });
};

export const useDeleteMessage = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (_id: string) => {
      try {
        const response = await api.delete(`/api/v1/messages/${_id}`);
        return response.data;
      } catch (error: any) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t((data.code || "MESSAGE_DELETED") as MessageCode));
    },
    onError: (error: Error) => {
      toast.error(t((error.message || "INTERNAL_ERROR") as MessageCode));
    },
  });
};

export const useRestoreMessage = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (_id: string) => {
      try {
        const response = await api.patch(`/api/v1/messages/${_id}/restore`);
        return response.data;
      } catch (error: any) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t((data.code || "MESSAGE_RESTORED") as MessageCode));
    },
    onError: (error: Error) => {
      toast.error(t((error.message || "INTERNAL_ERROR") as MessageCode));
    },
  });
};

export const useBulkDeleteMessages = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (ids: string[]) => {
      try {
        const response = await api.post("/api/v1/messages/bulk-delete", { ids });
        return response.data;
      } catch (error: any) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t((data.code || "MESSAGES_PROCESSED") as MessageCode));
    },
    onError: (error: Error) => {
      toast.error(t((error.message || "INTERNAL_ERROR") as MessageCode));
    },
  });
};

export const useBulkRestoreMessages = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (ids: string[]) => {
      try {
        const response = await api.post("/api/v1/messages/bulk-restore", { ids });
        return response.data;
      } catch (error: any) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t((data.code || "MESSAGES_RESTORED") as MessageCode));
    },
    onError: (error: Error) => {
      toast.error(t((error.message || "INTERNAL_ERROR") as MessageCode));
    },
  });
};
