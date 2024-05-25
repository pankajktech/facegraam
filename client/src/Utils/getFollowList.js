
import axios from "axios";


const getFollowList = async (userid) => {
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/followlist/${userid}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
       return response.data;
      }
    }
    catch (error) {
      console.error("Error fetching user:", error);
    }
  }

export default getFollowList;