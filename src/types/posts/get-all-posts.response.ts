import type { Comment } from "../comments/get-comments.response";

export interface GetAllPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
  };
  meta: {
    pagination: Pagination;
  };
}

export interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface Post {
  _id: string;
  body: string;
  image: string | null;
  privacy: string;
  user: PostUser;

  sharedPost: Post | null;

  likes: string[];
  createdAt: string;

  commentsCount: number;
  topComment: Comment | null;

  sharesCount: number;
  likesCount: number;

  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface Pagination {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number | null;
  total: number;
}