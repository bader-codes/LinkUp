import { getSinglePost } from "@/api/posts/get-single-post.api";
import { useQuery } from "@tanstack/react-query";

export default function useSinglePost(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getSinglePost(postId),
    enabled: Boolean(postId),
  });
}
