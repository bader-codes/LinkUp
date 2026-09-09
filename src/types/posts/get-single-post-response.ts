import type { Post } from "./get-all-posts.response";

export interface GetSinglePostResponse {
  success: boolean;
  message: string;
  data: {
    post: Post;
  };
}