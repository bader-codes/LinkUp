import type { Notification } from "@/types/notifications/notifications-response";
import PostTimestamp from "@/components/shared/PostTimestamp";
import { MdMarkAsUnread } from "react-icons/md";
import { Link } from "react-router-dom";

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: (
    event: React.MouseEvent<HTMLButtonElement>,
    notificationId: string,
  ) => void;
}

export default function NotificationItem({
  notification,
  onClose,
  onMarkAsRead,
}: NotificationItemProps) {
  const getMessage = () => {
    switch (notification.type) {
      case "like_post":
        return "liked your post.";

      case "comment_post":
        return "commented on your post.";

      case "share_post":
        return "shared your post.";
    }
  };

  return (
    <div className="group relative">
      <Link
        to={`/post/${notification.entityId}`}
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/50"
      >
        <img
          src={notification.actor.photo}
          alt={notification.actor.name}
          className="size-10 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm leading-5 ${
              notification.isRead ? "text-gray-500" : "text-gray-700"
            }`}
          >
            <span className="font-semibold">{notification.actor.name}</span>{" "}
            <span>{getMessage()}</span>
          </p>

          <div
            className={`mt-1 text-xs ${
              notification.isRead ? "text-gray-500" : "text-gray-700"
            }`}
          >
            <PostTimestamp createdAt={notification.createdAt} />
          </div>
        </div>
      </Link>

      {!notification.isRead && (
        <button
          type="button"
          onClick={(event) => onMarkAsRead(event, notification._id)}
          aria-label="Mark as read"
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full p-2 opacity-0 transition-opacity group-hover:opacity-100 bg-gray-200"
        >
          <MdMarkAsUnread className="size-5" />
        </button>
      )}
    </div>
  );
}
