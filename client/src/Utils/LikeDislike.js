import axios from "axios";
import { toast } from "sonner";

const handleLikeDislike = async ({ postid }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/post/likedislike/${postid}`,
      {
        withCredentials: true,
      }
    );
    if (response.status == 200) {
      toast.success(response.data.message);
    }
  } catch (error) {
    toast.error(error);
  }
};

const getLikeDislikeStatus = async ({ postid }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/post/like/status/${postid}`,
      {
        withCredentials: true,
      }
    );
    if (response.status == 200) {
      return response.data.liked
    }
  } catch (error) {
    toast.error(error);
  }
};

export { handleLikeDislike, getLikeDislikeStatus };


