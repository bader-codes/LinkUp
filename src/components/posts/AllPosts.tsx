import useInfiniteScroll from "@/hooks/shared/use-infinite-scroll";
import useAllPosts from "@/hooks/posts/use-all-posts";
import { useSearchParams } from "react-router-dom";
import PostSkeleton from "./PostSkeleton";
import PostCard from "./PostCard";

export default function AllPosts() {
  const [searchParams] = useSearchParams();

  const feed = searchParams.get("feed") === "following" ? "following" : "home";

  const {
    isLoading,
    isError,
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAllPosts(feed);

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-[95%] md:w-[85%] lg:w-[65%]">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div>Something went wrong.</div>;
  }

  return (
    <div className="my-2">
      {posts.map((post) => (
        <div key={post._id} className="mx-auto w-[95%] md:w-[85%] lg:w-[65%]">
          <PostCard post={post} />
        </div>
      ))}

      <div
        ref={sentinelRef}
        className="h-10 mx-auto w-[95%] md:w-[85%] lg:w-[65%]"
      >
        {isFetchingNextPage && <PostSkeleton />}
      </div>
    </div>
  );
}
