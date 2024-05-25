import axios from "axios";

export const getPostById = async (postid) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/post/${postid}`,
      {
        withCredentials: true,
      }
    );
    if (response.status == 200) {
      return response.data.post;
    }
  } catch (error) {
    console.log(error.message);
  }
};
