import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "@/api/notifications/get-notifications.api";

const LIMIT = 20;

export default function useNotifications(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["notifications"],

    queryFn: ({ pageParam }) =>
      getNotifications({
        page: pageParam,
        limit: LIMIT,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.meta.pagination.nextPage ?? undefined;
    },

    enabled,

    refetchInterval: 1000 * 60,
  });
}
