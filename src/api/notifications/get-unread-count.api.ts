import type { UnreadCountResponse } from "@/types/notifications/unread-count-response ";
import { apiClient } from "../client";

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const token = localStorage.getItem("token");

  const response = await apiClient.get(
    "/notifications/unread-count",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};