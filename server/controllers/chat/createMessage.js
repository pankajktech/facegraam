const ChatMessage = require("../../models/chat/chatMessageModel");
const Chat = require("../../models/chat/chatModel");

const createMessage = async (req, res) => {
  try {
    // Extract message data from request body
    const { chatid, content } = req.body;

    const senderid = req.user.userid;

    // Validate required fields
    if (!chatid || !senderid || !content) {
      return res.status(400).json({
        message: "All Fields Required",
      });
    }

    // Insert message into the database
    const newMessage = await ChatMessage.create({
      chatid,
      senderid,
      content,
    });

    if (newMessage) {
      const latestMessage = await ChatMessage.findOne({
        where: { messageid: newMessage.dataValues.messageid },
        include: [
          {
            model: Chat,
            as: "Chat",
            attributes: ["participants"],
          },
        ],
      });
      
      return res.status(201).json({ message: "success", chatData: latestMessage });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating a message." });
  }
};

module.exports = { createMessage };
