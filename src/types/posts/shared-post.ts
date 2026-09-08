import type { PostUser } from "./get-all-posts.response";

export interface SharedPost {
  _id: string;
  body: string;
  image: string | null;
  privacy: string;
  user: PostUser;
  sharedPost: SharedPost | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: Comment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export interface SharePostResponse {
  success: boolean;
  message: string;
  data: {
    post: SharedPost;
  };
}
