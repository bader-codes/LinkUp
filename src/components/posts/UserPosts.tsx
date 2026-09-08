import PostSkeleton from "@/components/posts/PostSkeleton";
import useUserPosts from "@/hooks/users/use-user-posts";
import PostCard from "./PostCard";

type UserPostsProps = {
  userId: string;
};

export default function UserPosts({ userId }: UserPostsProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPosts(userId);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (isError) {
    return <div>Something went wrong.</div>;
  }

  const posts =
    data?.pages.flatMap((page) => page.data.posts) ?? [];

  if (posts.length === 0) {
    return <div>No posts yet.</div>;
  }

  return (
    <div className="my-2">
      {posts.map((post) => (
        <div key={post._id} className="mx-auto w-full">
          <PostCard post={post} />
        </div>
      ))}

      {hasNextPage && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full rounded-md border px-6 py-2 cursor-pointer"
          >
            {isFetchingNextPage ? "Loading..." : "Show More Posts"}
          </button>
        </div>
      )}
    </div>
  );
}