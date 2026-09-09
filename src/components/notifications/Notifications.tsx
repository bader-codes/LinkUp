import useNotifications from "@/hooks/notifications/use-notifications";
import useMarkAllRead from "@/hooks/notifications/use-mark-all-read";
import useUnreadCount from "@/hooks/notifications/use-unread-count";
import useMarkAsRead from "@/hooks/notifications/use-mark-as-read";
import useInfiniteScroll from "@/hooks/shared/use-infinite-scroll";

import NotificationSkeleton from "./NotificationSkeleton";
import { useEffect, useRef, useState } from "react";
import NotificationItem from "./NotificationItem";
import { FaBell } from "react-icons/fa6";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Notifications() {
  // State
  const [open, setOpen] = useState(false);

  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  // Prevent Infinite Scroll from running before
  // the user actually scrolls the notifications list.
  const [hasScrolled, setHasScrolled] = useState(false);
  const notificationsContainerRef = useRef<HTMLDivElement | null>(null);

  // Queries & Mutations
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useNotifications(open);

  const { data: unreadCountResponse, refetch: refetchUnreadCount } =
    useUnreadCount();

  const { mutate: markAllRead } = useMarkAllRead();

  // Derived Data
  const unreadCount = unreadCountResponse?.data.unreadCount ?? 0;

  const notifications =
    data?.pages.flatMap((page) => page.data.notifications) ?? [];

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((notification) => !notification.isRead);

  // Reset Infinite Scroll when switching filters.
  useEffect(() => {
    setHasScrolled(false);
  }, [activeFilter]);

  // Infinite Scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage: Boolean(hasNextPage && hasScrolled),
    isFetchingNextPage,
    fetchNextPage,
    scrollContainerRef: notificationsContainerRef,
  });

  // Handlers
  const handleScroll = () => {
    if (!hasScrolled) {
      setHasScrolled(true);
    }
  };

  const handleFilterChange = (filter: "all" | "unread") => {
    if (activeFilter === filter) return;

    setActiveFilter(filter);
    setHasScrolled(false);

    notificationsContainerRef.current?.scrollTo({
      top: 0,
    });
  };

  // single unRead Notifications
  const { mutate: markAsRead } = useMarkAsRead();

  const handleMarkAsRead = (
    event: React.MouseEvent<HTMLButtonElement>,
    notificationId: string,
  ) => {
    event.stopPropagation();

    markAsRead(notificationId);
  };

  // Render
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Notification Trigger */}
      <PopoverTrigger
        type="button"
        aria-label="Notifications"
        className="relative flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-muted sm:size-10 md:size-11"
      >
        <FaBell className="size-5 md:size-6 lg:size-6.5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-background">
            {unreadCount >= 20 ? "20+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-70 p-0 sm:w-96">
        {/* Filter Tabs */}
        <div className="flex border-b px-2">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={`flex-1 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
              activeFilter === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-blue-600"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("unread")}
            className={`flex-1 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
              activeFilter === "unread"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-blue-600"
            }`}
          >
            Unread
          </button>
        </div>

        {/* Notifications Container */}
        <div
          ref={notificationsContainerRef}
          onScroll={handleScroll}
          className="h-100 overflow-y-auto"
        >
          {/* Notifications Header */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-background px-3 py-2">
            <span className="text-sm font-semibold">Notifications</span>

            <button
              type="button"
              onClick={() => {
                markAllRead();
                refetchUnreadCount();
              }}
              className="cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Mark all read
            </button>
          </div>

          {/* Initial Loading */}
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : (
            <>
              {/* Notifications List */}
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  onMarkAsRead={handleMarkAsRead}
                  key={notification._id}
                  notification={notification}
                  onClose={() => setOpen(false)}
                />
              ))}

              {/* Infinite Scroll Sentinel */}
              {hasNextPage && (
                <div ref={loadMoreRef}>
                  {isFetchingNextPage && (
                    <>
                      <NotificationSkeleton />
                      <NotificationSkeleton />
                      <NotificationSkeleton />
                    </>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!filteredNotifications.length && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}

              {/* End of Notifications */}
              {!hasNextPage && filteredNotifications.length > 0 && (
                <div className="py-3 text-center text-xs text-muted-foreground">
                  No More Notifications
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
