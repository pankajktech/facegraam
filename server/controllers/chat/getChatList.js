const User = require("../../models/auth/userModel");
const Chat = require("../../models/chat/chatModel");
const { Op } = require("sequelize");
const redis = require("../../utils/redis");

const getChatList = async (req, res) => {
  try {
    const userid = req.user.userid;

    if (!userid) {
      return res.status(400).json({ message: "Userid is required" });
    }

    // Create a unique key for this query
    const redisKey = `chatList:${userid}`;

    // Try to fetch the result from Redis first
    const cachedChatList = await redis.get(redisKey);

    if (cachedChatList) {
      return res.status(200).json({ message: "success", chatList: JSON.parse(cachedChatList) });
    }

    // Fetch all chats that include the current user
    const chats = await Chat.findAll({
      where: { 
        participants: {
          [Op.contains]: [userid],
        },
      },
    });

    // For each chat, find the other participant's ID and fetch their user details
    const chatList = await Promise.all(chats.map(async (chat) => {
      const otherUserId = chat.participants.find(id => id !== userid);
      const otherUser = await User.findOne({ where: { userid: otherUserId } });
      return {
        ...chat.get(),
        otherUser: {
          name: otherUser.name,
          profilepic: otherUser.profilepic,
          userid: otherUser.userid,
        },
      };
    }));

    // Cache the result in Redis
    await redis.set(redisKey, JSON.stringify(chatList), "EX", 120);

    return res.status(200).json({ message: "success", chatList: chatList });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
};

module.exports = getChatList;