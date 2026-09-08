import type { Post } from "@/types/posts/get-all-posts.response";
import PostTimestamp from "@/components/shared/PostTimestamp";
import { AuthContext } from "@/context/AuthContext";
import { HiDotsHorizontal } from "react-icons/hi";
import { CardHeader } from "@/components/ui/card";
import { FaBookmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
  post: Post;
  isShare: boolean;
}

export default function PostHeader({ post, isShare }: PostHeaderProps) {
  // Get User Data From Auth Context To Redirect My Profile
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("PostCard must be used within AuthContextProvider");
  }

  const { user } = authContext;

  // Redirect the post author to their own profile,
  // otherwise open the author's public profile.
  const profilePath =
    post.user._id === user?._id ? "/profile" : `/users/${post.user._id}`;

  return (
    <CardHeader className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link to={profilePath}>
          <img
            src={post.user.photo}
            alt={`${post.user.name} photo`}
            className="size-10 rounded-full"
          />
        </Link>

        <div>
          <Link
            to={profilePath}
            className="block text-lg font-semibold hover:underline"
          >
            {post.user.name}
          </Link>

          <PostTimestamp createdAt={post.createdAt} />
        </div>
      </div>
      
      {/* Post actions */}
      {isShare && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full text-sm hover:bg-gray-100 cursor-pointer">
            <HiDotsHorizontal className="size-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="flex w-40 flex-col items-center px-4 py-1 md:w-45">
            <DropdownMenuItem className="my-2 flex w-full cursor-pointer items-center justify-center gap-2 text-lg hover:bg-blue-500 hover:text-white">
              <span>Save post</span>
              <FaBookmark />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </CardHeader>
  );
}
