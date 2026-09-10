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

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
        exact: true,
      });

      // Save previous notifications cache for rollback
      const previousNotifications = queryClient.getQueriesData<
        InfiniteData<NotificationsResponse>
      >({
        queryKey: ["notifications"],
        exact: true,
      });

      // Save previous unread count for rollback
      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
      );

      // Check if the notification is actually unread
      let wasUnread = false;

      previousNotifications.forEach(([, data]) => {
        data?.pages.forEach((page) => {
          const notification = page.data.notifications.find(
            (notification) => notification._id === notificationId,
          );

          if (notification && !notification.isRead) {
            wasUnread = true;
          }
        });
      });

      // Optimistically mark notification as read
      queryClient.setQueriesData<InfiniteData<NotificationsResponse>>(
        {
          queryKey: ["notifications"],
          exact: true,
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            pages: oldData.pages.map((page) => ({
              ...page,

              data: {
                ...page.data,

                notifications: page.data.notifications.map((notification) =>
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

      // Only decrease the counter if it was unread
      if (wasUnread) {
        queryClient.setQueryData<UnreadCountResponse>(
          ["notifications", "unread-count"],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,

              data: {
                ...oldData.data,

                unreadCount: Math.max(oldData.data.unreadCount - 1, 0),
              },
            };
          },
        );
      }

      return {
        previousNotifications,
        previousUnreadCount,
      };
    },

    onError: (_error, _notificationId, context) => {
      // Rollback notifications
      context?.previousNotifications.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      // Rollback unread count
      queryClient.setQueryData(
        ["notifications", "unread-count"],
        context?.previousUnreadCount,
      );
    },

    onSettled: () => {
      // Make sure the cache matches the server
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
        exact: true,
      });
    },
  });
}
