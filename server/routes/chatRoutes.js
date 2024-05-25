const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createChat } = require("../controllers/chat/createChat");
const { createMessage } = require("../controllers/chat/createMessage");
const getAllMessages = require("../controllers/chat/getAllMessages");
const getChatList = require("../controllers/chat/getChatList");

const chatRoutes = express.Router();

//Create chat and add to db
chatRoutes.route("/create/chat").post(authMiddleware, createChat);

chatRoutes.route("/get/chatlist").get(authMiddleware, getChatList);

//Create Message and add to db
chatRoutes.route("/send/message").post(authMiddleware, createMessage);

chatRoutes.route("/get/messages/:chatid").get(authMiddleware, getAllMessages);

module.exports = chatRoutes;
