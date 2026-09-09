import CommentForm from "@/components/comments/create-comment/CommentForm";
import type { Post } from "@/types/posts/get-all-posts.response";
import PostActions from "@/components/posts/PostActions";
import PostContent from "@/components/posts/PostContent";
import PostHeader from "@/components/posts/PostHeader";
import { Card } from "@/components/ui/card";
import CommentsList from "./CommentsList";

type PostDetailsContentProps = {
  post: Post;
};

export default function PostDetailsContent({ post }: PostDetailsContentProps) {
  return (
    <Card className="mx-auto my-4 flex h-150 w-full flex-col overflow-hidden ring-0">
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
        <PostHeader post={post} />

        <PostContent post={post} />

        <PostActions post={post} />

        <CommentsList postId={post.id} />
      </div>

      <CommentForm post={post} />
    </Card>
  );
}
