import type { Post } from "@/types/posts/get-all-posts.response";
import useSharePost from "@/hooks/posts/use-share-post";
import useLikePost from "@/hooks/posts/use-like-post";
import { RiShareForwardFill } from "react-icons/ri";
import { AuthContext } from "@/context/AuthContext";
import { CardFooter } from "@/components/ui/card";
import { BiSolidLike } from "react-icons/bi";
import { GoComment } from "react-icons/go";
import { toast } from "react-toastify";
import { useContext } from "react";
import axios from "axios";

interface PostActionsProps {
  post: Post;

  // Optional because PostActions is also rendered inside DescComment
  // where the Comment action doesn't need to open another dialog.
  onCommentClick?: () => void;
}

export default function PostActions({
  post,
  onCommentClick,
}: PostActionsProps) {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const { mutate: likePost } = useLikePost();

  const liked = user ? post.likes.includes(user._id) : false;
  const likesCount = post.likesCount;

  const handleLike = () => {
    if (!user) return;

    likePost({
      postId: post._id,
      userId: user._id,
    });
  };

  const { mutate, isPending } = useSharePost();

  const handleSharePost = () => {
    if (isPending) return;

    const toastId = toast.loading("Post is being shared", {
      position: "bottom-right",
    });

    mutate(post._id, {
      onSuccess: () => {
        toast.update(toastId, {
          render: "The post was successfully shared.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
      },

      onError: (error) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || "Something went wrong."
          : "Something went wrong.";

        toast.update(toastId, {
          render: message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
      },
    });

    console.log(window.scrollY);
  };

  return (
    <CardFooter className="w-full border-none bg-white px-6 p-0!">
      <div className="grid w-full grid-cols-3 py-2 px-4">
        {/* Like */}
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className="group flex cursor-pointer items-center justify-center rounded-md py-2 text-gray-500 transition-colors hover:text-blue-600"
            >
              <BiSolidLike
                className={`size-5 transition-transform group-hover:scale-110 ${
                  liked ? "fill-blue-600 text-blue-600" : ""
                }`}
              />
            </button>

            <span className="text-sm font-medium">
              {likesCount > 0 ? likesCount : ""}
            </span>
          </div>
        </div>

        {/* Comment */}
        <button
          type="button"
          onClick={onCommentClick}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <GoComment className="size-5 transition-transform group-hover:scale-110" />
            </div>

            <span className="text-sm font-medium">
              {post.commentsCount > 0 ? post.commentsCount : ""}
            </span>
          </div>
        </button>

        {/* Share */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-1">
            <button
              onClick={handleSharePost}
              type="button"
              className="group px-2 flex cursor-pointer items-center justify-center rounded-lg py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600"
            >
              <RiShareForwardFill className="size-5 transition-transform group-hover:scale-110" />
            </button>

            {post.sharesCount > 0 && <span>{post.sharesCount}</span>}
          </div>
        </div>
      </div>
    </CardFooter>
  );
}
