import type { SharePostResponse } from "@/types/posts/shared-post";
import { apiClient } from "../client";

export const sharePostApi = async (
  postId: string,
): Promise<SharePostResponse> => {
  const token = localStorage.getItem("token");

  const response = await apiClient.post(
    `/posts/${postId}/share`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
