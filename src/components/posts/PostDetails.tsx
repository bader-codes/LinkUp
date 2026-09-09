import PostDetailsContent from "../comments/post-comments/PostDetailsContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useSinglePost from "@/hooks/posts/use-single-post";
import { useNavigate, useParams } from "react-router-dom";

export default function PostDetails() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const { data, isLoading, isError } = useSinglePost(postId!);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      navigate("/");
    }
  };

  return (
    <Dialog open={Boolean(postId)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto scrollbar-hide sm:max-w-2xl">
        {isLoading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        )}

        {isError && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Post not found
          </div>
        )}

        {data?.data.post && <PostDetailsContent post={data.data.post} />}
      </DialogContent>
    </Dialog>
  );
}
