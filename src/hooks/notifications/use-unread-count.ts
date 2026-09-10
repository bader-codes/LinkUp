import { getUnreadCount } from "@/api/notifications/get-unread-count.api";
import { useQuery } from "@tanstack/react-query";

export default function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 1000 * 60,
  });
}
