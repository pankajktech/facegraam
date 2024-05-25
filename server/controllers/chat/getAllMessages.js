const ChatMessage = require("../../models/chat/chatMessageModel");
const redis = require("../../utils/redis");



const getAllMessages = async (req, res) => {
  try {
    const { chatid } = req.params;

    if (!chatid) {
      return res.status(400).json({ message: "Chatid is required" });
    }

    // Create a unique key for this query
    const redisKey = `messages:${chatid}`;

    // Try to fetch the result from Redis first
    const cachedMessages = await redis.get(redisKey);

    if (cachedMessages) {
      return res.status(200).json({ message: "success", chats: JSON.parse(cachedMessages) });
    }

    // Fetch all messages for the given chatId
    const messages = await ChatMessage.findAll({
      where: { chatid },
    });

    // Cache the result in Redis
    await redis.set(redisKey, JSON.stringify(messages), "EX", 60);

    return res.status(200).json({ message: "success", chats: messages });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
};

module.exports = getAllMessages;
