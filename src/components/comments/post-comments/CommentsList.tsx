import CommentCard from "@/components/comments/comment-card/CommentCard";
import useInfiniteScroll from "@/hooks/shared/use-infinite-scroll";
import CommentSkeleton from "@/components/shared/CommentSkeleton";
import useComments from "@/hooks/comments/use-comments";
import { LiaCommentSlashSolid } from "react-icons/lia";

type CommentsListProps = {
  postId: string;
};

export default function CommentsList({ postId }: CommentsListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);

  const loadMoreRef = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CommentSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div>Failed to load comments.</div>;
  }

  const comments = data?.pages.flatMap((page) => page.data.comments) ?? [];

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <span className="text-lg text-gray-600">No comments yet.</span>

        <LiaCommentSlashSolid className="size-10" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {comments.map((comment) => (
        <CommentCard key={comment._id} comment={comment} />
      ))}

      <div ref={loadMoreRef} className="h-1" />

      {/* Loading placeholders while fetching the next page */}
      {isFetchingNextPage && (
        <div className="space-y-4">
          <CommentSkeleton />
        </div>
      )}
    </div>
  );
}
