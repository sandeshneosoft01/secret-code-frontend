import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useStore } from "@/store";

export interface Message {
  id: string;
  emailLists: string[];
  content: string;
  accessTime: string;
  code: string;
  status: "new" | "expiry" | "delete";
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
