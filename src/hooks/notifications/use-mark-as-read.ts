import type { NotificationsResponse } from "@/types/notifications/notifications-response";
import type { UnreadCountResponse } from "@/types/notifications/unread-count-response ";
import { markNotificationAsRead } from "@/api/notifications/mark-as-read.api";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export default function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),

    onSuccess: (_, notificationId) => {
      // Update notifications cache
      queryClient.setQueriesData<
        InfiniteData<NotificationsResponse>
      >(
        {
          queryKey: ["notifications"],
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            pages: oldData.pages.map((page) => ({
              ...page,

              data: {
                ...page.data,

                notifications: page.data.notifications.map(
                  (notification) =>
                    notification._id === notificationId
                      ? {
                          ...notification,
                          isRead: true,
                        }
                      : notification,
                ),
              },
            })),
          };
        },
      );

      // Update unread count
      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            data: {
              ...oldData.data,

              unreadCount: Math.max(
                oldData.data.unreadCount - 1,
                0,
              ),
            },
          };
        },
      );
    },
  });
}