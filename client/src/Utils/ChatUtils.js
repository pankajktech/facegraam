import axios from "axios";

export const getAllMessages = async (chatid) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/get/messages/${chatid}`,
      {
        withCredentials: true,
      }
    );

    if (response.status == 200) {
      return response.data.chats;
    }
  } catch (error) {
    toast.error(error);
  }
};
