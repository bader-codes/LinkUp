import type { GetSinglePostResponse } from "@/types/posts/get-single-post-response";
import { apiClient } from "../client";

export const getSinglePost = async (
  postId: string,
): Promise<GetSinglePostResponse> => {
  const token = localStorage.getItem("token");

  const response = await apiClient.get<GetSinglePostResponse>(
    `/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};