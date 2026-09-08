import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharePostApi } from "@/api/posts/share-post.api";

export default function useSharePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sharePostApi,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}
