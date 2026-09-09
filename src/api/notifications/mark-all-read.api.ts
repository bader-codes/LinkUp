import { apiClient } from "../client";

export const markAllNotificationsRead = async () => {
  const token = localStorage.getItem("token");

  const response = await apiClient.patch(
    "/notifications/read-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};