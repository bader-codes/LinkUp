export interface NotificationUser {
  _id: string;
  name: string;
  photo: string;
}

export interface NotificationCommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface NotificationComment {
  _id: string;
  content: string;
  commentCreator: NotificationCommentCreator;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
}

export interface NotificationEntity {
  _id: string;
  user?: string;
  commentsCount?: number;
  topComment?: NotificationComment | null;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
  id?: string;
  unavailable?: boolean;
}

export interface Notification {
  _id: string;
  recipient: NotificationUser;
  actor: NotificationUser;
  type: "like_post" | "comment_post" | "share_post";
  entityType: "post";
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: NotificationEntity;
}

export interface NotificationsPagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
  nextPage: number | null;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
  };
  meta: {
    feedMode: string;
    pagination: NotificationsPagination;
  };
}