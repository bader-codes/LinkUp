import type { NotificationsResponse } from "@/types/notifications/notifications-response";
import type { UnreadCountResponse } from "@/types/notifications/unread-count-response ";
import { markAllNotificationsRead } from "@/api/notifications/mark-all-read.api";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export default function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,

    onMutate: async () => {
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

      // Optimistically mark all notifications as read
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

                notifications: page.data.notifications.map((notification) => ({
                  ...notification,
                  isRead: true,
                })),
              },
            })),
          };
        },
      );

      // Optimistically set unread count to 0
      queryClient.setQueryData<UnreadCountResponse>(
        ["notifications", "unread-count"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            data: {
              ...oldData.data,
              unreadCount: 0,
            },
          };
        },
      );

      return {
        previousNotifications,
        previousUnreadCount,
      };
    },

    onError: (_error, _variables, context) => {
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
        queryKey: ["notifications"],
        exact: true,
      });
    },
  });
}
