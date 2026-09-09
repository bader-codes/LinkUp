import type { NotificationsResponse } from "@/types/notifications/notifications-response";
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

    onSuccess: () => {
      // Update notifications immediately.
      queryClient.setQueriesData<InfiniteData<NotificationsResponse>>(
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
                  (notification) => ({
                    ...notification,
                    isRead: true,
                  }),
                ),
              },
            })),
          };
        },
      );

      // Refetch unread count from the server.
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}