import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useStore } from "@/store";
import { getMessageByCode } from "@/services/message-service";
import { getFriendlyMessage } from "@/constant/messages";

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
        throw new Error(errorData.error || errorData.message || "Failed to create message");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(getFriendlyMessage(data.message || "MESSAGE_CREATED"));
    },
    onError: (error: Error) => {
      toast.error(getFriendlyMessage(error.message || "INTERNAL_ERROR"));
    },
  });
};

export interface UpdateMessagePayload extends Partial<CreateMessagePayload> {
  id: string;
}

export const useUpdateMessage = () => {
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
        throw new Error(errorData.error || errorData.message || "Failed to update message");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(getFriendlyMessage(data.message || "MESSAGE_UPDATED"));
    },
    onError: (error: Error) => {
      toast.error(getFriendlyMessage(error.message || "INTERNAL_ERROR"));
    },
  });
};

export const useGetMessageByCode = () => {
  return useMutation({
    mutationFn: (code: string) => getMessageByCode(code),
  });
};

export const useDeleteMessage = () => {
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
        throw new Error(errorData.error || errorData.message || "Failed to delete message");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(getFriendlyMessage(data.message || "MESSAGE_DELETED"));
    },
    onError: (error: Error) => {
      toast.error(getFriendlyMessage(error.message || "INTERNAL_ERROR"));
    },
  });
};

export const useRestoreMessage = () => {
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
        throw new Error(errorData.error || errorData.message || "Failed to restore message");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(getFriendlyMessage(data.message || "MESSAGE_RESTORED"));
    },
    onError: (error: Error) => {
      toast.error(getFriendlyMessage(error.message || "INTERNAL_ERROR"));
    },
  });
};

export const useBulkDeleteMessages = () => {
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
        throw new Error(errorData.message || "Failed to delete messages");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(getFriendlyMessage(data.message || "MESSAGES_PROCESSED"));
    },
    onError: (error: Error) => {
      toast.error(getFriendlyMessage(error.message || "INTERNAL_ERROR"));
    },
  });
};

export const useBulkRestoreMessages = () => {
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
        throw new Error(errorData.message || "Failed to restore messages");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(getFriendlyMessage(data.message || "MESSAGES_RESTORED"));
    },
    onError: (error: Error) => {
      toast.error(getFriendlyMessage(error.message || "INTERNAL_ERROR"));
    },
  });
};
