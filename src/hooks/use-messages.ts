import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useStore } from "@/store";
import { getMessageByCode } from "@/services/message-service";
import { useTranslations } from "next-intl";

export interface Message {
  id: string;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_LOCAL || "http://localhost:8000";

export const useMessages = () => {
  const user = useStore((state) => state.user);

  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!user?.token) return [];

      const response = await fetch(`${API_BASE_URL}/api/v1/messages`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const json = await response.json();
      return json.data;
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
      if (!user?.token) throw new Error("User not authenticated");

      const response = await fetch(`${API_BASE_URL}/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code || errorData.error || errorData.message || "INTERNAL_ERROR");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t(data.code || "MESSAGE_CREATED" as any));
    },
    onError: (error: Error) => {
      toast.error(t(error.message as any || "INTERNAL_ERROR"));
    },
  });
};

export interface UpdateMessagePayload extends Partial<CreateMessagePayload> {
  id: string;
}

export const useUpdateMessage = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (updatedMessage: UpdateMessagePayload) => {
      if (!user?.token) throw new Error("User not authenticated");

      const { id, ...payload } = updatedMessage;
      const response = await fetch(`${API_BASE_URL}/api/v1/messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code || errorData.error || errorData.message || "INTERNAL_ERROR");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t(data.code || "MESSAGE_UPDATED" as any));
    },
    onError: (error: Error) => {
      toast.error(t(error.message as any || "INTERNAL_ERROR"));
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
    mutationFn: async (id: string) => {
      if (!user?.token) throw new Error("User not authenticated");

      const response = await fetch(`${API_BASE_URL}/api/v1/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code || errorData.error || errorData.message || "INTERNAL_ERROR");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t(data.code || "MESSAGE_DELETED" as any));
    },
    onError: (error: Error) => {
      toast.error(t(error.message as any || "INTERNAL_ERROR"));
    },
  });
};

export const useRestoreMessage = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.token) throw new Error("User not authenticated");

      const response = await fetch(`${API_BASE_URL}/api/v1/messages/${id}/restore`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code || errorData.error || errorData.message || "INTERNAL_ERROR");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t(data.code || "MESSAGE_RESTORED" as any));
    },
    onError: (error: Error) => {
      toast.error(t(error.message as any || "INTERNAL_ERROR"));
    },
  });
};

export const useBulkDeleteMessages = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!user?.token) throw new Error("User not authenticated");

      const response = await fetch(`${API_BASE_URL}/api/v1/messages/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code || errorData.message || "INTERNAL_ERROR");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t(data.code || "MESSAGES_PROCESSED" as any));
    },
    onError: (error: Error) => {
      toast.error(t(error.message as any || "INTERNAL_ERROR"));
    },
  });
};

export const useBulkRestoreMessages = () => {
  const t = useTranslations('Messages');
  const queryClient = useQueryClient();
  const user = useStore((state) => state.user);

  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!user?.token) throw new Error("User not authenticated");

      const response = await fetch(`${API_BASE_URL}/api/v1/messages/bulk-restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code || errorData.message || "INTERNAL_ERROR");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(t(data.code || "MESSAGES_RESTORED" as any));
    },
    onError: (error: Error) => {
      toast.error(t(error.message as any || "INTERNAL_ERROR"));
    },
  });
};
