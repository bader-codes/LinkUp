import { commentSchema, type CommentFormValues } from "@/schemas/commentSchema";
import type { Comment } from "@/types/comments/get-comments.response";
import useCreateComment from "@/hooks/comments/use-create-comment";
import type { Post } from "@/types/posts/get-all-posts.response";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useId, useState } from "react";
import { RiSendInsFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { LuCamera } from "react-icons/lu";

interface CommentInputProps {
  post: Post;
  onCommentCreated?: (comment: Comment) => void;
}

export default function CommentForm({
  post,
  onCommentCreated,
}: CommentInputProps) {
  const { mutateAsync: createComment } = useCreateComment();

  const [previewUrl, setPreviewUrl] = useState<string>();
  const [expanded, setExpanded] = useState(false);
  const id = useId();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { isValid },
  } = useForm<CommentFormValues>({
    defaultValues: {
      commentValue: "",
      image: null,
    },
    resolver: zodResolver(commentSchema),
  });

  const image = watch("image")?.[0];

  // Create a temporary preview URL for the selected image
  useEffect(() => {
    if (!image) {
      setPreviewUrl(undefined);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const imageRegister = register("image");

  // Create the comment and notify the parent with the newly created comment
  const commentSubmit = async (data: CommentFormValues) => {
    try {
      const response = await createComment({
        postId: post._id,
        content: data.commentValue,
        image: data.image?.[0],
      });

      onCommentCreated?.(response.data.comment);

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(commentSubmit)} className="w-full px-4 pb-3">
        <div
          className={`relative rounded-3xl bg-gray-200 transition-all duration-300 ${
            expanded ? "rounded-lg" : ""
          }`}
        >
          <Textarea
            {...register("commentValue")}
            placeholder="write a comment..."
            onFocus={() => setExpanded(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            className={`resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 ${
              expanded ? "max-h-70 pb-10" : "min-h-10"
            }`}
          />

          <div
            className={`pointer-events-none absolute bottom-2 left-3 right-3 flex items-center justify-between ${
              expanded ? "pt-2" : ""
            }`}
          >
            <button
              type="submit"
              disabled={!isValid}
              className={`pointer-events-auto cursor-pointer transition-all duration-200 disabled:cursor-not-allowed ${
                expanded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              <RiSendInsFill
                className={`size-5 ${isValid ? "text-primary" : ""}`}
              />
            </button>

            <label
              htmlFor={`${post._id}${id}`}
              className="pointer-events-auto cursor-pointer"
            >
              <LuCamera className="size-6" />
            </label>

            <input
              {...imageRegister}
              id={`${post._id}${id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                imageRegister.onChange(e);
                setExpanded(true);
              }}
            />
          </div>
        </div>
      </form>

      {previewUrl && (
        <div className="relative w-fit justify-center px-2 py-2">
          <img
            src={previewUrl}
            alt="Selected image"
            className="size-17 rounded-xl object-cover"
          />

          <button
            type="button"
            onClick={() => resetField("image")}
            className="absolute -right-2 -top-2 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black text-white"
          >
            <IoClose className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
