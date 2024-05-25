const Chat = require("../../models/chat/chatModel");
const { Op } = require("sequelize");

const createChat = async (req, res) => {
  try {
    const { recieverid } = req.body;
    const senderid = req.user.userid;

    // Validate the request
    if (!recieverid) {
      return res.status(400).json({
        message: "Receiver ID is required for creating a one-to-one chat.",
      });
    }

    if (recieverid === senderid) {
      return res.status(400).json({
        message: "You cant chat with yourself.",
      });
    }

    // Prepare participants array and sort for consistency
    const participants = [parseInt(senderid, 10), parseInt(recieverid, 10)].sort((a, b) => a - b);

    // Check if a chat already exists between the participants
    const existingChat = await Chat.findOne({
      where: {
        participants: {
          [Op.contains]: participants,
        },
      },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists between the specified users.",
        chatid: existingChat.chatid,
      });
    }

    // Create a new chat
    const newChat = await Chat.create({
      participants,
    });

    return res.status(201).json({
      message: "Chat created successfully.",
      chatid: newChat.chatid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating the chat.",
    });
  }
};

module.exports = { createChat };
