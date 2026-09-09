import { apiClient } from "../client";
import type { NotificationsResponse } from "@/types/notifications/notifications-response";

interface GetNotificationsParams {
  page: number;
  limit: number;
}

export const getNotifications = async ({
  page,
  limit,
}: GetNotificationsParams): Promise<NotificationsResponse> => {
  const token = localStorage.getItem("token");

  const response = await apiClient.get<NotificationsResponse>(
    "/notifications",
    {
      params: {
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};