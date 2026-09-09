import { apiClient } from "../client";

export const markNotificationAsRead = async (notificationId: string) => {
  const token = localStorage.getItem("token");

  const response = await apiClient.patch(
    `/notifications/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
