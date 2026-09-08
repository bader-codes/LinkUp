import type { GetAllPostsResponse } from "@/types/posts/get-all-posts.response";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getFollowingFeedAPI } from "@/api/posts/get-following-feed.api";
import { getAllPostsAPI } from "@/api/posts/get-all-posts.api";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";

export type FeedType = "home" | "following";

export const POSTS_QUERY_KEY = ["posts"];

const LIMIT = 10;
const REFRESH_INTERVAL = 15_000;

export default function useAllPosts(feed: FeedType) {
  const queryKey = [...POSTS_QUERY_KEY, feed];

  const query = useInfiniteQuery({
    queryKey,

    queryFn: ({ pageParam }) => {
      // Use the appropriate feed endpoint based on the selected feed
      if (feed === "following") {
        return getFollowingFeedAPI(pageParam, LIMIT);
      }

      return getAllPostsAPI(pageParam, LIMIT);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.meta.pagination.nextPage ?? undefined;
    },
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!query.data) return;

      // Refresh only the first page to pick up newly created posts
      const latestPage =
        feed === "following"
          ? await getFollowingFeedAPI(1, LIMIT)
          : await getAllPostsAPI(1, LIMIT);

      queryClient.setQueryData<InfiniteData<GetAllPostsResponse>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          // Replace the first page while preserving already loaded pages
          return {
            ...oldData,
            pages: [latestPage, ...oldData.pages.slice(1)],
          };
        },
      );
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [feed, query.data, queryKey]);

  const posts = query.data?.pages.flatMap((page) => page.data.posts) ?? [];

  return {
    ...query,
    posts,
  };
}
