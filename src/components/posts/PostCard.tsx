import type { Comment } from "@/types/comments/get-comments.response";
import type { Post } from "@/types/posts/get-all-posts.response";

import CommentForm from "../comments/create-comment/CommentForm";
import CommentCard from "../comments/comment-card/CommentCard";
import TopComment from "../comments/top-comment/TopComment";

import { Card, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import PostContent from "../posts/PostContent";
import PostActions from "../posts/PostActions";
import PostHeader from "../posts/PostHeader";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [newComment, setNewComment] = useState<Comment | null>(null);

  const navigate = useNavigate();

  return (
    <Card className="my-4">
      <PostHeader post={post} isShare={post.isShare} />

      {post.sharedPost ? (
        <Card className="mx-4 rounded-sm px-2">
          <CardHeader>
            <PostHeader post={post.sharedPost} />
            <PostContent post={post.sharedPost} />
          </CardHeader>
        </Card>
      ) : (
        <PostContent post={post} />
      )}

      <PostActions post={post} />

      {post.commentsCount > 1 && (
        <button
          type="button"
          onClick={() => navigate(`/post/${post._id}`)}
          className="ms-5 flex flex-1 cursor-pointer text-gray-600 hover:underline"
        >
          show more comments
        </button>
      )}

      {post.topComment && <TopComment comment={post.topComment} />}

      {newComment && <CommentCard comment={newComment} />}

      {post.commentsCount > 0 && (
        <CommentForm
          post={post}
          onCommentCreated={(comment) => setNewComment(comment)}
        />
      )}
    </Card>
  );
}
