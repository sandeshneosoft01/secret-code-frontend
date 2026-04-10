import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useStore } from "@/store";
import { getMessageByCode } from "@/services/message-service";

export interface Message {
  id: string;
  _id?: string;
  emailLists: string[];
  content: string;
  accessTime: string;
  code: string;
  status: "new" | "expiry" | "delete";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message saved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
