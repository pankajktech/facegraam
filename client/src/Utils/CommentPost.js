import axios from "axios";
import { toast } from "sonner";

const CommentPost = async (e, { postid, comment, onSuccess }) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/post/comment`,
      {
        comment: comment,
        postid: postid,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      toast.success("Comment Added");
      setCommentText("");
      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    console.error("Error Commenting post:", error);
    toast.error(
      error.response.data.error ||
        "An error occurred while commenting the post."
    );
  }
};

export default CommentPost;
