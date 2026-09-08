import { getUserPosts } from "@/api/users/get-user-posts.api";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: ["user-posts", userId],

    queryFn: ({ pageParam }) => {
      return getUserPosts(userId, pageParam);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { currentPage, numberOfPages } =
        lastPage.meta.pagination;

      return currentPage < numberOfPages
        ? currentPage + 1
        : undefined;
    },

    enabled: Boolean(userId),
  });
}